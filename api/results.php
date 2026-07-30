<?php
/**
 * GET /api/results.php?quiz_id=
 *
 * Returns every submission for a quiz, each with its responses nested
 * and joined against the question they answer (prompt, type, set).
 *
 * Requires an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';

$db = get_db();
$quizId = (int)($_GET['quiz_id'] ?? 0);

if (!$quizId) {
    json_response(['error' => 'quiz_id is required'], 400);
}

$stmt = $db->prepare(
    'SELECT id, first_name, last_name, college_email, submitted_at FROM firstclassquiz_submissions WHERE quiz_id = ? ORDER BY submitted_at DESC'
);
$stmt->execute([$quizId]);
$submissions = $stmt->fetchAll();

$responseStmt = $db->prepare(
    'SELECT r.question_id, r.answer, q.prompt, q.type, q.set_id, s.title AS set_title
     FROM firstclassquiz_responses r
     JOIN firstclassquiz_questions q ON q.id = r.question_id
     JOIN firstclassquiz_question_sets s ON s.id = q.set_id
     WHERE r.submission_id = ?
     ORDER BY s.sort_order, q.sort_order'
);

$result = array_map(function ($submission) use ($responseStmt) {
    $responseStmt->execute([$submission['id']]);

    return [
        'id' => (int)$submission['id'],
        'firstName' => $submission['first_name'],
        'lastName' => $submission['last_name'],
        'collegeEmail' => $submission['college_email'],
        'submittedAt' => $submission['submitted_at'],
        'responses' => array_map(function ($row) {
            return [
                'questionId' => (int)$row['question_id'],
                'setTitle' => $row['set_title'],
                'prompt' => $row['prompt'],
                'type' => $row['type'],
                'answer' => json_decode($row['answer'], true),
            ];
        }, $responseStmt->fetchAll()),
    ];
}, $submissions);

json_response($result);
