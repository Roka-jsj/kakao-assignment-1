import { useState } from "react";

function TodoInput({ onAddTodo }) {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage("할 일을 입력해주세요.");
      return;
    }

    onAddTodo(trimmedText);
    setText("");
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="새로운 할 일을 입력하세요..."
          className="min-h-12 flex-1 rounded-lg border border-slate-200 px-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          className="min-h-12 rounded-lg bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          추가
        </button>
      </div>
      {message && <p className="mt-3 text-sm font-medium text-red-600">{message}</p>}
    </form>
  );
}

export default TodoInput;
