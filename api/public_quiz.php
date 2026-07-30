<?php
/**
 * GET /api/public_quiz.php?token=
 *
 * Fetches an active quiz's structure (sets and questions) for a student
 * to fill in. No authentication required - the token itself is the
 * access control.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/response.php';

$db = get_db();
$token = $_GET['token'] ?? '';

if ($token === '') {
    json_response(['error' => 'token is required'], 400);
}

$stmt = $db->prepare('SELECT id, title, description FROM firstclassquiz_quizzes WHERE public_token = ? AND is_active = 1');
$stmt->execute([$token]);
$quiz = $stmt->fetch();

if (!$quiz) {
    json_response(['error' => 'Quiz not found or no longer active'], 404);
}

$setStmt = $db->prepare('SELECT id, title FROM firstclassquiz_question_sets WHERE quiz_id = ? ORDER BY sort_order, id');
$setStmt->execute([$quiz['id']]);
$sets = $setStmt->fetchAll();

$questionStmt = $db->prepare(
    'SELECT id, type, prompt, required, config FROM firstclassquiz_questions WHERE set_id = ? ORDER BY sort_order, id'
);

$sets = array_map(function ($set) use ($questionStmt) {
    $questionStmt->execute([$set['id']]);

    return [
        'id' => (int)$set['id'],
        'title' => $set['title'],
        'questions' => array_map(function ($q) {
            return [
                'id' => (int)$q['id'],
                'type' => $q['type'],
                'prompt' => $q['prompt'],
                'required' => (bool)$q['required'],
                'config' => json_decode($q['config'], true),
            ];
        }, $questionStmt->fetchAll()),
    ];
}, $sets);

json_response([
    'id' => (int)$quiz['id'],
    'title' => $quiz['title'],
    'description' => $quiz['description'],
    'sets' => $sets,
]);
