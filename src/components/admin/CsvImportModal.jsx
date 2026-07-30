import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation, faDownload, faCopy } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal';
import { CSV_COLUMNS, AI_PROMPT, buildTemplateCsv, parseAndValidateCsv, promptTextToHtml } from '../../utils/csvImport';
import { importQuestions } from '../../api/quizzes';

/**
 * Bulk-import questions into a quiz from a CSV file: shows the expected
 * column format, a copy-pastable AI prompt for generating that CSV from
 * a lesson plan, a file picker, and a preview of every row (with
 * validation errors) before anything is actually imported.
 *
 * @param {Object} props
 * @param {number} props.quizId
 * @param {() => void} props.onImported
 * @param {() => void} props.onClose
 */
export default function CsvImportModal({ quizId, onImported, onClose }) {
  const [rows, setRows] = useState(null);
  const [fileName, setFileName] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);
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
    reader.onload = () => setRows(parseAndValidateCsv(String(reader.result)));
    reader.readAsText(file);
  }

  function handleDownloadTemplate() {
    const blob = new Blob([buildTemplateCsv()], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz-questions-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(AI_PROMPT);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 1500);
  }

  const validRows = rows ? rows.filter((r) => r.errors.length === 0) : [];

  async function handleImport() {
    setImporting(true);
    setImportError('');
    try {
      const payload = validRows.map((r) => ({
        setTitle: r.setTitle,
        type: r.type,
        prompt: promptTextToHtml(r.prompt),
        required: r.required,
        config: r.config,
      }));
      const res = await importQuestions(quizId, payload);
      setResult(res);
      onImported();
    } catch (err) {
      setImportError(err.response?.data?.error || 'Import failed.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <Modal onClose={onClose} className="modal-card-wide csv-import-modal">
      <h2>Import questions from CSV</h2>

      <div className="csv-import-instructions">
        <p>Your CSV needs these column headers, in this order:</p>
        <div className="csv-format-table-wrapper">
          <table className="csv-format-table">
            <thead>
              <tr>{CSV_COLUMNS.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              <tr>
                <td>Set</td>
                <td>text</td>
                <td>What is your favourite subject?</td>
                <td>yes</td>
                <td colSpan={2}></td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="csv-format-notes">
          <li><strong>Set</strong> - groups questions together; a new set is created automatically for any name not already used in this quiz.</li>
          <li><strong>Type</strong> - <code>text</code>, <code>likert</code> or <code>choice</code>.</li>
          <li><strong>Required</strong> - <code>yes</code> or <code>no</code> (blank counts as yes).</li>
          <li><strong>Points</strong> and <strong>Labels</strong> - likert questions only. Points is 3, 5 or 7. Labels are separated with a <code>|</code> character, one per point.</li>
          <li><strong>Options</strong> and <strong>AllowMultiple</strong> - choice questions only. Options are separated with a <code>|</code> character.</li>
        </ul>
        <button type="button" onClick={handleDownloadTemplate}>
          <FontAwesomeIcon icon={faDownload} /> Download template CSV
        </button>
      </div>

      <div className="ai-prompt-box">
        <p>Attach your lesson plan or scheme of work to your AI tool of choice, along with this prompt, to generate a ready-to-import CSV:</p>
        <pre className="ai-prompt-text">{AI_PROMPT}</pre>
        <button type="button" onClick={handleCopyPrompt}>
          <FontAwesomeIcon icon={faCopy} /> {promptCopied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>

      <div className="csv-file-picker">
        <label>
          CSV file
          <input type="file" accept=".csv,text/csv" onChange={handleFile} />
        </label>
      </div>

      {rows && (
        <div className="csv-preview">
          <p>
            {fileName}: {validRows.length} of {rows.length} row{rows.length === 1 ? '' : 's'} ready to import
            {rows.length !== validRows.length && ` (${rows.length - validRows.length} with errors, shown below)`}.
          </p>

          <div className="csv-preview-table-wrapper">
            <table className="admin-table csv-preview-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Set</th>
                  <th>Type</th>
                  <th>Prompt</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.rowNumber} className={row.errors.length ? 'csv-row-error' : ''}>
                    <td>{row.rowNumber}</td>
                    <td>{row.setTitle}</td>
                    <td>{row.type}</td>
                    <td>{row.prompt}</td>
                    <td>
                      {row.errors.length === 0 ? (
                        <FontAwesomeIcon icon={faCheck} className="csv-status-ok" />
                      ) : (
                        <span className="csv-status-error">
                          <FontAwesomeIcon icon={faTriangleExclamation} /> {row.errors.join('; ')}
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
          Done - created {result.setsCreated} new set{result.setsCreated === 1 ? '' : 's'} and {result.questionsCreated} question{result.questionsCreated === 1 ? '' : 's'}.
        </p>
      )}

      <div className="form-actions">
        {!result && (
          <button type="button" onClick={handleImport} disabled={validRows.length === 0 || importing}>
            {importing ? 'Importing...' : `Import ${validRows.length} question${validRows.length === 1 ? '' : 's'}`}
          </button>
        )}
        <button type="button" onClick={onClose}>{result ? 'Close' : 'Cancel'}</button>
      </div>
    </Modal>
  );
}
