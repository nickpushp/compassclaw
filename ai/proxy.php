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
 * Response (cover_letter):  { ok:true, content, provider, model_used }
 * Response (tailor_resume): { ok:true, content, summary, skills[],
 *                             provider, model_used }
 *   where `content` is the FULL assembled plain-text resume and the client can
 *   also build a print/PDF view. Work history/contact/education/certs come from
 *   the server-side master resume and can never be hallucinated.
 *        or  { ok:false, error:"AI temporarily busy — try again in a moment" }
 *
 * Reusable core: to clone for another product, copy /ai/ and swap the keys in
 * config.php. The client sends structured data only — never raw prompts.
 */

define('CC_APP', true);
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
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
function fmt_master_for_prompt($m) {
    // Compact view of the master resume the model uses as ground truth.
    $out  = "NAME: {$m['name']}\n";
    $out .= "CURRENT SUMMARY:\n{$m['summary']}\n\n";
    $out .= "SKILL POOL (choose only from these):\n{$m['skill_pool']}\n\n";
    $out .= "WORK HISTORY:\n";
    foreach ($m['experience'] as $x) {
        $out .= "- {$x['role']}, {$x['org']} ({$x['dates']})\n";
    }
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

function build_messages($task, $payload, $master) {
    $job     = is_array($payload['job'] ?? null) ? $payload['job'] : [];
    $jobStr  = fmt_job($job);
    $masterStr = fmt_master_for_prompt($master);

    if ($task === 'cover_letter') {
        $sys = "You are an expert cover-letter writer for a senior technical "
             . "candidate. Write a confident, specific, non-generic cover letter. "
             . "Rules: reference the exact company and role and weave in 2-3 "
             . "CONCRETE matching skills drawn ONLY from the candidate profile. "
             . "180-260 words. Plain text, no markdown, no headers, no address "
             . "block, no date. Do NOT open with 'I am writing to express my "
             . "interest' or any cliche. Banned phrases: 'excited to leverage', "
             . "'passion for', 'results-driven', 'seasoned', 'proven track record', "
             . "'dynamic', 'synergy', 'wheelhouse'. Do NOT invent employers, dates, "
             . "metrics, or facts beyond the profile. End with a short sign-off line "
             . "and the name 'Nick'. Output ONLY the letter text — no preamble, no "
             . "explanation, no <think> reasoning.";
        $usr = "CANDIDATE PROFILE:\n$masterStr\n\n----\nJOB POSTING:\n$jobStr\n\n----\n"
             . "Write the cover letter now.";
        return [['role'=>'system','content'=>$sys],['role'=>'user','content'=>$usr]];
    }

    if ($task === 'tailor_resume') {
        // Model returns STRICT JSON only. It tailors the summary and picks the
        // most relevant skills. Everything else is assembled by PHP from the
        // authoritative master resume — so nothing factual can be invented.
        $sys = "You tailor a candidate's resume to ONE job posting. Return STRICT "
             . "JSON and nothing else — no markdown fences, no commentary, no "
             . "<think> reasoning. Schema:\n"
             . "{\n"
             . '  "summary": "<a rewritten professional-summary paragraph, 3-4 '
             . 'sentences, tuned to THIS posting. Third-person implied (no I/my), '
             . 'no name. Concrete and specific. Keep only real facts, metrics, and '
             . 'tools from the candidate profile.>",' . "\n"
             . '  "top_skills": ["<8-12 skills chosen ONLY from the SKILL POOL, '
             . 'ordered so the ones this posting cares about come first>"]' . "\n"
             . "}\n"
             . "Rules: Use ONLY skills/facts present in the candidate profile — "
             . "never invent employers, tools, metrics, or certifications. Banned "
             . "phrases in the summary: 'excited to leverage', 'passion for', "
             . "'results-driven', 'seasoned', 'proven track record', 'dynamic', "
             . "'synergy', 'wheelhouse', 'go-getter'. Output ONLY the JSON object.";
        $usr = "CANDIDATE PROFILE (ground truth):\n$masterStr\n\n----\nJOB POSTING:\n"
             . "$jobStr\n\n----\nReturn the tailored JSON now.";
        return [['role'=>'system','content'=>$sys],['role'=>'user','content'=>$usr]];
    }

    return null;
}

// --------------------------------------------------------------------------
// Provider callers. Return [httpCode, contentStringOrNull].
// --------------------------------------------------------------------------
function call_endpoint($url, $authKey, $model, $messages, $maxTokens, $extraHeaders = []) {
    $body = json_encode([
        'model'       => $model,
        'messages'    => $messages,
        'max_tokens'  => $maxTokens,
        'temperature' => 0.55,
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
    $text = preg_replace('/<think>.*?<\/think>/is', '', $text);
    $text = preg_replace('/<\/?think>/i', '', $text);
    $text = preg_replace('/^\s*(here(\'s| is)[^\n]*:\s*)/i', '', $text);
    return trim($text);
}

/** Pull the first JSON object out of a model response, tolerating fences. */
function extract_json($text) {
    if ($text === null) return null;
    $text = preg_replace('/```(?:json)?/i', '', $text);
    $start = strpos($text, '{');
    $end   = strrpos($text, '}');
    if ($start === false || $end === false || $end <= $start) return null;
    $json = substr($text, $start, $end - $start + 1);
    $d = json_decode($json, true);
    return is_array($d) ? $d : null;
}

// --------------------------------------------------------------------------
// The chain.
// --------------------------------------------------------------------------
function run_chain($messages, $maxTokens = 700) {
    // 1) Groq primary.
    $groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    foreach ($groqModels as $m) {
        list($code, $content) = call_endpoint(
            'https://api.groq.com/openai/v1/chat/completions',
            GROQ_KEY, $m, $messages, $maxTokens
        );
        if ($content !== null) return ['groq', $m, $content];
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
            OPENROUTER_KEY, $m, $messages, $maxTokens, $orHeaders
        );
        if ($content !== null) return ['openrouter', $m, $content];
    }

    return null;
}

// --------------------------------------------------------------------------
// Resume assembly — PHP builds the FULL doc from the master resume.
// --------------------------------------------------------------------------
function assemble_resume($master, $summary, $topSkills) {
    $c = $master['contact'];
    $L = [];
    $L[] = $master['name'];
    $line2 = trim(implode(' | ', array_filter([
        $c['location'] ?? '', $c['email'] ?? '', $c['phone'] ?? '', $c['linkedin'] ?? '',
    ])));
    if ($line2 !== '') $L[] = $line2;
    $L[] = strtoupper($master['title']);
    $L[] = '';
    $L[] = 'PROFESSIONAL SUMMARY';
    $L[] = $summary;
    $L[] = '';

    // Lead "Key Skills" line (tailored order) + grouped canonical skills.
    $L[] = 'CORE SKILLS';
    if (!empty($topSkills)) {
        $L[] = 'Key Skills: ' . implode(', ', $topSkills);
    }
    foreach ($master['skill_groups'] as $label => $skills) {
        $L[] = "$label: $skills";
    }
    $L[] = '';

    $L[] = 'PROFESSIONAL EXPERIENCE';
    $L[] = '';
    foreach ($master['experience'] as $x) {
        $L[] = $x['role'];
        $meta = trim($x['org'] . ($x['loc'] ? ' | ' . $x['loc'] : '') . ' | ' . $x['dates']);
        $L[] = $meta;
        foreach ($x['bullets'] as $b) $L[] = '- ' . $b;
        $L[] = '';
    }

    $L[] = 'EDUCATION';
    foreach ($master['education'] as $e) $L[] = $e;
    $L[] = '';

    $L[] = 'CERTIFICATIONS';
    foreach ($master['certifications'] as $cert) $L[] = '- ' . $cert;

    return implode("\n", $L);
}

// --------------------------------------------------------------------------
// Dispatch.
// --------------------------------------------------------------------------
$master   = cc_master_resume();
$messages = build_messages($task, $payload, $master);
if ($messages === null) respond(['ok' => false, 'error' => 'Unknown task']);

if ($task === 'tailor_resume') {
    $result = run_chain($messages, 900);
    if ($result === null) busy();
    list($provider, $model, $content) = $result;
    $content = clean_output($content);
    $parsed  = extract_json($content);

    // Tailored pieces, with safe fallbacks to the master so we ALWAYS return a
    // complete, submittable resume even if the model misbehaves.
    $summary = $master['summary'];
    if ($parsed && !empty($parsed['summary']) && is_string($parsed['summary'])) {
        $summary = trim($parsed['summary']);
    }
    $topSkills = [];
    if ($parsed && !empty($parsed['top_skills']) && is_array($parsed['top_skills'])) {
        foreach ($parsed['top_skills'] as $s) {
            $s = trim((string)$s);
            if ($s !== '') $topSkills[] = $s;
        }
        $topSkills = array_slice($topSkills, 0, 14);
    }

    $full = assemble_resume($master, $summary, $topSkills);

    respond([
        'ok'         => true,
        'content'    => $full,
        'summary'    => $summary,
        'skills'     => $topSkills,
        'provider'   => $provider,
        'model_used' => $model,
    ]);
}

// cover_letter (and any future plain-text task).
$result = run_chain($messages, 700);
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
