<?php
/**
 * /jobs/status.php  —  persist application status per job.
 * --------------------------------------------------------------------------
 * Behind the SAME Basic Auth gate as the dashboard (auth.php), so only the
 * authenticated operator can write. Stores a flat { id => status } map in
 * status.json next to this file. That file is NOT part of the git repo, so the
 * FTP deploy never overwrites it — statuses persist across deploys.
 *
 * Contract:  POST JSON { "id": "<job id>", "status": "New|Applied|Interviewing|Passed|Rejected" }
 * Response:  { ok:true, id, status }  |  { ok:false, error }
 *
 * HARD RULE: append/update only. We never delete keys.
 */

require __DIR__ . '/auth.php';   // same gate as the dashboard; blocks unauth.

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

function out($a){ echo json_encode($a); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    out(['ok' => false, 'error' => 'POST only']);
}

$raw = file_get_contents('php://input');
$req = json_decode($raw, true);
if (!is_array($req)) out(['ok' => false, 'error' => 'Invalid request']);

$id     = trim((string)($req['id'] ?? ''));
$status = trim((string)($req['status'] ?? ''));

$ALLOWED = ['New', 'Applied', 'Interviewing', 'Passed', 'Rejected'];
if ($id === '' || !in_array($status, $ALLOWED, true)) {
    out(['ok' => false, 'error' => 'Bad id or status']);
}

// Only accept ids that actually exist in the ranked job set (defensive).
$validId = false;
$rawJobs = @file_get_contents(__DIR__ . '/jobs.json');
if ($rawJobs !== false) {
    $jobs = json_decode($rawJobs, true);
    if (is_array($jobs)) {
        foreach ($jobs as $j) {
            if (($j['id'] ?? null) === $id) { $validId = true; break; }
        }
    }
}
if (!$validId) out(['ok' => false, 'error' => 'Unknown job id']);

$file = __DIR__ . '/status.json';

// Load -> update -> write, under an exclusive lock so concurrent clicks don't
// clobber each other. Append/update only; existing keys are preserved.
$fp = @fopen($file, 'c+');
if ($fp === false) out(['ok' => false, 'error' => 'Store unavailable']);

$map = [];
if (flock($fp, LOCK_EX)) {
    $cur = stream_get_contents($fp);
    if ($cur !== false && trim($cur) !== '') {
        $decoded = json_decode($cur, true);
        if (is_array($decoded)) $map = $decoded;
    }
    $map[$id] = $status;                    // update-or-insert, never delete
    rewind($fp);
    ftruncate($fp, 0);
    fwrite($fp, json_encode($map, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
}
fclose($fp);

out(['ok' => true, 'id' => $id, 'status' => $status]);
