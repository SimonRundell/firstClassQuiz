# firstClassQuiz

A quiz/survey tool: staff build quizzes made of question sets (free text via
a rich text editor, Likert scales, single/multi-choice), students fill them
in anonymously via a link, and staff log in to manage quizzes and pull
results.

## Features

- **Question types** - free text (rich text editor with bold, italic,
  underline, sub/superscript, lists, code, and horizontal rule), Likert
  scales (3, 5 or 7 points with custom labels), and single/multi-choice.
  The same rich text toolbar is shared between question prompts and
  students' free-text answers.
- **Student access** - a short, memorable code (or a direct link) takes
  students straight to a quiz with no account needed. The landing page
  (`/`) is a simple "enter your quiz code" form for students, with admin
  login tucked behind a subtle cog icon.
- **Quiz editor** - build quizzes from one or more question sets, each
  with any mix of question types. Drag and drop to reorder questions and
  sets, and edit the quiz title inline.
- **Bulk question import from CSV** - upload a CSV of questions (with a
  downloadable template and a copy-pastable AI prompt for generating one
  from a lesson plan or scheme of work) into a quiz, with a validated
  preview before anything is imported.
- **Whole-quiz export/import** - select any number of quizzes (or all of
  them) to export as a single JSON file, and re-import that file later.
  Importing always creates brand new quizzes with fresh student-link
  codes - existing quizzes are never overwritten. Useful for backups,
  duplicating a quiz, or moving quizzes between environments.
- **Filtering and search** - filter the quiz list by active/inactive
  status, and search across both quiz titles and question content.
- **Results** - every submission is timestamped and can be viewed per
  quiz or exported to CSV.
- **Admin accounts** - session-based login, multiple named admin
  accounts, and self-service password changes.
- Branded throughout with Exeter College styling, including custom
  confirm/alert dialogs in place of the browser's built-in ones.

## Stack

React + Vite (JavaScript) frontend, PHP REST API backend, MySQL database.
Local development uses Laragon (Apache on `localhost:80` for PHP/MySQL) with
Vite serving the React frontend on its own dev port.

## Setup

1. **Database** - every table is prefixed with `firstclassquiz_`, so this
   schema can be imported into a database that's already in use for other
   projects without name clashes. Import it into whichever database you're
   using:

   ```sh
   mysql -u <user> -p <database_name> < schema.sql
   ```

2. **API config** - copy `api/config.example.php` to `api/config.php` and
   fill in your database host/name/user/pass. `api/config.php` is
   git-ignored. It's a `.php` file rather than `.json` on purpose: a direct
   HTTP request to it executes as PHP and returns nothing, instead of the
   web server handing back the raw credentials as static text.

3. **Seed the first admin account** (there is no public signup):

   ```sh
   php api/setup/create_admin.php <username> <password> "<display name>"
   ```

   Once logged in, more admin accounts can be created from the
   "Admin accounts" page.

4. **Frontend config** - edit `public/config.json` so `apiBaseUrl` points at
   wherever Laragon serves the `api/` folder for this project, e.g.
   `http://localhost/firstClassQuiz/api`. It also takes an optional
   `dateTimeFormat` (used for submission timestamps on the results page and
   in the CSV export), which defaults to `dd/MM/yyyy hh:mm:ss a` (e.g.
   `30/07/2026 02:15:30 PM`). Supported tokens: `yyyy`, `MM`, `dd`, `HH`
   (24-hour), `hh` (12-hour), `mm`, `ss`, `a` (AM/PM).

5. **Install and run**:

   ```sh
   npm install
   npm run dev
   ```

6. Log in at `/admin/login`, build a quiz, and copy the student link shown
   next to it on the dashboard (`/quiz/<token>`) to share with students.

## Upgrading an existing install

If your database predates the short quiz-link codes (`public_token` used to
be a 32-character hex string), run this once to shrink the column and
regenerate a 6-character code for every existing quiz:

```sh
php api/setup/migrate_short_tokens.php
```

If your database predates the `firstclassquiz_` table prefix (e.g. tables
are named `quizzes`, `admins`, etc. rather than `firstclassquiz_quizzes`,
`firstclassquiz_admins`), run this once to rename them in place - it
preserves all data, indexes, and foreign keys, and is what lets this app's
tables coexist safely inside a shared database with other projects:

```sh
php api/setup/migrate_table_prefix.php
```

## Changelog

<!-- markdownlint-disable MD024 -->

### [1.6.4] - 2026-10-16

#### Changed

- Choice answers on the results page and in the results CSV are now shown
  as 1-based option numbers with the option text (e.g. `1: Biology`),
  where 1 is the first option in the order of the import CSV's Options
  column, instead of raw 0-based indices.

#### Security

