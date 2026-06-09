import { useEffect, useMemo, useState } from "react";
import FilterTabs from "./components/FilterTabs";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import WeekNavigator from "./components/WeekNavigator";

const TODOS_STORAGE_KEY = "todos";
const WEEK_START_STORAGE_KEY = "weekStartDate";
const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];
const FULL_DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function createLocalDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);

    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
  }

  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function getFormattedDate(value) {
  const date = createLocalDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(value) {
  const date = createLocalDate(value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  date.setDate(diff);
  return date;
}

function addDays(value, amount) {
  const date = createLocalDate(value);
  date.setDate(date.getDate() + amount);

  return date;
}

function addWeeks(value, amount) {
  return addDays(value, amount * 7);
}

function getWeekDays(weekStartDate) {
  return DAY_NAMES.map((dayName, index) => {
    const date = addDays(weekStartDate, index);

    return {
      dateString: getFormattedDate(date),
      dayName,
      dayNumber: date.getDate(),
    };
  });
}

function formatMonthTitle(value) {
  const date = createLocalDate(value);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function formatKoreanDate(value) {
  const date = createLocalDate(value);
  const dayName = FULL_DAY_NAMES[date.getDay()];

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayName}요일`;
}

function readTodosFromStorage() {
  try {
    const savedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos
      .filter((todo) => todo && typeof todo.text === "string")
      .map((todo, index) => ({
        id: typeof todo.id === "number" ? todo.id : Date.now() + index,
        text: todo.text,
        isCompleted: Boolean(todo.isCompleted),
        date: todo.date || getFormattedDate(new Date()),
      }));
  } catch {
    return [];
  }
}

function readWeekStartFromStorage() {
  try {
    const savedWeekStart = localStorage.getItem(WEEK_START_STORAGE_KEY);

    if (savedWeekStart) {
      return getFormattedDate(getMonday(savedWeekStart));
    }
  } catch {
    return getFormattedDate(getMonday(new Date()));
  }

  return getFormattedDate(getMonday(new Date()));
}

function DailyNavigator({ selectedDate, todayString, onMoveDate, onGoToday }) {
  const isTodaySelected = selectedDate === todayString;

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
            onClick={onGoToday}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isTodaySelected
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

function ProgressDashboard({ todos }) {
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const totalCount = todos.length;
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

function App() {
  const todayString = getFormattedDate(new Date());
  const [todos, setTodos] = useState(readTodosFromStorage);
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [filter, setFilter] = useState("all");
  const [weekStartDate, setWeekStartDate] = useState(readWeekStartFromStorage);

  useEffect(() => {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(WEEK_START_STORAGE_KEY, weekStartDate);
  }, [weekStartDate]);

  const selectedDateTodos = useMemo(
    () => todos.filter((todo) => todo.date === selectedDate),
    [todos, selectedDate],
  );

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return selectedDateTodos.filter((todo) => !todo.isCompleted);
    }

    if (filter === "completed") {
      return selectedDateTodos.filter((todo) => todo.isCompleted);
    }

    return selectedDateTodos;
  }, [filter, selectedDateTodos]);

  const weekDays = useMemo(() => getWeekDays(weekStartDate), [weekStartDate]);

  const selectDate = (dateString) => {
    setSelectedDate(dateString);
    setWeekStartDate(getFormattedDate(getMonday(dateString)));
  };

  const moveDate = (amount) => {
    selectDate(getFormattedDate(addDays(selectedDate, amount)));
  };

  const moveWeek = (amount) => {
    const nextWeekStart = getFormattedDate(addWeeks(weekStartDate, amount));

    setWeekStartDate(nextWeekStart);
    setSelectedDate(nextWeekStart);
  };

  const goToday = () => {
    selectDate(todayString);
  };

  const addTodo = (text) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      alert("할 일을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: trimmedText,
      isCompleted: false,
      date: selectedDate,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    );
  };

  const updateTodo = (id, text) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmedText } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <header className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-600">
            React Function Component
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            To-Do List
          </h1>
        </header>

        <DailyNavigator
          selectedDate={selectedDate}
          todayString={todayString}
          onMoveDate={moveDate}
          onGoToday={goToday}
        />

        <WeekNavigator
          monthTitle={formatMonthTitle(weekStartDate)}
          weekDays={weekDays}
          todayString={todayString}
          selectedDate={selectedDate}
          todos={todos}
          onMoveWeek={moveWeek}
          onSelectDate={selectDate}
        />

        <ProgressDashboard todos={selectedDateTodos} />

        <TodoInput onAddTodo={addTodo} />

        <FilterTabs filter={filter} onChangeFilter={setFilter} />

        <TodoList
          todos={filteredTodos}
          totalCountForDate={selectedDateTodos.length}
          filter={filter}
          onToggleTodo={toggleTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
        />
      </div>
    </main>
  );
}

export default App;
