import { getClient } from './client';

/** @returns {Promise<Array>} */
export async function listQuizzes() {
  const client = await getClient();
  return (await client.get('/quizzes.php')).data;
}

/** @param {{title: string, description?: string}} quiz @returns {Promise<Object>} */
export async function createQuiz(quiz) {
  const client = await getClient();
  return (await client.post('/quizzes.php', quiz)).data;
}

/** @param {number} id @param {{title: string, description?: string, isActive: boolean}} quiz */
export async function updateQuiz(id, quiz) {
  const client = await getClient();
  return (await client.put(`/quizzes.php?id=${id}`, quiz)).data;
}

/** @param {number} id */
export async function deleteQuiz(id) {
  const client = await getClient();
  return (await client.delete(`/quizzes.php?id=${id}`)).data;
}

/** @param {number} quizId @returns {Promise<Array>} */
export async function listQuestionSets(quizId) {
  const client = await getClient();
  return (await client.get(`/question_sets.php?quiz_id=${quizId}`)).data;
}

/** @param {{quizId: number, title: string}} set */
export async function createQuestionSet(set) {
  const client = await getClient();
  return (await client.post('/question_sets.php', set)).data;
}

/** @param {number} id @param {{title: string, sortOrder: number}} set */
export async function updateQuestionSet(id, set) {
  const client = await getClient();
  return (await client.put(`/question_sets.php?id=${id}`, set)).data;
}

/** @param {number} id */
export async function deleteQuestionSet(id) {
  const client = await getClient();
  return (await client.delete(`/question_sets.php?id=${id}`)).data;
}

/** @param {number} setId @returns {Promise<Array>} */
export async function listQuestions(setId) {
  const client = await getClient();
  return (await client.get(`/questions.php?set_id=${setId}`)).data;
}

/** @param {Object} question */
export async function createQuestion(question) {
  const client = await getClient();
  return (await client.post('/questions.php', question)).data;
}

/** @param {number} id @param {Object} question */
export async function updateQuestion(id, question) {
  const client = await getClient();
  return (await client.put(`/questions.php?id=${id}`, question)).data;
}

/** @param {number} id */
export async function deleteQuestion(id) {
  const client = await getClient();
  return (await client.delete(`/questions.php?id=${id}`)).data;
}

/** @param {number} quizId @param {Array<Object>} rows @returns {Promise<{setsCreated: number, questionsCreated: number}>} */
export async function importQuestions(quizId, rows) {
  const client = await getClient();
  return (await client.post('/questions_import.php', { quizId, rows })).data;
}

/** @param {string} query @returns {Promise<number[]>} quiz ids with a matching question prompt */
export async function searchQuestionQuizIds(query) {
  const client = await getClient();
  return (await client.get(`/search_questions.php?q=${encodeURIComponent(query)}`)).data;
}

/** @param {number[]} [ids] omit or pass empty for every quiz @returns {Promise<{exportedAt: string, quizzes: Array<Object>}>} */
export async function exportQuizzes(ids) {
  const client = await getClient();
  const query = ids && ids.length ? `?ids=${ids.join(',')}` : '';
  return (await client.get(`/quizzes_export.php${query}`)).data;
}

/** @param {Array<Object>} quizzes @returns {Promise<{quizzesCreated: number, setsCreated: number, questionsCreated: number}>} */
export async function importQuizzes(quizzes) {
  const client = await getClient();
  return (await client.post('/quizzes_import.php', { quizzes })).data;
}

/** @param {string} token @returns {Promise<Object>} */
export async function fetchPublicQuiz(token) {
  const client = await getClient();
  return (await client.get(`/public_quiz.php?token=${encodeURIComponent(token)}`)).data;
}

/** @param {Object} submission */
export async function submitQuiz(submission) {
  const client = await getClient();
  return (await client.post('/submit.php', submission)).data;
}
