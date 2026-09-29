<?php
/* ==========================================================================
   COMPASS CLAW — CHECKOUT SESSION ENDPOINT  (/api/checkout-session.php)
   Same contract as serve.mjs's POST /api/checkout-session:  POST → { client_secret }

   Shared cPanel cannot run the Node dev server, so this file is its
   equivalent: it creates a Checkout Session with ui_mode "form" (seamless
   in-page form) and answers the client secret the funnel mounts.

   Scenario B (no existing session call on this host): fixed_by_ui params are
   set exactly as configured in Checkout Studio; mode + line_items are
   sample_only placeholders finished by the TODO file. mode is "subscription"
   (recurring billing), so payment_method_collection "always" is included.

   Secrets are NEVER in this file or in git (public repo, public logs):
     STRIPE_SECRET_KEY  sk_test_… / sk_live_…   (set in cPanel env or SetEnv)
     STRIPE_PRICE_ID    price_…                 (recurring price from Dashboard)
   ========================================================================== */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function send($status, $payload) {
  http_response_code($status);
  echo json_encode($payload);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  send(405, ['error' => 'POST only']);
}

$secret = getenv('STRIPE_SECRET_KEY') ?: '';
$price  = getenv('STRIPE_PRICE_ID') ?: '';
if ($secret === '' || $price === '') {
  /* Server-only fallback: api/stripe-config.php, created by hand on the
     server via cPanel Terminal — never in git (see .gitignore + deploy
     excludes). Template:
       <?php define('CC_APP', true);
       define('STRIPE_SECRET_KEY', 'sk_test_… / sk_live_…');
       define('STRIPE_PRICE_ID', 'price_…');  // recurring price */
  $__cfg = __DIR__ . '/stripe-config.php';
  if (is_readable($__cfg)) { include_once $__cfg; }
  unset($__cfg);
  if ($secret === '' && defined('STRIPE_SECRET_KEY')) $secret = STRIPE_SECRET_KEY;
  if ($price === '' && defined('STRIPE_PRICE_ID')) $price = STRIPE_PRICE_ID;
}
if ($secret === '' || $price === '') {
  /* Same 501 contract as serve.mjs: the funnel falls back to the Payment Link. */
  send(501, ['error' => 'embedded checkout is off: set STRIPE_SECRET_KEY and STRIPE_PRICE_ID']);
}

$raw  = file_get_contents('php://input');
$meta = json_decode($raw ?: '{}', true);
if (!is_array($meta)) $meta = [];

/* Checkout Studio fixed_by_ui parameters, exactly as configured;
   mode + line_items are sample_only — real values live in env, never here. */
$form = [
  'ui_mode' => 'form',
  'mode' => 'subscription',
  'payment_method_collection' => 'always',
  'billing_address_collection' => 'auto',
  'phone_number_collection[enabled]' => 'false',
  'automatic_tax[enabled]' => 'false',
  'allow_promotion_codes' => 'false',
  'submit_type' => 'auto',
  'locale' => 'en',
  'payment_intent_data[setup_future_usage]' => 'off_session',
  'line_items[0][price]' => $price,
  'line_items[0][quantity]' => '1',
];

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => http_build_query($form),
  CURLOPT_TIMEOUT => 25,
  CURLOPT_HTTPHEADER => [
    'Authorization: Bearer ' . $secret,
    'Content-Type: application/x-www-form-urlencoded',
    /* Pinned per-request version for the embedded form SDK build. */
    'Stripe-Version: 2026-03-25.dahlia; custom_checkout_payment_form_preview=v1',
  ],
]);
$resp = curl_exec($ch);
$http = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($resp === false || $resp === '') {
  send(502, ['error' => 'stripe request failed' . ($err !== '' ? ': ' . $err : '')]);
}

$data = json_decode($resp, true);
if (!is_array($data) || $http < 200 || $http >= 300 || empty($data['client_secret'])) {
  $message = 'stripe http ' . $http;
  if (isset($data['error']['message']) && is_string($data['error']['message']) && $data['error']['message'] !== '') {
    $message = $data['error']['message'];
  }
  error_log('[checkout] ' . $message);
  send(502, ['error' => $message]);
}

send(200, ['client_secret' => $data['client_secret']]);
