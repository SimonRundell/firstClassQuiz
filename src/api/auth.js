import { getClient } from './client';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{id: number, username: string, displayName: string}>}
 */
export async function login(username, password) {
  const client = await getClient();
  const res = await client.post('/auth/login.php', { username, password });
  return res.data;
}

/**
 * @returns {Promise<void>}
 */
export async function logout() {
  const client = await getClient();
  await client.post('/auth/logout.php');
}

/**
 * @returns {Promise<{id: number, username: string, displayName: string}|null>}
 */
export async function fetchCurrentAdmin() {
  const client = await getClient();
  try {
    const res = await client.get('/auth/me.php');
    return res.data.authenticated === false ? null : res.data;
  } catch {
    return null;
  }
}

/**
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export async function changePassword(currentPassword, newPassword) {
  const client = await getClient();
  await client.post('/auth/change_password.php', { currentPassword, newPassword });
}
