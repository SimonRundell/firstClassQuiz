/**
 * Likert-scale question: a row of radio buttons, one per point, each
 * labelled from config.labels (falling back to the point number if a
 * label wasn't set for that point).
 *
 * @param {Object} props
 * @param {{points: number, labels?: string[]}} props.config
 * @param {number|null} props.value - selected point (1-based)
 * @param {(value: number) => void} props.onChange
 * @param {string} props.name - unique radio group name
 */
export default function LikertQuestion({ config, value, onChange, name }) {
  const points = config?.points || 5;
  const labels = config?.labels || [];

  return (
    <div className="likert-question">
      {Array.from({ length: points }, (_, i) => i + 1).map((point) => (
        <label key={point} className="likert-option">
          <input
            type="radio"
            name={name}
            value={point}
            checked={value === point}
            onChange={() => onChange(point)}
          />
          <span>{labels[point - 1] || point}</span>
        </label>
      ))}
    </div>
  );
}
