<?php
/**
 * POST /api/quizzes_import.php
 * Body: { quizzes: [ { title, description, isActive, sets: [ { title, questions: [ { type, prompt, required, config } ] } ] } ] }
 *
 * Imports one or more whole quizzes from a previously exported JSON
 * file. Always creates brand new quizzes (with freshly generated
 * public link codes) rather than matching or overwriting existing
 * ones. Runs as a single transaction - either everything is created or
 * nothing is.
 *
 * Requires an authenticated admin.
 */
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/require_admin.php';
require_once __DIR__ . '/lib/sanitize.php';
require_once __DIR__ . '/lib/token.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = json_body();
$quizzes = $body['quizzes'] ?? [];
$validTypes = ['text', 'likert', 'choice'];

if (!is_array($quizzes) || empty($quizzes)) {
    json_response(['error' => 'A non-empty quizzes array is required'], 400);
}

$db = get_db();

$quizzesCreated = 0;
$setsCreated = 0;
$questionsCreated = 0;

try {
    $db->beginTransaction();

    $insertQuizStmt = $db->prepare(
        'INSERT INTO firstclassquiz_quizzes (title, description, public_token, is_active, created_by) VALUES (?, ?, ?, ?, ?)'
    );
    $insertSetStmt = $db->prepare('INSERT INTO firstclassquiz_question_sets (quiz_id, title, sort_order) VALUES (?, ?, ?)');
    $insertQuestionStmt = $db->prepare(
        'INSERT INTO firstclassquiz_questions (set_id, sort_order, type, prompt, required, config) VALUES (?, ?, ?, ?, ?, ?)'
    );

    foreach ($quizzes as $quiz) {
        $title = trim($quiz['title'] ?? '');
        $sets = $quiz['sets'] ?? [];

        if ($title === '' || !is_array($sets)) {
            throw new InvalidArgumentException('Every quiz needs a title and a sets array.');
        }

        $token = generate_quiz_token($db);
        $insertQuizStmt->execute([
            $title,
            $quiz['description'] ?? null,
            $token,
            array_key_exists('isActive', $quiz) && !$quiz['isActive'] ? 0 : 1,
            $_SESSION['admin_id'],
        ]);
        $quizId = (int)$db->lastInsertId();
        $quizzesCreated++;

        foreach (array_values($sets) as $setIndex => $set) {
            $setTitle = trim($set['title'] ?? '');
            $questions = $set['questions'] ?? [];

            if ($setTitle === '' || !is_array($questions)) {
                throw new InvalidArgumentException('Every set needs a title and a questions array.');
            }

            $insertSetStmt->execute([$quizId, $setTitle, $setIndex]);
            $setId = (int)$db->lastInsertId();
            $setsCreated++;

            foreach (array_values($questions) as $questionIndex => $question) {
                $type = $question['type'] ?? '';
                $prompt = sanitize_html($question['prompt'] ?? '');

                if (!in_array($type, $validTypes, true) || trim(strip_tags($prompt)) === '') {
                    throw new InvalidArgumentException('Every question needs a valid type and a non-empty prompt.');
                }

                $insertQuestionStmt->execute([
                    $setId,
                    $questionIndex,
                    $type,
                    $prompt,
                    !empty($question['required']) ? 1 : 0,
                    json_encode($question['config'] ?? new stdClass()),
                ]);
                $questionsCreated++;
            }
        }
    }

    $db->commit();
} catch (Exception $e) {
    log_error('Quiz import failed: ' . $e->getMessage());
    $db->rollBack();
    json_response(['error' => 'Import failed: ' . $e->getMessage()], 400);
}

json_response([
    'ok' => true,
    'quizzesCreated' => $quizzesCreated,
    'setsCreated' => $setsCreated,
    'questionsCreated' => $questionsCreated,
], 201);
