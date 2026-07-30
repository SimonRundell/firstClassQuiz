import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPublicQuiz, submitQuiz } from '../api/quizzes';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import { isAnswerEmpty } from '../components/questions/answerUtils';
import { stripHtml } from '../utils/html';

/**
 * Public, link-only quiz page. Captures first name, last name, and
 * college email, then renders each question set in order and submits
 * all answers together.
 */
export default function StudentQuiz() {
  const { token } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchPublicQuiz(token)
      .then(setQuiz)
      .catch((err) => setError(err.response?.data?.error || 'This quiz link is not available.'));
  }, [token]);

  function setAnswer(questionId, answer) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError('');

    if (!firstName.trim() || !lastName.trim() || !collegeEmail.trim()) {
      setValidationError('First name, last name, and college email are required.');
      return;
    }

    for (const set of quiz.sets) {
      for (const question of set.questions) {
        if (question.required && isAnswerEmpty(question.type, answers[question.id])) {
          setValidationError(`Please answer: "${stripHtml(question.prompt)}"`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      await submitQuiz({
        token,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        collegeEmail: collegeEmail.trim(),
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: Number(questionId),
          answer,
        })),
      });
      setSubmitted(true);
    } catch (err) {
      setValidationError(err.response?.data?.error || 'Something went wrong submitting your answers.');
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="page-message">
        <img src="/exeter-college-black-text.png" alt="Exeter College" className="brand-logo" />
        <p>{error}</p>
      </div>
    );
  }
  if (!quiz) return <div className="page-message">Loading...</div>;
  if (submitted) {
    return (
      <div className="page-message">
        <img src="/exeter-college-black-text.png" alt="Exeter College" className="brand-logo" />
        <p>Thank you, your response has been recorded.</p>
      </div>
    );
  }

  return (
    <form className="student-quiz" onSubmit={handleSubmit}>
      <img src="/exeter-college-black-text.png" alt="Exeter College" className="brand-logo" />
      <h1>{quiz.title}</h1>
      {quiz.description && <p className="quiz-description">{quiz.description}</p>}

      <div className="student-details">
        <label>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          College email
          <input type="email" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} />
        </label>
      </div>

      {quiz.sets.map((set) => (
        <section key={set.id} className="question-set">
          <h2>{set.title}</h2>
          {set.questions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onChange={(answer) => setAnswer(question.id, answer)}
            />
          ))}
        </section>
      ))}

      {validationError && <p className="form-error">{validationError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
