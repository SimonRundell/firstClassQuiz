import Papa from 'papaparse';

export const CSV_COLUMNS = ['Set', 'Type', 'Prompt', 'Required', 'Points', 'Labels', 'Options', 'AllowMultiple'];

const DEFAULT_LIKERT_LABELS = {
  3: ['Disagree', 'Neutral', 'Agree'],
  5: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  7: [
    'Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neutral',
    'Somewhat agree', 'Agree', 'Strongly agree',
  ],
};

const TRUTHY = ['yes', 'y', 'true', '1'];

/** @param {string} text @returns {string} */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Converts a plain-text CSV cell into the simple HTML the rest of the
 * app expects question prompts to be stored as.
 *
 * @param {string} text
 * @returns {string}
 */
export function promptTextToHtml(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return `<p>${escapeHtml(text.trim())}</p>`;
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
}

/**
 * A ready-to-paste example CSV covering all three question types, for
 * staff to open in Excel and use as a starting point.
 *
 * @returns {string}
 */
export function buildTemplateCsv() {
  return Papa.unparse({
    fields: CSV_COLUMNS,
    data: [
      ['Getting to know you', 'text', 'What is your favourite subject and why?', 'yes', '', '', '', ''],
      ['Getting to know you', 'likert', 'How confident do you feel about this topic?', 'yes', '5',
        'Not at all confident|A little confident|Neutral|Confident|Very confident', '', ''],
      ['Getting to know you', 'choice', 'Which of these have you studied before?', 'no', '', '',
        'Biology|Chemistry|Physics|None of these', 'yes'],
    ],
  });
}

/**
 * The prompt teachers can paste into their own AI tool of choice,
 * alongside a lesson plan or scheme of work, to generate a CSV in the
 * exact shape this app expects.
 */
export const AI_PROMPT = `Using the attached lesson plan or scheme of work, write a set of quiz questions for my students and give me the output as CSV with exactly these column headers:

Set,Type,Prompt,Required,Points,Labels,Options,AllowMultiple

Rules for each column:
- Set: the name of the question group this question belongs to (e.g. a lesson, topic or week title). Group related questions under the same Set name.
- Type: one of "text", "likert" or "choice"
- Prompt: the question text written for the students, plain text with no HTML
- Required: "yes" or "no"
- Points: only fill in for Type=likert - use 3, 5 or 7
- Labels: only fill in for Type=likert - the label for each point on the scale, separated by | characters, ordered from lowest to highest, and there must be exactly as many labels as Points
- Options: only fill in for Type=choice - the answer options, separated by | characters
- AllowMultiple: only fill in for Type=choice - "yes" if students can select more than one option, otherwise "no"

Leave a column blank if it doesn't apply to that question's Type. Output only the CSV, and make it downloadable with a header row, ready to paste straight into a spreadsheet - no extra commentary.`;

/**
 * Parses a raw CSV string and validates every row against the rules
 * above, returning one entry per row with any errors attached so the
 * caller can show a preview before committing the import.
 *
 * @param {string} csvText
 * @returns {Array<{rowNumber: number, setTitle: string, type: string, prompt: string, required: boolean, config: Object, errors: string[]}>}
 */
export function parseAndValidateCsv(csvText) {
  const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  return data.map((raw, index) => {
    const errors = [];
    const setTitle = (raw.Set || '').trim();
    const type = (raw.Type || '').trim().toLowerCase();
    const promptText = (raw.Prompt || '').trim();
    const requiredRaw = (raw.Required || '').trim().toLowerCase();
    const required = requiredRaw === '' || TRUTHY.includes(requiredRaw);

    if (!setTitle) errors.push('Set is required');
    if (!['text', 'likert', 'choice'].includes(type)) errors.push('Type must be text, likert or choice');
    if (!promptText) errors.push('Prompt is required');

    let config = {};

    if (type === 'likert') {
      const points = parseInt(raw.Points, 10);
      if (![3, 5, 7].includes(points)) {
        errors.push('Points must be 3, 5 or 7 for likert questions');
      } else {
        const labels = (raw.Labels || '').split('|').map((s) => s.trim()).filter(Boolean);
        if (labels.length && labels.length !== points) {
          errors.push(`Labels count (${labels.length}) must match Points (${points})`);
        }
        config = { points, labels: labels.length === points ? labels : DEFAULT_LIKERT_LABELS[points] };
      }
    } else if (type === 'choice') {
      const options = (raw.Options || '').split('|').map((s) => s.trim()).filter(Boolean);
      if (options.length < 2) errors.push('Choice questions need at least 2 Options separated by |');
      const allowMultipleRaw = (raw.AllowMultiple || '').trim().toLowerCase();
      config = { options, allowMultiple: TRUTHY.includes(allowMultipleRaw) };
    }

    return {
      rowNumber: index + 2,
      setTitle,
      type,
      prompt: promptText,
      required,
      config,
      errors,
    };
  });
}
