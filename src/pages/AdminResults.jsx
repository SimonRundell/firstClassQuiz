import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchResults } from '../api/results';
import { listQuizzes } from '../api/quizzes';
import { stripHtml } from '../utils/html';

/** @param {Object} response */
function formatAnswer(response) {
  if (response.type === 'text') return <span dangerouslySetInnerHTML={{ __html: response.answer.html || '' }} />;
  if (response.type === 'likert') return response.answer.value ?? '';
  if (response.type === 'choice') return (response.answer.selected || []).join(', ');
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
          : (r.answer.selected || []).join('; ');
      rows.push([s.firstName, s.lastName, s.collegeEmail, s.submittedAt, r.setTitle, stripHtml(r.prompt), answerText]);
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

  useEffect(() => {
    Promise.all([listQuizzes(), fetchResults(quizId)]).then(([quizzes, results]) => {
      setQuiz(quizzes.find((q) => q.id === quizId) || null);
      setSubmissions(results);
      setLoading(false);
    });
  }, [quizId]);

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

  if (loading) return <div className="page-message">Loading...</div>;

  return (
    <div className="admin-results">
      <p><Link to="/admin" className="button-link">&larr; Back to quizzes</Link></p>
      <h1>{quiz?.title} - Results</h1>
      <button className="smallgapbelow" type="button" onClick={handleExport} disabled={submissions.length === 0}>Export CSV</button>

      {submissions.length === 0 && <p>No submissions yet.</p>}

      {submissions.map((submission) => (
        <section key={submission.id} className="submission-card">
          <h3>
            {submission.firstName} {submission.lastName} &lt;{submission.collegeEmail}&gt;
          </h3>
          <p className="submission-timestamp">{new Date(submission.submittedAt).toLocaleString()}</p>
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
                  <td dangerouslySetInnerHTML={{ __html: response.prompt }} />
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
