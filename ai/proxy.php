<?php
/**
 * Compass Claw AI Proxy  —  /ai/proxy.php
 * --------------------------------------------------------------------------
 * The ONE place API keys live. The browser only ever talks to this endpoint
 * (same-origin); this endpoint talks to the AI providers. Keys never appear in
 * client JS/HTML/responses/errors.
 *
 * Provider chain (first success wins; falls through on 429/5xx/network error):
 *   1. Groq (primary)      — llama-3.3-70b-versatile, then llama-3.1-8b-instant
 *   2. OpenRouter (fallback, FREE models only)
 *        google/gemma-4-31b-it:free
 *        meta-llama/llama-3.3-70b-instruct:free
 *        qwen/qwen3-next-80b-a3b-instruct:free
 *
 * Contract:  POST JSON { "task": "...", "payload": {...} }
 *   task "cover_letter" | "tailor_resume"
 * Response:  { ok:true, content, provider, model_used }
 *        or  { ok:false, error:"AI temporarily busy — try again in a moment" }
 *
 * Reusable core: to clone for another product, copy /ai/ and swap the keys in
 * config.php. The client sends structured data only — never raw prompts.
 */

define('CC_APP', true);
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
// Same-origin only: this API is for our own pages.
header('X-Content-Type-Options: nosniff');

function respond($arr) { echo json_encode($arr); exit; }
function busy() { respond(['ok' => false, 'error' => 'AI temporarily busy — try again in a moment']); }

// ---- Only POST is allowed. A bare GET must reveal nothing. -----------------
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    respond(['ok' => false, 'error' => 'POST only']);
}

$raw = file_get_contents('php://input');
$req = json_decode($raw, true);
if (!is_array($req)) respond(['ok' => false, 'error' => 'Invalid request']);

$task    = $req['task']    ?? '';
$payload = $req['payload'] ?? [];
if (!is_array($payload)) $payload = [];

// --------------------------------------------------------------------------
// Prompt building is SERVER-SIDE. The client only sends structured data.
// --------------------------------------------------------------------------
function fmt_profile($p) {
    $summary = trim($p['summary'] ?? '');
    $skills  = trim($p['skills']  ?? '');
    $history = trim($p['history'] ?? '');
    $out = '';
    if ($summary) $out .= "PROFILE SUMMARY:\n$summary\n\n";
    if ($skills)  $out .= "SKILLS:\n$skills\n\n";
    if ($history) $out .= "WORK HISTORY:\n$history\n";
    return trim($out);
}

function fmt_job($j) {
    $bits = [];
    foreach (['title'=>'Role','company'=>'Company','location'=>'Location',
              'apply_type'=>'Type','fit_summary'=>'Fit summary',
              'why_fit'=>'Why it fits','description'=>'Description'] as $k=>$label) {
        $v = trim($j[$k] ?? '');
        if ($v !== '') $bits[] = "$label: $v";
    }
    return implode("\n", $bits);
}

function build_messages($task, $payload) {
    $job     = is_array($payload['job'] ?? null) ? $payload['job'] : [];
    $profile = is_array($payload['profile'] ?? null) ? $payload['profile'] : [];
    $jobStr  = fmt_job($job);
    $profStr = fmt_profile($profile);

    if ($task === 'cover_letter') {
        $sys = "You are an expert cover-letter writer for a senior technical "
             . "candidate. Write a confident, specific, non-generic cover letter. "
             . "Rules: reference the exact company and role and weave in 2-3 "
             . "CONCRETE matching skills drawn ONLY from the candidate profile. "
             . "180-260 words. Plain text, no markdown, no headers, no address "
             . "block, no date. Do NOT open with 'I am writing to express my "
             . "interest' or any cliche. Do NOT invent employers, dates, metrics, "
             . "or facts beyond the profile. End with a short sign-off line and "
             . "the name 'Nick'. Output ONLY the letter text — no preamble, no "
             . "explanation, no <think> reasoning.";
        $usr = "CANDIDATE PROFILE:\n$profStr\n\n----\nJOB POSTING:\n$jobStr\n\n----\n"
             . "Write the cover letter now.";
        return [['role'=>'system','content'=>$sys],['role'=>'user','content'=>$usr]];
    }

    if ($task === 'tailor_resume') {
        $sys = "You optimize a candidate's resume for a specific job posting. "
             . "Output EXACTLY two lines and nothing else:\n"
             . "SUMMARY: <one rewritten professional-summary paragraph, 2-4 "
             . "sentences, tuned to this posting, first person implied, no name>\n"
             . "SKILLS: <a single comma-separated line of the candidate's most "
             . "relevant skills, reordered so the ones this posting cares about "
             . "come first>\n"
             . "Use ONLY skills/facts present in the candidate profile — never "
             . "invent. No markdown, no headers beyond the two labels, no <think> "
             . "reasoning, no extra commentary.";
        $usr = "CANDIDATE PROFILE:\n$profStr\n\n----\nJOB POSTING:\n$jobStr\n\n----\n"
             . "Produce the SUMMARY and SKILLS lines now.";
        return [['role'=>'system','content'=>$sys],['role'=>'user','content'=>$usr]];
    }

    return null;
}

