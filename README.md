# firstClassQuiz

A quiz/survey tool: staff build quizzes made of question sets (free text via
a rich text editor, Likert scales, single/multi-choice), students fill them
in anonymously via a link, and staff log in to manage quizzes and pull
results.

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
   `http://localhost/firstClassQuiz/api`.

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

## License

Released under Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International (CC BY-NC-SA 4.0) - see [LICENSE](LICENSE).
