/**
 * Multiple-choice question. Renders radio buttons when
 * config.allowMultiple is false, checkboxes otherwise.
 *
 * @param {Object} props
 * @param {{options: string[], allowMultiple?: boolean}} props.config
 * @param {number[]} props.value - selected option indices
 * @param {(selected: number[]) => void} props.onChange
 * @param {string} props.name - unique input group name
 */
export default function ChoiceQuestion({ config, value = [], onChange, name }) {
  const options = config?.options || [];
  const allowMultiple = !!config?.allowMultiple;

  function toggle(index) {
    if (allowMultiple) {
      const next = value.includes(index)
        ? value.filter((i) => i !== index)
        : [...value, index];
      onChange(next);
    } else {
      onChange([index]);
    }
  }

  return (
    <div className="choice-question">
      {options.map((option, index) => (
        <label key={index} className="choice-option">
          <input
            type={allowMultiple ? 'checkbox' : 'radio'}
            name={name}
            checked={value.includes(index)}
            onChange={() => toggle(index)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
