<?php
/**
 * /api/quizzes.php
 *
 * GET    - list all quizzes
 * POST   - create a quiz          body: { title, description }
 * PUT    - update a quiz          ?id=  body: { title, description, isActive }
 * DELETE - delete a quiz          ?id=
 *
 * All methods require an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/lib/token.php';

$db = get_db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $db->query(
        'SELECT id, title, description, public_token, is_active, created_at FROM firstclassquiz_quizzes ORDER BY created_at DESC'
    )->fetchAll();

    json_response(array_map(function ($row) {
        return [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'publicToken' => $row['public_token'],
            'isActive' => (bool)$row['is_active'],
            'createdAt' => $row['created_at'],
        ];
    }, $rows));
}

if ($method === 'POST') {
    $body = json_body();
    $title = trim($body['title'] ?? '');

    if ($title === '') {
        json_response(['error' => 'Title is required'], 400);
    }

    $token = generate_quiz_token($db);

    $stmt = $db->prepare(
        'INSERT INTO firstclassquiz_quizzes (title, description, public_token, created_by) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$title, $body['description'] ?? null, $token, $_SESSION['admin_id']]);

    json_response(['id' => (int)$db->lastInsertId(), 'publicToken' => $token], 201);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    $body = json_body();
    $stmt = $db->prepare(
        'UPDATE firstclassquiz_quizzes SET title = ?, description = ?, is_active = ? WHERE id = ?'
    );
    $stmt->execute([
        trim($body['title'] ?? ''),
        $body['description'] ?? null,
        !empty($body['isActive']) ? 1 : 0,
        $id,
    ]);

    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    $db->prepare('DELETE FROM firstclassquiz_quizzes WHERE id = ?')->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
