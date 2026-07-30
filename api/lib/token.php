<?php
/**
 * token.php
 *
 * Generates the short, shareable code used in a quiz's student link
 * (e.g. /quiz/AB12CD). Avoids visually ambiguous characters (0/O, 1/I)
 * since staff may read these aloud or write them on a board.
 */
const QUIZ_TOKEN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const QUIZ_TOKEN_LENGTH = 6;

/**
 * @param PDO $db
 * @return string a unique 6-character code, not currently used by any quiz
 */
function generate_quiz_token(PDO $db): string
{
    $checkStmt = $db->prepare('SELECT COUNT(*) FROM firstclassquiz_quizzes WHERE public_token = ?');

    do {
        $token = '';
        for ($i = 0; $i < QUIZ_TOKEN_LENGTH; $i++) {
            $token .= QUIZ_TOKEN_CHARS[random_int(0, strlen(QUIZ_TOKEN_CHARS) - 1)];
        }
        $checkStmt->execute([$token]);
    } while ((int)$checkStmt->fetchColumn() > 0);

    return $token;
}
