import { sanitizeHtml } from '../../utils/html';
import TextQuestion from './TextQuestion';
import LikertQuestion from './LikertQuestion';
import ChoiceQuestion from './ChoiceQuestion';

/**
 * Renders the correct input for a question's type and translates the
 * type-specific value into the { answer: ... } shape the API expects.
 *
 * @param {Object} props
 * @param {Object} props.question - { id, type, prompt, required, config }
 * @param {Object} [props.answer] - current answer object for this question
 * @param {(answer: Object) => void} props.onChange
 */
export default function QuestionRenderer({ question, answer, onChange }) {
  const name = `question-${question.id}`;

  return (
    <div className="question-block">
      <div className="question-prompt">
        <div className="question-prompt-html" dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.prompt) }} />
        {question.required && <span className="required-marker">(required)</span>}
      </div>

      {question.type === 'text' && (
        <TextQuestion
          value={answer?.html || ''}
          onChange={(html) => onChange({ html })}
        />
      )}

      {question.type === 'likert' && (
        <LikertQuestion
          name={name}
          config={question.config}
          value={answer?.value ?? null}
          onChange={(value) => onChange({ value })}
        />
      )}

      {question.type === 'choice' && (
        <ChoiceQuestion
          name={name}
          config={question.config}
          value={answer?.selected || []}
          onChange={(selected) => onChange({ selected })}
        />
      )}
    </div>
  );
}
