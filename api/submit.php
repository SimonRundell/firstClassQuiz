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
require_once __DIR__ . '/lib/sanitize.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$db = get_db();
$body = json_body();

$token = is_string($body['token'] ?? null) ? $body['token'] : '';
$firstName = is_string($body['firstName'] ?? null) ? trim($body['firstName']) : '';
$lastName = is_string($body['lastName'] ?? null) ? trim($body['lastName']) : '';
$collegeEmail = is_string($body['collegeEmail'] ?? null) ? trim($body['collegeEmail']) : '';
$answers = $body['answers'] ?? [];

const MAX_ANSWER_HTML_LENGTH = 20000;

if ($token === '' || $firstName === '' || $lastName === '' || $collegeEmail === '' || !is_array($answers)) {
    json_response(['error' => 'token, firstName, lastName, collegeEmail, and answers are required'], 400);
}

if (!filter_var($collegeEmail, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'collegeEmail must be a valid email address'], 400);
}

if (mb_strlen($firstName) > 100 || mb_strlen($lastName) > 100 || mb_strlen($collegeEmail) > 255) {
    json_response(['error' => 'Name or email is too long'], 400);
}

$stmt = $db->prepare('SELECT id FROM firstclassquiz_quizzes WHERE public_token = ? AND is_active = 1');
$stmt->execute([$token]);
$quiz = $stmt->fetch();

if (!$quiz) {
    json_response(['error' => 'Quiz not found or no longer active'], 404);
}

// Load this quiz's questions so every answer can be checked against the
// question it claims to answer.
$stmt = $db->prepare(
    'SELECT q.id, q.type, q.required, q.config
     FROM firstclassquiz_questions q
     JOIN firstclassquiz_question_sets s ON s.id = q.set_id
     WHERE s.quiz_id = ?'
);
$stmt->execute([$quiz['id']]);
$questions = [];
foreach ($stmt->fetchAll() as $row) {
    $questions[(int)$row['id']] = [
        'type' => $row['type'],
        'required' => (bool)$row['required'],
        'config' => json_decode($row['config'], true) ?: [],
    ];
}

/**
 * Validates and normalises one answer against its question.
 *
 * @param array $question { type, required, config }
 * @param mixed $answer   Raw answer object from the client.
 * @return array|null Clean answer to store, or null when it is empty.
 * @throws InvalidArgumentException When the answer is malformed.
 */
function clean_answer(array $question, $answer)
{
    if (!is_array($answer)) {
        return null;
    }

    if ($question['type'] === 'text') {
        $html = $answer['html'] ?? '';
        if (!is_string($html) || mb_strlen($html) > MAX_ANSWER_HTML_LENGTH) {
            throw new InvalidArgumentException('A text answer is too long.');
        }
        $html = sanitize_html($html);
        return trim(strip_tags($html)) === '' ? null : ['html' => $html];
    }

    if ($question['type'] === 'likert') {
        $value = $answer['value'] ?? null;
        $points = (int)($question['config']['points'] ?? 5);
        if ($value === null) {
            return null;
        }
        if (!is_int($value) || $value < 1 || $value > $points) {
            throw new InvalidArgumentException('A scale answer is out of range.');
        }
        return ['value' => $value];
    }

    $selected = $answer['selected'] ?? [];
    $optionCount = count($question['config']['options'] ?? []);
    if (!is_array($selected)) {
        throw new InvalidArgumentException('A choice answer is malformed.');
    }
    foreach ($selected as $index) {
        if (!is_int($index) || $index < 0 || $index >= $optionCount) {
            throw new InvalidArgumentException('A choice answer is not a valid option.');
        }
    }
    $selected = array_values(array_unique($selected));
    if (count($selected) > 1 && empty($question['config']['allowMultiple'])) {
        throw new InvalidArgumentException('Only one option may be chosen for a question.');
    }
    return count($selected) === 0 ? null : ['selected' => $selected];
}

$cleaned = [];
try {
    foreach ($answers as $answer) {
        $questionId = is_array($answer) ? (int)($answer['questionId'] ?? 0) : 0;
        if (!isset($questions[$questionId])) {
            throw new InvalidArgumentException('An answer does not belong to this quiz.');
        }
        $clean = clean_answer($questions[$questionId], $answer['answer'] ?? null);
        if ($clean !== null) {
            $cleaned[$questionId] = $clean;
        }
    }

    foreach ($questions as $questionId => $question) {
        if ($question['required'] && !isset($cleaned[$questionId])) {
            throw new InvalidArgumentException('Please answer every required question.');
        }
    }
} catch (InvalidArgumentException $e) {
    json_response(['error' => $e->getMessage()], 400);
}

try {
    $db->beginTransaction();

    $stmt = $db->prepare(
        'INSERT INTO firstclassquiz_submissions (quiz_id, first_name, last_name, college_email) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$quiz['id'], $firstName, $lastName, $collegeEmail]);
    $submissionId = (int)$db->lastInsertId();

    $responseStmt = $db->prepare('INSERT INTO firstclassquiz_responses (submission_id, question_id, answer) VALUES (?, ?, ?)');
    foreach ($cleaned as $questionId => $clean) {
        $responseStmt->execute([$submissionId, $questionId, json_encode($clean)]);
    }

    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
    log_error('Submission failed: ' . $e->getMessage(), ['quizId' => $quiz['id']]);
    json_response(['error' => 'Failed to save submission'], 500);
}

json_response(['ok' => true, 'submissionId' => $submissionId], 201);