// --------------------------------------------------------------------------
// Provider callers. Return [httpCode, contentStringOrNull].
// --------------------------------------------------------------------------
function call_endpoint($url, $authKey, $model, $messages, $extraHeaders = []) {
    $body = json_encode([
        'model'       => $model,
        'messages'    => $messages,
        'max_tokens'  => 700,
        'temperature' => 0.6,
    ]);
    $headers = array_merge([
        'Authorization: Bearer ' . $authKey,
        'Content-Type: application/json',
    ], $extraHeaders);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 60,
        CURLOPT_CONNECTTIMEOUT => 15,
    ]);
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($resp === false || $code === 0) return [0, null];      // network error
    if ($code !== 200) return [$code, null];

    $d = json_decode($resp, true);
    $content = $d['choices'][0]['message']['content'] ?? null;
    if ($content === null) return [$code, null];
    return [$code, $content];
}

/** Strip any chain-of-thought / reasoning preamble some models leak. */
function clean_output($text) {
    if ($text === null) return null;
    // Remove <think>...</think> blocks (nvidia-style).
    $text = preg_replace('/<think>.*?<\/think>/is', '', $text);
    $text = preg_replace('/<\/?think>/i', '', $text);
    // Remove a leading "Here is ...:" style preamble line if present.
    $text = preg_replace('/^\s*(here(\'s| is)[^\n]*:\s*)/i', '', $text);
    return trim($text);
}

// --------------------------------------------------------------------------
// The chain.
// --------------------------------------------------------------------------
function run_chain($messages) {
    // 1) Groq primary.
    $groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    foreach ($groqModels as $m) {
        list($code, $content) = call_endpoint(
            'https://api.groq.com/openai/v1/chat/completions',
            GROQ_KEY, $m, $messages
        );
        if ($content !== null) return ['groq', $m, $content];
        // fall through on 429/5xx/0; on other 4xx also just try next.
    }

    // 2) OpenRouter fallback — FREE models only.
    $orModels = [
        'google/gemma-4-31b-it:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen3-next-80b-a3b-instruct:free',
    ];
    $orHeaders = [
        'HTTP-Referer: https://compassclaw.com',
        'X-Title: Compass Claw Job Engine',
    ];
    foreach ($orModels as $m) {
        list($code, $content) = call_endpoint(
            'https://openrouter.ai/api/v1/chat/completions',
            OPENROUTER_KEY, $m, $messages, $orHeaders
        );
        if ($content !== null) return ['openrouter', $m, $content];
    }

    return null;
}

// --------------------------------------------------------------------------
// Dispatch.
// --------------------------------------------------------------------------
$messages = build_messages($task, $payload);
if ($messages === null) respond(['ok' => false, 'error' => 'Unknown task']);

$result = run_chain($messages);
if ($result === null) busy();

list($provider, $model, $content) = $result;
$content = clean_output($content);
if ($content === null || $content === '') busy();

respond([
    'ok'         => true,
    'content'    => $content,
    'provider'   => $provider,
    'model_used' => $model,
]);
