<?php
/**
 * Websparklez brief form handler (optional)
 *
 * GitHub Pages cannot run PHP, so on GitHub Pages the form opens WhatsApp instead
 * and this file is never used. If you move the site to hosting that runs PHP
 * (cPanel, Hostinger, Namecheap and similar):
 *   1. Upload this file next to index.html
 *   2. In js/main.js set:  const FORM_ENDPOINT = 'contact.php';
 *   3. Send a test brief and check your inbox (and spam folder the first time)
 */

declare(strict_types=1);

const TO_EMAIL   = 'websparklez@gmail.com';
const FROM_EMAIL = 'no-reply@yourdomain.com'; // use an address on your own domain so mail isn't flagged as spam
const MIN_SECONDS_BETWEEN_SENDS = 30;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function clean(string $value, int $max): string
{
    $value = trim(strip_tags($value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return mb_substr($value, 0, $max);
}

function oneLine(string $value): string
{
    // Stops header injection in anything that could end up in a mail header
    return str_replace(["\r", "\n", '%0a', '%0d'], ' ', $value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Honeypot: real people never see this field
if (!empty($_POST['company'])) {
    respond(200, ['ok' => true]);
}

// Simple per-visitor rate limit
session_start();
$last = $_SESSION['brief_sent_at'] ?? 0;
if (time() - (int) $last < MIN_SECONDS_BETWEEN_SENDS) {
    respond(429, ['ok' => false, 'error' => 'Please wait a few seconds before sending again.']);
}

$name    = oneLine(clean((string) ($_POST['name'] ?? ''), 120));
$contact = oneLine(clean((string) ($_POST['contact'] ?? ''), 160));
$need    = oneLine(clean((string) ($_POST['need'] ?? 'Not sure yet'), 60));
$when    = oneLine(clean((string) ($_POST['when'] ?? ''), 60));
$message = clean((string) ($_POST['message'] ?? ''), 3000);

if (mb_strlen($name) < 2 || mb_strlen($contact) < 2) {
    respond(422, ['ok' => false, 'error' => 'Please add your name and an email or phone number.']);
}

$replyTo = filter_var($contact, FILTER_VALIDATE_EMAIL) ? $contact : null;

$subject = 'New website brief from ' . $name;
$body = implode("\n", [
    'New project brief from websparklez.github.io',
    '',
    'Name:    ' . $name,
    'Contact: ' . $contact,
    'Needs:   ' . $need,
    'Launch:  ' . $when,
    '',
    'Details:',
    $message !== '' ? $message : '(none given)',
    '',
    'Sent: ' . date('j M Y, H:i T'),
]);

$headers = [
    'From: Websparklez Website <' . FROM_EMAIL . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];
if ($replyTo) {
    $headers[] = 'Reply-To: ' . $replyTo;
}

$sent = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'The server could not send the email.']);
}

$_SESSION['brief_sent_at'] = time();
respond(200, ['ok' => true]);
