import { useState } from 'react';
import Modal from '../Modal';

/**
 * Confirms deleting every submission for a quiz. Requires the admin to
 * explicitly acknowledge they've either exported a CSV copy already or
 * don't need one, via a switch, before the delete button is enabled -
 * this is specifically for clearing results between classes sitting
 * the same quiz without accidentally losing data nobody meant to lose.
 *
 * @param {Object} props
 * @param {string} props.quizTitle
 * @param {number} props.submissionCount
 * @param {() => void} props.onExportCsv
 * @param {() => Promise<void>} props.onConfirmDelete
 * @param {() => void} props.onClose
 */
export default function DeleteResultsModal({ quizTitle, submissionCount, onExportCsv, onConfirmDelete, onClose }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await onConfirmDelete();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete results.');
      setDeleting(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2>Delete all results</h2>
      <p>
        This permanently deletes all {submissionCount} submission{submissionCount === 1 ? '' : 's'} (and every
        answer) for &ldquo;{quizTitle}&rdquo;. This cannot be undone. The quiz itself, its sets, and its
        questions are not affected.
      </p>

      <button type="button" className="delete-results-export-button" onClick={onExportCsv}>
        Export CSV first
      </button>

      <label className="switch-label">
        <span className="switch">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          <span className="switch-track" />
        </span>
        I&rsquo;ve exported a CSV copy of these results, or I don&rsquo;t need one
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="danger-button"
          disabled={!acknowledged || deleting}
          onClick={handleDelete}
        >
          {deleting ? 'Deleting...' : 'Delete all results'}
        </button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}
