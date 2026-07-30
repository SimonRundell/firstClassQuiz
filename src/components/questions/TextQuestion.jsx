import RichTextEditor from '../RichTextEditor';

/**
 * Free-text answer using the shared Tiptap-based rich text editor.
 *
 * @param {Object} props
 * @param {string} [props.value] - initial HTML content
 * @param {(html: string) => void} props.onChange
 */
export default function TextQuestion({ value = '', onChange }) {
  return <RichTextEditor value={value} onChange={onChange} />;
}
