import { useEffect, useState } from 'react';
import { listAdmins, createAdmin, deleteAdmin } from '../api/results';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';

/** Manage additional admin accounts. */
export default function AdminAccounts() {
  const { admin: currentAdmin } = useAuth();
  const confirm = useConfirm();
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  function refresh() {
    return listAdmins().then(setAdmins);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await createAdmin({ username: username.trim(), password, displayName: displayName.trim() });
      setUsername('');
      setPassword('');
      setDisplayName('');
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create admin account.');
    }
  }

  async function handleDelete(admin) {
    const ok = await confirm(`Remove admin account "${admin.username}"?`, {
      title: 'Remove admin account',
      confirmLabel: 'Remove',
      danger: true,
    });
    if (!ok) return;
    await deleteAdmin(admin.id);
    await refresh();
  }

  return (
    <div className="admin-accounts">
      <h1>Admin accounts</h1>

      <form className="inline-form" onSubmit={handleCreate}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Add admin</button>
      </form>
      {error && <p className="form-error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Display name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.username}</td>
              <td>{admin.displayName}</td>
              <td>
                {admin.id !== currentAdmin.id && (
                  <button type="button" onClick={() => handleDelete(admin)}>Remove</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
