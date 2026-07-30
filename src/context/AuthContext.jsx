import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest, logout as logoutRequest, fetchCurrentAdmin } from '../api/auth';

const AuthContext = createContext(null);

/**
 * Holds the logged-in admin's state for the whole app. Checks for an
 * existing session on mount so a page refresh doesn't drop the admin
 * back to the login screen.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentAdmin().then((result) => {
      setAdmin(result);
      setLoading(false);
    });
  }, []);

  async function login(username, password) {
    const result = await loginRequest(username, password);
    setAdmin(result);
    return result;
  }

  async function logout() {
    await logoutRequest();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** @returns {{admin: Object|null, loading: boolean, login: Function, logout: Function}} */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
