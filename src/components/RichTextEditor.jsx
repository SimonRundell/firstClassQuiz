import { useEditor, EditorContent } from '@tiptap/react';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';

const CODE_BLOCK_TAB_SIZE = 4;

/**
 * Defined once at module scope (not inside the component) so this array
 * has a stable identity across renders. Tiptap's useEditor re-diffs its
 * options object on every render and only skips reinitialising the
 * editor when every option - including `extensions` - is reference-equal
 * to what it saw before; recreating this array inline on every render
 * made it look different every time, which was silently forcing the
 * editor to reset far more often than intended.
 */
const EXTENSIONS = [
  StarterKit.configure({
    codeBlock: { enableTabIndentation: true, tabSize: CODE_BLOCK_TAB_SIZE },
  }),
  Subscript,
  Superscript,
];

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
 * Indents every line of the current selection (or just the current
 * line, if the cursor is collapsed) by one tab stop. Only meaningful
 * inside a code block, where whitespace is significant.
 *
 * @param {import('@tiptap/react').Editor} editor
 */
function indentCodeBlock(editor) {
  const { state } = editor;
  const { from, to, empty } = state.selection;
  const indent = ' '.repeat(CODE_BLOCK_TAB_SIZE);

  if (empty) {
    editor.chain().focus().insertContent(indent).run();
    return;
  }

  editor.chain().focus().command(({ tr }) => {
    const text = state.doc.textBetween(from, to, '\n', '\n');
    const indented = text.split('\n').map((line) => indent + line).join('\n');
    tr.replaceWith(from, to, state.schema.text(indented));
    return true;
  }).run();
}

/**
 * Removes up to one tab stop of leading whitespace from every line of
 * the current selection (or just the current line, if the cursor is
 * collapsed).
 *
 * @param {import('@tiptap/react').Editor} editor
 */
function outdentCodeBlock(editor) {
  const { state } = editor;
  const { $from, from, to, empty } = state.selection;

  if (empty) {
    editor.chain().focus().command(({ tr }) => {
      const blockStart = $from.start();
      const blockEnd = $from.end();
      const lines = state.doc.textBetween(blockStart, blockEnd, '\n', '\n').split('\n');
      const relativeCursorPos = $from.pos - blockStart;

      let currentLineIndex = 0;
      let charCount = 0;
      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= relativeCursorPos) {
          currentLineIndex = i;
          break;
        }
        charCount += lines[i].length + 1;
      }

      const leadingSpaces = (lines[currentLineIndex].match(/^ */) || [''])[0];
      const spacesToRemove = Math.min(leadingSpaces.length, CODE_BLOCK_TAB_SIZE);
      if (spacesToRemove === 0) return true;

      let lineStartPos = blockStart;
      for (let i = 0; i < currentLineIndex; i++) lineStartPos += lines[i].length + 1;
      tr.delete(lineStartPos, lineStartPos + spacesToRemove);
      return true;
    }).run();
    return;
  }

  editor.chain().focus().command(({ tr }) => {
    const text = state.doc.textBetween(from, to, '\n', '\n');
    const outdented = text.split('\n').map((line) => {
      const leadingSpaces = (line.match(/^ */) || [''])[0];
      return line.slice(Math.min(leadingSpaces.length, CODE_BLOCK_TAB_SIZE));
    }).join('\n');
    tr.replaceWith(from, to, state.schema.text(outdented));
    return true;
  }).run();
}

/**
 * Rich text editor (Tiptap) with a fixed formatting toolbar, used
 * everywhere staff or students enter formatted text: quiz question
 * prompts and free-text answers.
 *
 * Deliberately uncontrolled: `value` seeds the editor once on mount and
 * is never re-applied after that (see the EXTENSIONS comment above for
 * why re-applying it on every keystroke was actively harmful). Every
 * change is still reported upwards via `onChange` as it happens - the
 * parent just shouldn't feed that same value back in as `value`.
 *
 * @param {Object} props
 * @param {string} [props.value] - initial HTML content
 * @param {(html: string) => void} props.onChange
 */
export default function RichTextEditor({ value = '', onChange }) {
  const [initialValue] = useState(value);
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialValue,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    // Tiptap v3 no longer re-renders the component on every transaction by
    // default (v2 always did). Without this, the toolbar's active/inactive
    // button states only refresh when the document itself changes - so
    // moving the cursor with a click or arrow keys (no typing) leaves the
    // toolbar showing stale state from whatever was last typed.
    shouldRerenderOnTransaction: true,
  });

  if (!editor) return null;

  const inCodeBlock = editor.isActive('codeBlock');

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
          title="Inline code"
          label="</>"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolbarButton
          title="Code block"
          label="{ }"
          active={inCodeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          title="Indent (code block)"
          label="→"
          disabled={!inCodeBlock}
          onClick={() => indentCodeBlock(editor)}
        />
        <ToolbarButton
          title="Outdent (code block)"
          label="←"
          disabled={!inCodeBlock}
          onClick={() => outdentCodeBlock(editor)}
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
