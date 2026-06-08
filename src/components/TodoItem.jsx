import { useState } from "react";

function TodoItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [message, setMessage] = useState("");

  const startEditing = () => {
    setEditText(todo.text);
    setMessage("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditText(todo.text);
    setMessage("");
    setIsEditing(false);
  };

  const saveEdit = () => {
    const trimmedText = editText.trim();

    if (!trimmedText) {
      setMessage("수정할 내용을 입력해주세요.");
      return;
    }

    onUpdateTodo(todo.id, trimmedText);
    setIsEditing(false);
    setMessage("");
  };

  const handleEditKeyDown = (event) => {
    if (event.key === "Enter") {
      saveEdit();
    }

    if (event.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                onKeyDown={handleEditKeyDown}
                className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                autoFocus
              />
              {message && (
                <p className="mt-2 text-sm font-medium text-red-600">{message}</p>
              )}
            </>
          ) : (
            <span
              className={`block break-words text-base ${
                todo.isCompleted
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {todo.text}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
              >
                저장
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onToggleTodo(todo.id)}
                className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200"
              >
                {todo.isCompleted ? "취소" : "완료"}
              </button>
              <button
                type="button"
                onClick={startEditing}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDeleteTodo(todo.id)}
                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default TodoItem;
