/**
 * Determines whether an answer object is empty for a given question type,
 * used to validate required questions before submission.
 *
 * @param {string} type
 * @param {Object} [answer]
 * @returns {boolean}
 */
export function isAnswerEmpty(type, answer) {
  if (!answer) return true;

  if (type === 'text') {
    const text = (answer.html || '').replace(/<[^>]*>/g, '').trim();
    return text === '';
  }

  if (type === 'likert') {
    return answer.value === undefined || answer.value === null;
  }

  if (type === 'choice') {
    return !answer.selected || answer.selected.length === 0;
  }

  return true;
}
