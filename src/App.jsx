import { useEffect, useMemo, useState } from "react";
import DailyNavigator from "./components/DailyNavigator";
import FilterTabs from "./components/FilterTabs";
import ProgressDashboard from "./components/ProgressDashboard";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import WeeklyCalendar from "./components/WeeklyCalendar";
import {
  addDays,
  addWeeks,
  getFormattedDate,
  getMonday,
} from "./utils/date";

const TODOS_STORAGE_KEY = "todos";
const WEEK_START_STORAGE_KEY = "weekStartDate";

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
          onMoveDate={moveDate}
          onToday={goToday}
        />

        <WeeklyCalendar
          weekStartDate={weekStartDate}
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
