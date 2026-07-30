import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createQuiz, listQuizzes, updateQuiz, deleteQuiz } from '../api/quizzes';
import { useConfirm } from '../context/ConfirmContext';
import { useAlert } from '../context/AlertContext';

/** Lists all quizzes with create / activate-toggle / delete controls. */
export default function AdminDashboard() {
  const confirm = useConfirm();
  const alert = useAlert();
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  function refresh() {
    return listQuizzes().then(setQuizzes);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) {
      await alert('Please enter a title for the new quiz.', { title: 'Title required' });
      return;
    }
    await createQuiz({ title: title.trim() });
    setTitle('');
    await refresh();
  }

  async function toggleActive(quiz) {
    await updateQuiz(quiz.id, { title: quiz.title, description: quiz.description, isActive: !quiz.isActive });
    await refresh();
  }

  async function handleDelete(quiz) {
    const ok = await confirm(`Delete "${quiz.title}"? This removes all its submissions.`, {
      title: 'Delete quiz',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    await deleteQuiz(quiz.id);
    await refresh();
  }

  async function handleCopy(quiz, field, text) {
    await navigator.clipboard.writeText(text);
    const key = `${quiz.id}-${field}`;
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500);
  }

  if (loading) return <div className="page-message">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Quizzes</h1>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          placeholder="New quiz title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Create quiz</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Code</th>
            <th>Student link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td><Link to={`/admin/quiz/${quiz.id}`} className="button-link">{quiz.title}</Link></td>
              <td>
                <button type="button" onClick={() => toggleActive(quiz)}>
                  {quiz.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="copy-link-button quiz-code"
                  onClick={() => handleCopy(quiz, 'code', quiz.publicToken)}
                  title="Click to copy"
                >
                  {copied === `${quiz.id}-code` ? 'Copied!' : quiz.publicToken}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="copy-link-button"
                  onClick={() => handleCopy(quiz, 'link', `${window.location.origin}/quiz/${quiz.publicToken}`)}
                  title="Click to copy"
                >
                  {copied === `${quiz.id}-link` ? 'Copied!' : `${window.location.origin}/quiz/${quiz.publicToken}`}
                </button>
              </td>
              <td>
                <div className="row-actions">
                  <Link to={`/admin/quiz/${quiz.id}/results`} className="button-link">Results</Link>
                  <button type="button" onClick={() => handleDelete(quiz)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
