import TodoItem from "./TodoItem";

function TodoList({
  todos,
  totalCountForDate,
  filter,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
}) {
  const emptyMessage =
    totalCountForDate === 0
      ? "선택한 날짜에 등록된 할 일이 없어요."
      : "현재 필터에 해당하는 할 일이 없어요.";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Todo 목록</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {filter === "all" ? "전체" : filter === "active" ? "진행 중" : "완료"}{" "}
          {todos.length}개
        </span>
      </div>

      {todos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleTodo={onToggleTodo}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
