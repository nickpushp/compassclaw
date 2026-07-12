<?php
// Server-side secrets for the Compass Claw AI proxy.
// This file is NEVER served to the browser: it is protected by .htaccess
// (Require all denied) AND by the CC_APP guard below, so a direct hit returns
// 403 and the keys never leave the server.
if (!defined('CC_APP')) {
    http_response_code(403);
    die('forbidden');
}

// Groq (primary) — free tier chat models. Fast, higher free limits.
define('GROQ_KEY', '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');

// OpenRouter (fallback) — FREE models only. The tiny balance must not be spent.
define('OPENROUTER_KEY', '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');
