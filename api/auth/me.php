<?php
/**
 * GET /api/auth/me.php
 *
 * Session probe called on every page load. Returns the logged-in admin, or
 * 200 { "authenticated": false } when there is no session. It deliberately
 * does not 401, so a normal logged-out visit does not log console errors.
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/session.php';

start_admin_session();

if (empty($_SESSION['admin_id'])) {
    json_response(['authenticated' => false]);
}

$stmt = get_db()->prepare('SELECT id, username, display_name FROM firstclassquiz_admins WHERE id = ?');
$stmt->execute([$_SESSION['admin_id']]);
$admin = $stmt->fetch();

if (!$admin) {
    json_response(['authenticated' => false]);
}

json_response([
    'id' => $admin['id'],
    'username' => $admin['username'],
    'displayName' => $admin['display_name'],
]);
