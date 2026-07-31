import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import {
  listQuizzes,
  updateQuiz,
  listQuestionSets,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../api/quizzes';
import QuestionEditorForm from '../components/admin/QuestionEditorForm';
import SortableQuestionRow from '../components/admin/SortableQuestionRow';
import CsvImportModal from '../components/admin/CsvImportModal';
import { useConfirm } from '../context/ConfirmContext';
import { useAlert } from '../context/AlertContext';

/** Keeps drag movement to the vertical axis of the question list. */
function restrictToVerticalAxis({ transform }) {
  return { ...transform, x: 0 };
}

/** Builds and edits a quiz's question sets and questions. */
export default function AdminQuizEditor() {
  const { id } = useParams();
  const quizId = Number(id);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const confirm = useConfirm();
  const alert = useAlert();

  const [quiz, setQuiz] = useState(null);
  const [sets, setSets] = useState([]);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [addingQuestionToSet, setAddingQuestionToSet] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [editingSetId, setEditingSetId] = useState(null);
  const [editSetTitleDraft, setEditSetTitleDraft] = useState('');

  async function refresh() {
    const quizzes = await listQuizzes();
    setQuiz(quizzes.find((q) => q.id === quizId) || null);

    const setRows = await listQuestionSets(quizId);
    const withQuestions = await Promise.all(
      setRows.map(async (set) => ({ ...set, questions: await listQuestions(set.id) }))
    );
    setSets(withQuestions);
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    refresh();
  }, [quizId]);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  function startEditingTitle() {
    setTitleDraft(quiz.title);
    setIsEditingTitle(true);
  }

  async function handleSaveTitle(e) {
    e.preventDefault();
    const trimmed = titleDraft.trim();
    if (!trimmed) return;
    await updateQuiz(quizId, { title: trimmed, description: quiz.description, isActive: quiz.isActive });
    setIsEditingTitle(false);
    await refresh();
  }

  async function handleAddSet(e) {
    e.preventDefault();
    if (!newSetTitle.trim()) {
      await alert('Please enter a title for the new set.', { title: 'Title required' });
      return;
    }
    await createQuestionSet({ quizId, title: newSetTitle.trim() });
    setNewSetTitle('');
    await refresh();
  }

  function startEditingSetTitle(set) {
    setEditSetTitleDraft(set.title);
    setEditingSetId(set.id);
  }

  async function handleSaveSetTitle(e, set) {
    e.preventDefault();
    const trimmed = editSetTitleDraft.trim();
    if (!trimmed) return;
    await updateQuestionSet(set.id, { title: trimmed, sortOrder: set.sortOrder });
    setEditingSetId(null);
    await refresh();
  }

  async function handleDeleteSet(set) {
    const ok = await confirm(`Delete set "${set.title}" and all its questions?`, {
      title: 'Delete question set',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    await deleteQuestionSet(set.id);
    await refresh();
  }

  async function moveSet(set, direction) {
    const index = sets.findIndex((s) => s.id === set.id);
    const swapWith = sets[index + direction];
    if (!swapWith) return;
    await updateQuestionSet(set.id, { title: set.title, sortOrder: swapWith.sortOrder });
    await updateQuestionSet(swapWith.id, { title: swapWith.title, sortOrder: set.sortOrder });
    await refresh();
  }

  async function handleQuestionDragEnd(set, event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = set.questions.findIndex((q) => q.id === active.id);
    const newIndex = set.questions.findIndex((q) => q.id === over.id);
    const reordered = arrayMove(set.questions, oldIndex, newIndex);

    await Promise.all(reordered.map((q, index) => updateQuestion(q.id, { ...q, sortOrder: index })));
    await refresh();
  }

  async function handleSaveQuestion(setId, data) {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, { ...editingQuestion, ...data });
    } else {
      await createQuestion({ setId, ...data });
    }
    setAddingQuestionToSet(null);
    setEditingQuestion(null);
    await refresh();
  }

  async function handleDeleteQuestion(question) {
    const ok = await confirm('Delete this question?', {
      title: 'Delete question',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    await deleteQuestion(question.id);
    await refresh();
  }

  if (!quiz) return <div className="page-message">Loading...</div>;

  return (
    <div className="admin-quiz-editor">
      <p><Link to="/admin" className="button-link">&larr; Back to quizzes</Link></p>
      <div className="admin-quiz-editor-header">
        {isEditingTitle ? (
          <form className="quiz-title-form" onSubmit={handleSaveTitle}>
            <input
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              autoFocus
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditingTitle(false)}>Cancel</button>
          </form>
        ) : (
          <h1>
            {quiz.title}
            <button type="button" className="icon-button" title="Rename quiz" onClick={startEditingTitle}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </h1>
        )}
        <button type="button" onClick={() => setShowCsvImport(true)}>Import questions from CSV</button>
      </div>

      {showCsvImport && (
        <CsvImportModal
          quizId={quizId}
          onImported={refresh}
          onClose={() => setShowCsvImport(false)}
        />
      )}

      {sets.map((set, setIndex) => (
        <section key={set.id} className="editor-set">
          <div className="editor-set-header">
            {editingSetId === set.id ? (
              <form className="quiz-title-form" onSubmit={(e) => handleSaveSetTitle(e, set)}>
                <input
                  value={editSetTitleDraft}
                  onChange={(e) => setEditSetTitleDraft(e.target.value)}
                  autoFocus
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingSetId(null)}>Cancel</button>
              </form>
            ) : (
              <h2>
                {set.title}
                <button type="button" className="icon-button" title="Rename set" onClick={() => startEditingSetTitle(set)}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </h2>
            )}
            <div className="reorder-controls">
              <button type="button" onClick={() => moveSet(set, -1)} disabled={setIndex === 0}>&uarr;</button>
              <button type="button" onClick={() => moveSet(set, 1)} disabled={setIndex === sets.length - 1}>&darr;</button>
              <button type="button" onClick={() => handleDeleteSet(set)}>Delete set</button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={(event) => handleQuestionDragEnd(set, event)}
          >
            <SortableContext items={set.questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
              <ul className="editor-question-list">
                {set.questions.map((question) => (
                  editingQuestion?.id === question.id ? (
                    <li key={question.id}>
                      <QuestionEditorForm
                        initialQuestion={question}
                        onSave={(data) => handleSaveQuestion(set.id, data)}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    </li>
                  ) : (
                    <SortableQuestionRow
                      key={question.id}
                      question={question}
                      onEdit={() => setEditingQuestion(question)}
                      onDelete={() => handleDeleteQuestion(question)}
                    />
                  )
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          {addingQuestionToSet === set.id ? (
            <QuestionEditorForm
              onSave={(data) => handleSaveQuestion(set.id, data)}
              onCancel={() => setAddingQuestionToSet(null)}
            />
          ) : (
            <button type="button" onClick={() => setAddingQuestionToSet(set.id)}>Add question</button>
          )}
        </section>
      ))}

      <form className="inline-form" onSubmit={handleAddSet}>
        <input
          placeholder="New set title"
          value={newSetTitle}
          onChange={(e) => setNewSetTitle(e.target.value)}
        />
        <button type="submit">Add set</button>
      </form>
    </div>
  );
}
