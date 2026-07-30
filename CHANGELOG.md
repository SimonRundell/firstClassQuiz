# Changelog

All notable changes to this project are documented in this file.

## [1.5.0] - 2026-07-30

### Added

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

## [1.0.0] - 2026-07-30

### Added

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
