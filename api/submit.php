<?php
/**
 * POST /api/submit.php
 * Body: {
 *   token, firstName, lastName, collegeEmail,
 *   answers: [ { questionId, answer }, ... ]
 * }
 *
 * Creates one submission row plus its response rows in a single
 * transaction. No authentication required - the quiz token gates access.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$db = get_db();
$body = json_body();

$token = $body['token'] ?? '';
$firstName = trim($body['firstName'] ?? '');
$lastName = trim($body['lastName'] ?? '');
$collegeEmail = trim($body['collegeEmail'] ?? '');
$answers = $body['answers'] ?? [];

if ($token === '' || $firstName === '' || $lastName === '' || $collegeEmail === '' || !is_array($answers)) {
    json_response(['error' => 'token, firstName, lastName, collegeEmail, and answers are required'], 400);
}

if (!filter_var($collegeEmail, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'collegeEmail must be a valid email address'], 400);
}

$stmt = $db->prepare('SELECT id FROM firstclassquiz_quizzes WHERE public_token = ? AND is_active = 1');
$stmt->execute([$token]);
$quiz = $stmt->fetch();

if (!$quiz) {
    json_response(['error' => 'Quiz not found or no longer active'], 404);
}

try {
    $db->beginTransaction();

    $stmt = $db->prepare(
        'INSERT INTO firstclassquiz_submissions (quiz_id, first_name, last_name, college_email) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$quiz['id'], $firstName, $lastName, $collegeEmail]);
    $submissionId = (int)$db->lastInsertId();

    $responseStmt = $db->prepare('INSERT INTO firstclassquiz_responses (submission_id, question_id, answer) VALUES (?, ?, ?)');
    foreach ($answers as $answer) {
        $questionId = (int)($answer['questionId'] ?? 0);
        if (!$questionId) {
            continue;
        }
        $responseStmt->execute([$submissionId, $questionId, json_encode($answer['answer'] ?? new stdClass())]);
    }

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    json_response(['error' => 'Failed to save submission'], 500);
}

json_response(['ok' => true, 'submissionId' => $submissionId], 201);
