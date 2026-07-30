import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

/** @param {{label: string, title: string, active?: boolean, disabled?: boolean, onClick: () => void}} props */
function ToolbarButton({ label, title, active, disabled, onClick }) {
  return (
    <button
      type="button"
      title={title}
      className={`rte-toolbar-button${active ? ' is-active' : ''}`}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * Rich text editor (Tiptap) with a fixed formatting toolbar, used
 * everywhere staff or students enter formatted text: quiz question
 * prompts and free-text answers.
 *
 * @param {Object} props
 * @param {string} [props.value] - initial HTML content
 * @param {(html: string) => void} props.onChange
 */
export default function RichTextEditor({ value = '', onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Subscript, Superscript],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="rich-text-editor">
      <div className="rte-toolbar">
        <ToolbarButton
          title="Undo"
          label="↺"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          title="Redo"
          label="↻"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
        <span className="rte-toolbar-divider" />
        <ToolbarButton
          title="Bold"
          label="B"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          title="Italic"
          label="I"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          title="Underline"
          label="U"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          title="Subscript"
          label="X₂"
          active={editor.isActive('subscript')}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        />
        <ToolbarButton
          title="Superscript"
          label="X²"
          active={editor.isActive('superscript')}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        />
        <span className="rte-toolbar-divider" />
        <ToolbarButton
          title="Normal text"
          label="¶"
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />
        <ToolbarButton
          title="Code"
          label="</>"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <span className="rte-toolbar-divider" />
        <ToolbarButton
          title="Bulleted list"
          label="•"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          title="Numbered list"
          label="1."
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          title="Horizontal line"
          label="―"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
