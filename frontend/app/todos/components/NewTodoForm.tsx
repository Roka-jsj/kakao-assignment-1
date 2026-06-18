"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const SELECTED_DATE_STORAGE_KEY = "kakao-assignment-3:selectedDate";
const WEEK_START_STORAGE_KEY = "kakao-assignment-3:weekStartDate";

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

export default function NewTodoForm({ initialDate }: { initialDate: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setMessage("제목을 입력해주세요.");
      return;
    }
    if (!isDateString(date)) {
      setMessage("날짜는 YYYY-MM-DD 형식이어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          completed: false,
          date,
        }),
      });

      if (!res.ok) {
        throw new Error("Todo 생성에 실패했습니다.");
      }

      window.localStorage.setItem(SELECTED_DATE_STORAGE_KEY, date);
      window.localStorage.setItem(WEEK_START_STORAGE_KEY, getMonday(date));
      router.push("/todos");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">새 Todo</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
            제목
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="할 일을 입력하세요"
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
          </div>
        </form>
      </div>
    </main>
  );
}
