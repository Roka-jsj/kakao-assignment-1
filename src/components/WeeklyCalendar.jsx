import {
  formatMonthTitle,
  getFormattedDate,
  getWeekDays,
} from "../utils/date";

function WeeklyCalendar({
  weekStartDate,
  selectedDate,
  todos,
  onMoveWeek,
  onSelectDate,
}) {
  const weekDays = getWeekDays(weekStartDate);
  const todayString = getFormattedDate(new Date());

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onMoveWeek(-1)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          이전 주
        </button>
        <h2 className="text-base font-bold text-slate-900">
          {formatMonthTitle(weekStartDate)}
        </h2>
        <button
          type="button"
          onClick={() => onMoveWeek(1)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          다음 주
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const count = todos.filter((todo) => todo.date === day.dateString).length;
          const isSelected = selectedDate === day.dateString;
          const isToday = todayString === day.dateString;

          return (
            <button
              key={day.dateString}
              type="button"
              onClick={() => onSelectDate(day.dateString)}
              className={`flex min-h-24 flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="text-xs font-semibold text-slate-500">
                {day.dayName}
              </span>
              <span
                className={`mt-1 text-lg font-bold ${
                  isToday ? "text-emerald-600" : ""
                }`}
              >
                {day.dayNumber}
              </span>
              <span
                className={`mt-2 rounded-full px-2 py-1 text-xs font-bold ${
                  count > 0
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default WeeklyCalendar;
