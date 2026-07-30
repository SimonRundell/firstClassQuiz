<?php
/**
 * /api/question_sets.php
 *
 * GET    ?quiz_id= - list sets for a quiz
 * POST             - create a set   body: { quizId, title }
 * PUT    ?id=      - update a set   body: { title, sortOrder }
 * DELETE ?id=      - delete a set
 *
 * All methods require an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

$db = get_db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $quizId = (int)($_GET['quiz_id'] ?? 0);
    if (!$quizId) {
        json_response(['error' => 'quiz_id is required'], 400);
    }

    $stmt = $db->prepare(
        'SELECT id, quiz_id, title, sort_order FROM firstclassquiz_question_sets WHERE quiz_id = ? ORDER BY sort_order, id'
    );
    $stmt->execute([$quizId]);

    json_response(array_map(function ($row) {
        return [
            'id' => (int)$row['id'],
            'quizId' => (int)$row['quiz_id'],
            'title' => $row['title'],
            'sortOrder' => (int)$row['sort_order'],
        ];
    }, $stmt->fetchAll()));
}

if ($method === 'POST') {
    $body = json_body();
    $quizId = (int)($body['quizId'] ?? 0);
    $title = trim($body['title'] ?? '');

    if (!$quizId || $title === '') {
        json_response(['error' => 'quizId and title are required'], 400);
    }

    $stmt = $db->prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM firstclassquiz_question_sets WHERE quiz_id = ?');
    $stmt->execute([$quizId]);
    $nextOrder = (int)$stmt->fetch()['next_order'];

    $stmt = $db->prepare('INSERT INTO firstclassquiz_question_sets (quiz_id, title, sort_order) VALUES (?, ?, ?)');
    $stmt->execute([$quizId, $title, $nextOrder]);

    json_response(['id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    $body = json_body();
    $stmt = $db->prepare('UPDATE firstclassquiz_question_sets SET title = ?, sort_order = ? WHERE id = ?');
    $stmt->execute([trim($body['title'] ?? ''), (int)($body['sortOrder'] ?? 0), $id]);

    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        json_response(['error' => 'id is required'], 400);
    }

    $db->prepare('DELETE FROM firstclassquiz_question_sets WHERE id = ?')->execute([$id]);
    json_response(['ok' => true]);
}

json_response(['error' => 'Method not allowed'], 405);
