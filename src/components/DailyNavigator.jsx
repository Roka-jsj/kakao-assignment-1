import { formatKoreanDate, getFormattedDate } from "../utils/date";

function DailyNavigator({ selectedDate, onMoveDate, onToday }) {
  const todayString = getFormattedDate(new Date());
  const isToday = selectedDate === todayString;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">선택한 날짜</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {formatKoreanDate(selectedDate)}
          </h2>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            오늘: {formatKoreanDate(todayString)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onMoveDate(-1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            이전 날짜
          </button>
          <button
            type="button"
            onClick={onToday}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isToday
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => onMoveDate(1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            다음 날짜
          </button>
        </div>
      </div>
    </section>
  );
}

export default DailyNavigator;
