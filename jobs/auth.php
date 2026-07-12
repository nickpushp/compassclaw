<?php
// Server-side Basic Auth gate for /jobs/. Password is stored only as a bcrypt
// hash; the plaintext never lives in the repo and never reaches the browser.
$USER = 'skuloo';
$HASH = '$2b$12$fr2DJauzYxTy4/yv9JEc/uH3Gzmqbafm2NGeCWuonAUXMbpgOlVLi'; // bcrypt of the chosen password
$u = $_SERVER['PHP_AUTH_USER'] ?? '';
$p = $_SERVER['PHP_AUTH_PW'] ?? '';
if ($u !== $USER || !password_verify($p, $HASH)) {
    header('WWW-Authenticate: Basic realm="Job Hunt Engine"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Authentication required.';
    exit;
}
?>
