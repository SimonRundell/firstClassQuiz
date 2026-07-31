import { getClient } from './client';

/** @param {number} quizId @returns {Promise<Array>} */
export async function fetchResults(quizId) {
  const client = await getClient();
  return (await client.get(`/results.php?quiz_id=${quizId}`)).data;
}

/** @param {number} quizId @returns {Promise<{ok: boolean, deleted: number}>} */
export async function deleteResults(quizId) {
  const client = await getClient();
  return (await client.delete(`/results.php?quiz_id=${quizId}`)).data;
}

/** @returns {Promise<Array>} */
export async function listAdmins() {
  const client = await getClient();
  return (await client.get('/admins.php')).data;
}

/** @param {{username: string, password: string, displayName: string}} admin */
export async function createAdmin(admin) {
  const client = await getClient();
  return (await client.post('/admins.php', admin)).data;
}

/** @param {number} id */
export async function deleteAdmin(id) {
  const client = await getClient();
  return (await client.delete(`/admins.php?id=${id}`)).data;
}
