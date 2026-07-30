import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

/**
 * Student-facing landing page: enter a quiz code to be taken straight
 * to that quiz. Admin login is tucked behind a subtle cog icon rather
 * than being the default view.
 */
export default function QuizCodeLanding() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    navigate(`/quiz/${trimmed.toUpperCase()}`);
  }

  return (
    <div className="quiz-code-landing">
      <Link to="/admin" className="admin-cog-link" title="Admin login" aria-label="Admin login">
        <FontAwesomeIcon icon={faGear} />
      </Link>

      <form className="quiz-code-form" onSubmit={handleSubmit}>
        <img src="/exeter-college-black-text.png" alt="Exeter College" className="brand-logo" />
        <h1>Enter your quiz code</h1>
        <label>
          Quiz code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. A1BCDE"
            autoFocus
            autoCapitalize="characters"
          />
        </label>
        <button type="submit">Go</button>
      </form>
    </div>
  );
}
