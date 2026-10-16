import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResults, deleteResults } from '../api/results';
import { listQuizzes } from '../api/quizzes';
import { stripHtml, sanitizeHtml } from '../utils/html';
import { formatDateTime } from '../utils/formatDate';
import DeleteResultsModal from '../components/admin/DeleteResultsModal';

/**
 * Formats stored 0-based option indices as 1-based numbers with the option
 * text (e.g. "1: Biology"), where 1 is the first option as listed in the
 * import CSV's Options column.
 *
 * @param {number[]} [selected]
 * @param {string[]} [options]
 * @param {string} separator
 * @returns {string}
 */
function optionNumbers(selected, options, separator) {
  return (selected || []).map((i) => `${i + 1}: ${(options || [])[i] ?? ''}`.trim()).join(separator);
}

/** @param {Object} response */
function formatAnswer(response) {
  if (response.type === 'text') return <span className="rich-html-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(response.answer.html) }} />;
  if (response.type === 'likert') return response.answer.value ?? '';
  if (response.type === 'choice') return optionNumbers(response.answer.selected, response.options, ', ');
  return '';
}

function toCsv(quizTitle, submissions) {
  const rows = [['First name', 'Last name', 'College email', 'Submitted at', 'Set', 'Question', 'Answer']];
  submissions.forEach((s) => {
    s.responses.forEach((r) => {
      const answerText = r.type === 'text'
        ? stripHtml(r.answer.html)
        : r.type === 'likert'
          ? String(r.answer.value ?? '')
          : optionNumbers(r.answer.selected, r.options, '; ');
      rows.push([s.firstName, s.lastName, s.collegeEmail, formatDateTime(s.submittedAt), r.setTitle, stripHtml(r.prompt), answerText]);
    });
  });
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}

/** Shows every submission for a quiz, with a CSV export. */
export default function AdminResults() {
  const { id } = useParams();
  const quizId = Number(id);
  const [quiz, setQuiz] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function refresh() {
    return Promise.all([listQuizzes(), fetchResults(quizId)]).then(([quizzes, results]) => {
      setQuiz(quizzes.find((q) => q.id === quizId) || null);
      setSubmissions(results);
    });
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [quizId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  function handleExport() {
    const csv = toCsv(quiz?.title || 'quiz', submissions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quiz?.title || 'quiz'}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteResults() {
    await deleteResults(quizId);
    await refresh();
  }

  if (loading) return <div className="page-message">Loading...</div>;

  return (
    <div className="admin-results">
      <p><Link to="/admin" className="button-link">&larr; Back to quizzes</Link></p>
      <h1>{quiz?.title} - Results</h1>
      <div className="results-actions">
        <button type="button" onClick={handleExport} disabled={submissions.length === 0}>Export CSV</button>
        <button
          type="button"
          className="danger-button"
          onClick={() => setShowDeleteModal(true)}
          disabled={submissions.length === 0}
        >
          Delete all results
        </button>
      </div>

      {showDeleteModal && (
        <DeleteResultsModal
          quizTitle={quiz?.title || 'this quiz'}
          submissionCount={submissions.length}
          onExportCsv={handleExport}
          onConfirmDelete={handleDeleteResults}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {submissions.length === 0 && <p>No submissions yet.</p>}

      {submissions.map((submission) => (
        <section key={submission.id} className="submission-card">
          <h3>
            {submission.firstName} {submission.lastName} &lt;{submission.collegeEmail}&gt;
          </h3>
          <p className="submission-timestamp">{formatDateTime(submission.submittedAt)}</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Set</th>
                <th>Question</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {submission.responses.map((response) => (
                <tr key={response.questionId}>
                  <td>{response.setTitle}</td>
                  <td className="rich-html-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(response.prompt) }} />
                  <td>{formatAnswer(response)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
