<?php
/**
 * GET /api/auth/me.php
 *
 * Returns the currently logged-in admin, or 401 if no session is active.
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../require_admin.php';

$stmt = get_db()->prepare('SELECT id, username, display_name FROM firstclassquiz_admins WHERE id = ?');
$stmt->execute([$_SESSION['admin_id']]);
$admin = $stmt->fetch();

if (!$admin) {
    json_response(['error' => 'Not authenticated'], 401);
}

json_response([
    'id' => $admin['id'],
    'username' => $admin['username'],
    'displayName' => $admin['display_name'],
]);
