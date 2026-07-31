import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createQuiz, listQuizzes, updateQuiz, deleteQuiz, searchQuestionQuizIds, exportQuizzes } from '../api/quizzes';
import { useConfirm } from '../context/ConfirmContext';
import { useAlert } from '../context/AlertContext';
import QuizImportModal from '../components/admin/QuizImportModal';

/** Lists all quizzes with create / activate-toggle / delete controls, plus filtering and search. */
export default function AdminDashboard() {
  const confirm = useConfirm();
  const alert = useAlert();
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [questionMatchIds, setQuestionMatchIds] = useState(null);
  const [searchingQuestions, setSearchingQuestions] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showImportModal, setShowImportModal] = useState(false);

  function refresh() {
    return listQuizzes().then(setQuizzes);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const query = searchText.trim();
    if (!query) {
      setQuestionMatchIds(null);
      return;
    }

    setSearchingQuestions(true);
    const timeout = setTimeout(() => {
      searchQuestionQuizIds(query)
        .then((ids) => setQuestionMatchIds(new Set(ids)))
        .finally(() => setSearchingQuestions(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const filteredQuizzes = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      if (statusFilter === 'active' && !quiz.isActive) return false;
      if (statusFilter === 'inactive' && quiz.isActive) return false;

      if (!query) return true;

      const titleMatch = quiz.title.toLowerCase().includes(query);
      const questionMatch = questionMatchIds?.has(quiz.id) ?? false;
      return titleMatch || questionMatch;
    });
  }, [quizzes, searchText, statusFilter, questionMatchIds]);

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

  function toggleSelected(quizId) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(quizId)) {
        next.delete(quizId);
      } else {
        next.add(quizId);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    const allSelected = filteredQuizzes.length > 0 && filteredQuizzes.every((q) => selectedIds.has(q.id));
    setSelectedIds(allSelected ? new Set() : new Set(filteredQuizzes.map((q) => q.id)));
  }

  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleExport(ids) {
    const data = await exportQuizzes(ids);
    const suffix = ids && ids.length === 1
      ? `-${quizzes.find((q) => q.id === ids[0])?.title || 'quiz'}`
      : '';
    downloadJson(data, `quizzes-export${suffix}.json`.replace(/\s+/g, '-'));
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

      <div className="quiz-filter-bar">
        <input
          className="quiz-search-input"
          placeholder="Search title or question content..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
        <span className="quiz-filter-count">
          {searchingQuestions ? 'Searching...' : `${filteredQuizzes.length} of ${quizzes.length} quiz${quizzes.length === 1 ? '' : 'zes'}`}
        </span>
      </div>

      <div className="quiz-import-export-bar">
        <button
          type="button"
          onClick={() => handleExport([...selectedIds])}
          disabled={selectedIds.size === 0}
        >
          Export selected ({selectedIds.size})
        </button>
        <button type="button" onClick={() => handleExport()}>Export all</button>
        <button type="button" onClick={() => setShowImportModal(true)}>Import quizzes</button>
      </div>

      {showImportModal && (
        <QuizImportModal
          onImported={refresh}
          onClose={() => setShowImportModal(false)}
        />
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={filteredQuizzes.length > 0 && filteredQuizzes.every((q) => selectedIds.has(q.id))}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Title</th>
            <th>Status</th>
            <th>Code</th>
            <th>Student link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(quiz.id)}
                  onChange={() => toggleSelected(quiz.id)}
                />
              </td>
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

      {filteredQuizzes.length === 0 && <p>No quizzes match your search.</p>}
    </div>
  );
}
