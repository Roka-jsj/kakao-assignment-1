function ProgressDashboard({ todos }) {
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900">
          선택한 날짜의 달성률
        </h2>
        <span className="text-sm font-bold text-indigo-600">
          {progress}% ({completedCount}/{totalCount})
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-indigo-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

export default ProgressDashboard;