- Rich text (question prompts and students' free-text answers) is now
  sanitised with an allowlist both on the server (`api/lib/sanitize.php`,
  before saving, including imports) and in the browser (DOMPurify, before
  rendering), closing a stored XSS hole on the results page.
- Login is rate limited (5 failures per 15 minutes per IP and per
  username), regenerates the session ID on success, and the session
  cookie is now HttpOnly (and Secure over HTTPS).
- `submit.php` checks every answer against the quiz's real questions:
  unknown questions, out-of-range scale values, invalid or surplus choice
  options and over-long text are rejected, and required questions are
  enforced server-side. Name and email lengths are capped.

#### Added

- Error log at `api/logs/error.log` (git-ignored, blocked from HTTP by
  `api/.htaccess`), also capturing uncaught exceptions and PHP errors,
  which are no longer displayed to the client.

#### Removed

- Unused `playwright` dev dependency.

### [1.6.3] - 2026-07-31

#### Fixed

- Multiple-choice option text fields in the question editor now stretch
  to fill the available width instead of a fixed narrow default, and
  "Add option" has proper spacing above and below it instead of sitting
  flush against the option list and the Save/Cancel buttons.

### [1.6.2] - 2026-07-31

#### Added

- "Delete all results" on the results page, for clearing submissions
  between classes sitting the same quiz. A confirmation dialog requires
  explicitly acknowledging - via a switch - that a CSV copy has been
  exported or isn't needed before the delete button becomes clickable,
  with an "Export CSV first" button right there in the same dialog.
  Only that quiz's submissions and their answers are removed; the quiz,
  its sets, and its questions are untouched, so the same link/code can
  be reused straight away for the next class.

### [1.6.1] - 2026-07-31

#### Added

- "Add set" now shows the same branded "Title required" dialog as
  "Create quiz" when submitted with an empty title, instead of silently
  doing nothing.
- Question set titles are editable inline, the same way the quiz title
  already was (pencil icon, click to edit, Save/Cancel).
- A dedicated "Code block" button in the rich text toolbar (multi-line,
  preserves whitespace) alongside inline code, plus Indent/Outdent
  buttons and native Tab/Shift+Tab indentation while inside a code
  block - useful for Python examples where indentation is meaningful.
- Inline code and code blocks now actually render with proper styling
  (monospace, background, padding) everywhere they're displayed - the
  question editor, the student-facing quiz page, and the results page.
  Previously there was no CSS for either at all.

#### Fixed

- Clicking anywhere in a question's rich text prompt field - including
  just to reposition the cursor - could silently trigger "Undo",
  corrupting or wiping recently-typed text. Root cause: the field was
  wrapped in a `<label>`, and browsers forward clicks anywhere inside a
  label to its first labelable child, which happened to be the
  toolbar's Undo button. Changed the wrapper to a plain `<div>`.
- The rich text toolbar's active-state buttons (Bold, Italic, Code,
  etc.) could get stuck showing stale formatting state after moving the
  cursor without typing (e.g. showing "Code" as active long after the
  cursor had moved well past any code-marked text). Tiptap v3 stopped
  re-rendering on every transaction by default (v2 always did); added
  `shouldRerenderOnTransaction: true` to restore live updates.
- The editor no longer takes its own live value back in as a controlled
  prop on every keystroke, removing an unnecessary reinitialisation risk
  - content is now seeded once on mount instead.

### [1.6.0] - 2026-07-30

#### Added

- Filtering and search on the quiz list: a status filter (all/active/
  inactive) and a search box that matches both quiz titles and question
  content, backed by a new `search_questions.php` endpoint so a term that
  only appears inside a question (not the title) still finds the right
  quiz.
- Whole-quiz export and import: select any number of quizzes (or export
  everything) to download a single JSON file containing each quiz's full
  structure - title, description, active status, sets, questions, and
  their config. Importing that file always creates brand new quizzes with
  fresh student-link codes, with a validated per-quiz preview (set/
  question counts and any errors) before anything is committed. Existing
  quizzes are never modified by an import.

### [1.5.0] - 2026-07-30

#### Added

- Bulk question import from CSV on the quiz editor page, including a
  downloadable template CSV, a copy-pastable AI prompt for generating the
  CSV from a lesson plan or scheme of work, and a validated row-by-row
  preview (with clear error messages) before anything is imported.
- Inline quiz title editing directly from the quiz editor page.
- A branded alert dialog (replacing the browser's `alert()`) - for example,
  warns when trying to create a quiz with an empty title.
- Configurable submission date/time format via `dateTimeFormat` in
  `public/config.json`, defaulting to `dd/MM/yyyy hh:mm:ss a`
  (e.g. `30/07/2026 02:15:30 PM`), applied on the results page and in the
  CSV export.

### [1.0.0] - 2026-07-30

#### Added

- Initial release: a quiz/survey builder for staff, with quizzes made of
  question sets containing free-text (rich text via Tiptap), Likert scale,
  and single/multi-choice questions.
- Public, link-only student quiz page with a short 6-character code and a
  code-entry landing page, capturing name, college email, and submission
  timestamp.
- Admin login with session auth, multiple admin accounts, and self-service
  password changes.
- Quiz editor with drag-and-drop question reordering and a rich text
  toolbar (bold, italic, underline, sub/superscript, lists, code, etc.)
  shared between question prompts and free-text answers.
- Results page per quiz with CSV export.
- Branded confirm/alert modal dialogs, Exeter College branding throughout,
  and a database schema with `firstclassquiz_`-prefixed tables so it can
  coexist inside a shared database.

## License

Released under Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International (CC BY-NC-SA 4.0) - see [LICENSE](LICENSE).
