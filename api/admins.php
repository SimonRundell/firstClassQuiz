<?php
/**
 * /api/admins.php
 *
 * GET    - list admin accounts (id, username, displayName only)
 * POST   - create an admin account  body: { username, password, displayName }
 * DELETE - remove an admin account  ?id=
 *
 * All methods require an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

$db = get_db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $db->query('SELECT id, username, display_name, created_at FROM firstclassquiz_admins ORDER BY username')->fetchAll();

    json_response(array_map(function ($row) {
        return [
            'id' => (int)$row['id'],
            'username' => $row['username'],
            'displayName' => $row['display_name'],
            'createdAt' => $row['created_at'],
        ];
    }, $rows));
}

if ($method === 'POST') {
    $body = json_body();
    $username = trim($body['username'] ?? '');
    $password = $body['password'] ?? '';
    $displayName = trim($body['displayName'] ?? '');

    if ($username === '' || $password === '' || $displayName === '') {
        json_response(['error' => 'username, password, and displayName are required'], 400);
    }

    try {
        $stmt = $db->prepare('INSERT INTO firstclassquiz_admins (username, password_hash, display_name) VALUES (?, ?, ?)');
        $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT), $displayName]);
    } catch (PDOException $e) {
        json_response(['error' => 'That username is already taken'], 409);
    }

    json_response(['id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    if ($id === (int)$_SESSION['admin_id']) {
        json_response(['error' => 'Cannot delete your own account while logged in'], 400);
    }

    $db->prepare('DELETE FROM firstclassquiz_admins WHERE id = ?')->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
