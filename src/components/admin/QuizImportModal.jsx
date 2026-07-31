import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal';
import { parseAndValidateQuizExport } from '../../utils/quizImport';
import { importQuizzes } from '../../api/quizzes';

/**
 * Imports whole quizzes (with their sets and questions) from a JSON
 * file previously produced by the "Export" button on the dashboard.
 * Every quiz in the file is validated and previewed before anything is
 * imported, and always creates brand new quizzes - existing quizzes on
 * this site are never modified.
 *
 * @param {Object} props
 * @param {() => void} props.onImported
 * @param {() => void} props.onClose
 */
export default function QuizImportModal({ onImported, onClose }) {
  const [quizzes, setQuizzes] = useState(null);
  const [globalError, setGlobalError] = useState('');
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setImportError('');

    const reader = new FileReader();
    reader.onload = () => {
      const { globalError: err, quizzes: parsed } = parseAndValidateQuizExport(String(reader.result));
      setGlobalError(err || '');
      setQuizzes(err ? null : parsed);
    };
    reader.readAsText(file);
  }

  const validQuizzes = quizzes ? quizzes.filter((q) => q.errors.length === 0) : [];

  async function handleImport() {
    setImporting(true);
    setImportError('');
    try {
      const payload = validQuizzes.map((q) => ({
        title: q.title,
        description: q.description,
        isActive: q.isActive,
        sets: q.sets,
      }));
      const res = await importQuizzes(payload);
      setResult(res);
      onImported();
    } catch (err) {
      setImportError(err.response?.data?.error || 'Import failed.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <Modal onClose={onClose} className="modal-card-wide quiz-import-modal">
      <h2>Import quizzes from JSON</h2>
      <p>
        Choose a JSON file previously downloaded with the "Export" button. Every quiz in the
        file is created as a brand new quiz with its own student link - existing quizzes are
        never changed.
      </p>

      <div className="csv-file-picker">
        <label>
          JSON file
          <input type="file" accept=".json,application/json" onChange={handleFile} />
        </label>
      </div>

      {globalError && <p className="form-error">{globalError}</p>}

      {quizzes && (
        <div className="csv-preview">
          <p>
            {fileName}: {validQuizzes.length} of {quizzes.length} quiz{quizzes.length === 1 ? '' : 'zes'} ready to import
            {quizzes.length !== validQuizzes.length && ` (${quizzes.length - validQuizzes.length} with errors, shown below)`}.
          </p>

          <div className="csv-preview-table-wrapper">
            <table className="admin-table csv-preview-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Sets</th>
                  <th>Questions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={index} className={quiz.errors.length ? 'csv-row-error' : ''}>
                    <td>{quiz.title}</td>
                    <td>{quiz.setsCount}</td>
                    <td>{quiz.questionsCount}</td>
                    <td>
                      {quiz.errors.length === 0 ? (
                        <FontAwesomeIcon icon={faCheck} className="csv-status-ok" />
                      ) : (
                        <span className="csv-status-error">
                          <FontAwesomeIcon icon={faTriangleExclamation} /> {quiz.errors.join('; ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {importError && <p className="form-error">{importError}</p>}

      {result && (
        <p className="form-success">
          Done - created {result.quizzesCreated} quiz{result.quizzesCreated === 1 ? '' : 'zes'}, {result.setsCreated} set{result.setsCreated === 1 ? '' : 's'}, and {result.questionsCreated} question{result.questionsCreated === 1 ? '' : 's'}.
        </p>
      )}

      <div className="form-actions">
        {!result && (
          <button type="button" onClick={handleImport} disabled={validQuizzes.length === 0 || importing}>
            {importing ? 'Importing...' : `Import ${validQuizzes.length} quiz${validQuizzes.length === 1 ? '' : 'zes'}`}
          </button>
        )}
        <button type="button" onClick={onClose}>{result ? 'Close' : 'Cancel'}</button>
      </div>
    </Modal>
  );
}
