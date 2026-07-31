import { useState } from 'react';
import RichTextEditor from '../RichTextEditor';

const DEFAULT_LIKERT_LABELS = {
  3: ['Disagree', 'Neutral', 'Agree'],
  5: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  7: [
    'Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral',
    'Somewhat agree', 'Agree', 'Strongly agree',
  ],
};

/**
 * Create/edit form for a single question, covering all three question
 * types and their type-specific config.
 *
 * @param {Object} props
 * @param {Object} [props.initialQuestion] - existing question to edit, omit to create
 * @param {(data: Object) => void} props.onSave
 * @param {() => void} props.onCancel
 */
export default function QuestionEditorForm({ initialQuestion, onSave, onCancel }) {
  const [type, setType] = useState(initialQuestion?.type || 'text');
  const [prompt, setPrompt] = useState(initialQuestion?.prompt || '');
  const [required, setRequired] = useState(initialQuestion?.required ?? true);
  const [points, setPoints] = useState(initialQuestion?.config?.points || 5);
  const [labels, setLabels] = useState(
    initialQuestion?.config?.labels || DEFAULT_LIKERT_LABELS[initialQuestion?.config?.points || 5]
  );
  const [options, setOptions] = useState(initialQuestion?.config?.options || ['', '']);
  const [allowMultiple, setAllowMultiple] = useState(!!initialQuestion?.config?.allowMultiple);

  function changePoints(newPoints) {
    setPoints(newPoints);
    setLabels(DEFAULT_LIKERT_LABELS[newPoints]);
  }

  function updateOption(index, value) {
    setOptions(options.map((o, i) => (i === index ? value : o)));
  }

  function addOption() {
    setOptions([...options, '']);
  }

  function removeOption(index) {
    setOptions(options.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (prompt.replace(/<[^>]*>/g, '').trim() === '') return;

    let config = {};
    if (type === 'likert') {
      config = { points, labels };
    } else if (type === 'choice') {
      config = { options: options.filter((o) => o.trim() !== ''), allowMultiple };
    }

    onSave({ type, prompt, required, config });
  }

  return (
    <form className="question-editor-form" onSubmit={handleSubmit}>
      <label>
        Question type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="text">Free text</option>
          <option value="likert">Likert scale</option>
          <option value="choice">Multiple choice</option>
        </select>
      </label>

      {/* Not a <label> - it would wrap the toolbar's buttons, and browsers
          forward clicks anywhere in a label to its first labelable child
          (the Undo button), silently firing undo on every click. */}
      <div className="field">
        Prompt
        <RichTextEditor value={prompt} onChange={setPrompt} />
      </div>

      <label className="checkbox-label">
        <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
        Required
      </label>

      {type === 'likert' && (
        <div className="likert-config">
          <label>
            Points
            <select value={points} onChange={(e) => changePoints(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
            </select>
          </label>
          {labels.map((label, index) => (
            <label key={index}>
              {`Point ${index + 1} label`}
              <input
                value={label}
                onChange={(e) => setLabels(labels.map((l, i) => (i === index ? e.target.value : l)))}
              />
            </label>
          ))}
        </div>
      )}

      {type === 'choice' && (
        <div className="choice-config">
          <label className="checkbox-label">
            <input type="checkbox" checked={allowMultiple} onChange={(e) => setAllowMultiple(e.target.checked)} />
            Allow multiple selections
          </label>
          {options.map((option, index) => (
            <div key={index} className="choice-option-row">
              <input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <button type="button" onClick={() => removeOption(index)} disabled={options.length <= 2}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption}>Add option</button>
        </div>
      )}

      <div className="form-actions">
        <button type="submit">Save question</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
