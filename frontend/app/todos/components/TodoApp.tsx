"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Todo, TodoFilter } from "../types";
import ProgressSummary from "./ProgressSummary";
import TodoFilterTabs from "./TodoFilter";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import TodoSearch from "./TodoSearch";
import WeekNavigator from "./WeekNavigator";

const SELECTED_DATE_STORAGE_KEY = "kakao-assignment-3:selectedDate";
const WEEK_START_STORAGE_KEY = "kakao-assignment-3:weekStartDate";
const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];
const FULL_DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

type TodoAppProps = {
  initialTodos: Todo[];
  allTodosForStats: Todo[];
  initialFilter: TodoFilter;
  initialSearch: string;
};

function isDateString(value: string | null | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function createLocalDate(value?: Date | string | null) {
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

function getFormattedDate(value?: Date | string | null) {
  const date = createLocalDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(value?: Date | string | null) {
  const date = createLocalDate(value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  date.setDate(diff);
  return date;
}

function addDays(value: Date | string, amount: number) {
  const date = createLocalDate(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function addWeeks(value: Date | string, amount: number) {
  return addDays(value, amount * 7);
}

function getWeekDays(weekStartDate: string) {
  return DAY_NAMES.map((dayName, index) => {
    const date = addDays(weekStartDate, index);

    return {
      dateString: getFormattedDate(date),
      dayName,
      dayNumber: date.getDate(),
    };
  });
}

function formatMonthTitle(value: string) {
  const date = createLocalDate(value);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function formatKoreanDate(value: string) {
  const date = createLocalDate(value);
  const dayName = FULL_DAY_NAMES[date.getDay()];

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayName}요일`;
}

function countByDate(todos: Todo[], dateString: string) {
  return todos.filter((todo) => todo.date === dateString).length;
}

function DailyNavigator({
  selectedDate,
  todayString,
  onMoveDate,
  onGoToday,
}: {
  selectedDate: string;
  todayString: string;
  onMoveDate: (amount: number) => void;
  onGoToday: () => void;
}) {
  const isTodaySelected = selectedDate === todayString;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">선택한 날짜</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
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

export default function TodoApp({
  initialTodos,
  allTodosForStats,
  initialFilter,
  initialSearch,
}: TodoAppProps) {
  const todayString = getFormattedDate(new Date());
  const [hasLoadedStoredUi, setHasLoadedStoredUi] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [weekStartDate, setWeekStartDate] = useState(
    getFormattedDate(getMonday(todayString)),
  );

  useEffect(() => {
    const savedSelectedDate = window.localStorage.getItem(
      SELECTED_DATE_STORAGE_KEY,
    );
    const savedWeekStart = window.localStorage.getItem(WEEK_START_STORAGE_KEY);

    if (isDateString(savedSelectedDate)) {
      setSelectedDate(savedSelectedDate);
    }
    if (isDateString(savedWeekStart)) {
      setWeekStartDate(getFormattedDate(getMonday(savedWeekStart)));
    } else if (isDateString(savedSelectedDate)) {
      setWeekStartDate(getFormattedDate(getMonday(savedSelectedDate)));
    }

    setHasLoadedStoredUi(true);
  }, []);

  useEffect(() => {
    if (hasLoadedStoredUi) {
      window.localStorage.setItem(SELECTED_DATE_STORAGE_KEY, selectedDate);
    }
  }, [hasLoadedStoredUi, selectedDate]);

  useEffect(() => {
    if (hasLoadedStoredUi) {
      window.localStorage.setItem(WEEK_START_STORAGE_KEY, weekStartDate);
    }
  }, [hasLoadedStoredUi, weekStartDate]);

  const weekDays = useMemo(() => getWeekDays(weekStartDate), [weekStartDate]);

  const selectedVisibleTodos = useMemo(
    () => initialTodos.filter((todo) => todo.date === selectedDate),
    [initialTodos, selectedDate],
  );

  const selectedAllTodos = useMemo(
    () => allTodosForStats.filter((todo) => todo.date === selectedDate),
    [allTodosForStats, selectedDate],
  );

  const weekTodoCount = useMemo(
    () =>
      weekDays.reduce(
        (total, day) => total + countByDate(allTodosForStats, day.dateString),
        0,
      ),
    [allTodosForStats, weekDays],
  );

  function selectDate(dateString: string) {
    const nextDate = getFormattedDate(dateString);
    setSelectedDate(nextDate);
    setWeekStartDate(getFormattedDate(getMonday(nextDate)));
  }

  function moveDate(amount: number) {
    selectDate(getFormattedDate(addDays(selectedDate, amount)));
  }

  function moveWeek(amount: number) {
    const nextWeekStart = getFormattedDate(addWeeks(weekStartDate, amount));
    setWeekStartDate(nextWeekStart);
    setSelectedDate(nextWeekStart);
  }

  function goToday() {
    selectDate(todayString);
  }

  const emptyMessage =
    selectedAllTodos.length === 0
      ? "선택한 날짜에 등록된 할 일이 없어요."
      : initialSearch
        ? "현재 검색어와 필터에 해당하는 할 일이 없어요."
        : "현재 필터에 해당하는 할 일이 없어요.";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <header className="flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-600">
              Next.js App Router + FastAPI
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              To-Do List
            </h1>
          </div>
          <Link
            href={`/todos/new?date=${selectedDate}`}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            생성 페이지 열기
          </Link>
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
          todos={allTodosForStats}
          weekTodoCount={weekTodoCount}
          onMoveWeek={moveWeek}
          onSelectDate={selectDate}
        />

        <ProgressSummary todos={selectedAllTodos} />

        <TodoForm selectedDate={selectedDate} />

        <TodoSearch initialSearch={initialSearch} filter={initialFilter} />

        <TodoFilterTabs filter={initialFilter} search={initialSearch} />

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-950">Todo 목록</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {initialFilter === "all"
                ? "전체"
                : initialFilter === "active"
                  ? "진행 중"
                  : "완료"}{" "}
              {selectedVisibleTodos.length}개
            </span>
          </div>

          {selectedVisibleTodos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-medium text-slate-500">
              {emptyMessage}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {selectedVisibleTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
