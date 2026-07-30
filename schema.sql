-- firstClassQuiz database schema
-- All tables are prefixed with firstclassquiz_ so they can safely coexist
-- inside a shared/multi-purpose database.
-- Import into the target MySQL database, e.g.:
--   mysql -u root -p some_shared_db < schema.sql

CREATE TABLE IF NOT EXISTS firstclassquiz_admins (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(150) NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS firstclassquiz_quizzes (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT NULL,
    public_token CHAR(6) NOT NULL UNIQUE,
    is_active    TINYINT(1) NOT NULL DEFAULT 1,
    created_by   INT UNSIGNED NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_firstclassquiz_quizzes_admin FOREIGN KEY (created_by) REFERENCES firstclassquiz_admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS firstclassquiz_question_sets (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quiz_id    INT UNSIGNED NOT NULL,
    title      VARCHAR(255) NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    CONSTRAINT fk_firstclassquiz_sets_quiz FOREIGN KEY (quiz_id) REFERENCES firstclassquiz_quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS firstclassquiz_questions (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    set_id     INT UNSIGNED NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    type       ENUM('text', 'likert', 'choice') NOT NULL,
    prompt     TEXT NOT NULL,
    required   TINYINT(1) NOT NULL DEFAULT 1,
    config     JSON NOT NULL,
    CONSTRAINT fk_firstclassquiz_questions_set FOREIGN KEY (set_id) REFERENCES firstclassquiz_question_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS firstclassquiz_submissions (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quiz_id       INT UNSIGNED NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    college_email VARCHAR(255) NOT NULL,
    submitted_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_firstclassquiz_submissions_quiz FOREIGN KEY (quiz_id) REFERENCES firstclassquiz_quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS firstclassquiz_responses (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id INT UNSIGNED NOT NULL,
    question_id   INT UNSIGNED NOT NULL,
    answer        JSON NOT NULL,
    CONSTRAINT fk_firstclassquiz_responses_submission FOREIGN KEY (submission_id) REFERENCES firstclassquiz_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_firstclassquiz_responses_question FOREIGN KEY (question_id) REFERENCES firstclassquiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
