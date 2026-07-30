<?php
/**
 * POST /api/auth/change_password.php
 * Body: { currentPassword, newPassword }
 *
 * Lets the logged-in admin change their own password. Requires the
 * correct current password before setting the new one.
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../require_admin.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = json_body();
$currentPassword = $body['currentPassword'] ?? '';
$newPassword = $body['newPassword'] ?? '';

if ($currentPassword === '' || $newPassword === '') {
    json_response(['error' => 'currentPassword and newPassword are required'], 400);
}

if (strlen($newPassword) < 8) {
    json_response(['error' => 'New password must be at least 8 characters'], 400);
}

$db = get_db();
$stmt = $db->prepare('SELECT password_hash FROM firstclassquiz_admins WHERE id = ?');
$stmt->execute([$_SESSION['admin_id']]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($currentPassword, $admin['password_hash'])) {
    json_response(['error' => 'Current password is incorrect'], 401);
}

$stmt = $db->prepare('UPDATE firstclassquiz_admins SET password_hash = ? WHERE id = ?');
$stmt->execute([password_hash($newPassword, PASSWORD_DEFAULT), $_SESSION['admin_id']]);

json_response(['ok' => true]);
