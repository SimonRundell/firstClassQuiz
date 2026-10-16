<?php
/**
 * POST /api/auth/login.php
 * Body: { "username": "...", "password": "..." }
 *
 * Verifies credentials against the admins table and starts a PHP session
 * on success.
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/session.php';
require_once __DIR__ . '/../lib/throttle.php';

start_admin_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = json_body();
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === '' || $password === '') {
    json_response(['error' => 'Username and password are required'], 400);
}

$ipKey = 'ip:' . ($_SERVER['REMOTE_ADDR'] ?? '');
$userKey = 'user:' . strtolower($username);

if (throttle_blocked($ipKey) || throttle_blocked($userKey)) {
    log_error('Login throttled', ['username' => $username]);
    json_response(['error' => 'Too many failed attempts. Please wait 15 minutes and try again.'], 429);
}

$stmt = get_db()->prepare('SELECT id, username, password_hash, display_name FROM firstclassquiz_admins WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    throttle_fail($ipKey);
    throttle_fail($userKey);
    json_response(['error' => 'Invalid username or password'], 401);
}

throttle_clear($ipKey);
throttle_clear($userKey);
session_regenerate_id(true);
$_SESSION['admin_id'] = $admin['id'];

json_response([
    'id' => $admin['id'],
    'username' => $admin['username'],
    'displayName' => $admin['display_name'],
]);
