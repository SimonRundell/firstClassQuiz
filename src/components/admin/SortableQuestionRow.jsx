import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { stripHtml } from '../../utils/html';

/**
 * One draggable question row in the admin quiz editor. Shows a drag
 * handle, the question type and prompt, and right-aligned edit/delete
 * icon buttons that line up regardless of prompt length.
 *
 * @param {Object} props
 * @param {Object} props.question
 * @param {() => void} props.onEdit
 * @param {() => void} props.onDelete
 */
export default function SortableQuestionRow({ question, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="editor-question-row">
      <button
        type="button"
        className="drag-handle"
        title="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      <span className="question-type-tag">{question.type}</span>
      <span className="question-row-prompt">{stripHtml(question.prompt)}</span>
      <div className="row-actions">
        <button type="button" className="icon-button" title="Edit" onClick={onEdit}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button type="button" className="icon-button" title="Delete" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  );
}
