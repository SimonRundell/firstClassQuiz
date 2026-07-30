import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function navLinkClass({ isActive }) {
  return `button-link${isActive ? ' is-active' : ''}`;
}

/**
 * Shared admin shell: nav bar plus a route guard that redirects to the
 * login page if no admin session is active.
 */
export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();

  if (loading) return <div className="page-message">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <img src="/exeter-college-black-text.png" alt="Exeter College" className="admin-nav-logo" />
        <span className="admin-nav-brand">Quiz Master</span>
        <NavLink to="/admin" end className={navLinkClass}>Quizzes</NavLink>
        <NavLink to="/admin/admins" className={navLinkClass}>Admin accounts</NavLink>
        <span className="admin-nav-spacer" />
        <NavLink to="/admin/account" className={navLinkClass}>{admin.displayName}</NavLink>
        <button type="button" onClick={logout}>Log out</button>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
