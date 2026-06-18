"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import type { Todo } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const SELECTED_DATE_STORAGE_KEY = "kakao-assignment-3:selectedDate";
const WEEK_START_STORAGE_KEY = "kakao-assignment-3:weekStartDate";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getMonday(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  date.setDate(diff);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [date, setDate] = useState(todo.date ?? getToday());
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setMessage("제목을 입력해주세요.");
      return;
    }
    if (date && !isDateString(date)) {
      setMessage("날짜는 YYYY-MM-DD 형식이어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          completed,
          date: date || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Todo 수정에 실패했습니다.");
      }

      if (date) {
        window.localStorage.setItem(SELECTED_DATE_STORAGE_KEY, date);
        window.localStorage.setItem(WEEK_START_STORAGE_KEY, getMonday(date));
      }
      router.push("/todos");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Todo 삭제에 실패했습니다.");
      }

      router.push("/todos");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Todo 수정</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
            제목
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="min-h-12 rounded-lg border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
            날짜
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="min-h-12 rounded-lg border border-slate-200 px-4 text-base font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) => setCompleted(event.target.checked)}
              className="h-5 w-5 accent-indigo-600"
            />
            완료됨
          </label>

          {message && (
            <p className="text-sm font-medium text-red-600">{message}</p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isSubmitting ? "저장 중" : "저장"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:text-red-300"
            >
              {isDeleting ? "삭제 중" : "삭제"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
