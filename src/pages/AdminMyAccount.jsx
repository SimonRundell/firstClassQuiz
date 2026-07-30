import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/auth';

/** Lets the logged-in admin change their own password. */
export default function AdminMyAccount() {
  const { admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not change password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-my-account">
      <h1>My account</h1>
      <p>Logged in as {admin.displayName} ({admin.username})</p>

      <form className="change-password-form" onSubmit={handleSubmit}>
        <label>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">Password changed.</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Change password'}
        </button>
      </form>
    </div>
  );
}
