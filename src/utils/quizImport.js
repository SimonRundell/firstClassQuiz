const VALID_TYPES = ['text', 'likert', 'choice'];

/**
 * Validates a single question, returning a list of problems (empty if
 * the question is fine).
 *
 * @param {Object} question
 * @param {number} setIndex
 * @param {number} questionIndex
 * @returns {string[]}
 */
function validateQuestion(question, setIndex, questionIndex) {
  const errors = [];
  const where = `Set ${setIndex + 1}, question ${questionIndex + 1}`;
  const type = question?.type;
  const prompt = (question?.prompt || '').replace(/<[^>]*>/g, '').trim();

  if (!VALID_TYPES.includes(type)) {
    errors.push(`${where}: type must be text, likert or choice`);
    return errors;
  }
  if (!prompt) {
    errors.push(`${where}: prompt is required`);
  }

  const config = question?.config || {};
  if (type === 'likert') {
    if (![3, 5, 7].includes(config.points)) {
      errors.push(`${where}: likert points must be 3, 5 or 7`);
    } else if (!Array.isArray(config.labels) || config.labels.length !== config.points) {
      errors.push(`${where}: likert labels must match points count`);
    }
  } else if (type === 'choice') {
    if (!Array.isArray(config.options) || config.options.length < 2) {
      errors.push(`${where}: choice questions need at least 2 options`);
    }
  }

  return errors;
}

/**
 * Parses and validates a previously exported quizzes JSON file, ready
 * for a preview before import.
 *
 * @param {string} jsonText
 * @returns {{globalError: string|null, quizzes: Array<{title: string, description: string|null, isActive: boolean, sets: Array<Object>, setsCount: number, questionsCount: number, errors: string[]}>}}
 */
export function parseAndValidateQuizExport(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { globalError: 'This file is not valid JSON.', quizzes: [] };
  }

  const quizzes = Array.isArray(parsed) ? parsed : parsed?.quizzes;
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return { globalError: 'This file does not contain a "quizzes" array.', quizzes: [] };
  }

  const results = quizzes.map((quiz) => {
    const errors = [];
    const title = (quiz?.title || '').trim();
    const sets = Array.isArray(quiz?.sets) ? quiz.sets : [];

    if (!title) errors.push('Quiz title is required');
    if (!Array.isArray(quiz?.sets)) errors.push('Quiz is missing a sets array');

    let questionsCount = 0;
    sets.forEach((set, setIndex) => {
      const setTitle = (set?.title || '').trim();
      if (!setTitle) errors.push(`Set ${setIndex + 1}: title is required`);

      const questions = Array.isArray(set?.questions) ? set.questions : [];
      if (!Array.isArray(set?.questions)) errors.push(`Set ${setIndex + 1}: missing a questions array`);

      questions.forEach((question, questionIndex) => {
        errors.push(...validateQuestion(question, setIndex, questionIndex));
        questionsCount++;
      });
    });

    return {
      title: title || '(untitled quiz)',
      description: quiz?.description ?? null,
      isActive: quiz?.isActive ?? true,
      sets,
      setsCount: sets.length,
      questionsCount,
      errors,
    };
  });

  return { globalError: null, quizzes: results };
}
