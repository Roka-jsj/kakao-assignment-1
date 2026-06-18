"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { Todo } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  function startEditing() {
    setEditTitle(todo.title);
    setMessage("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditTitle(todo.title);
    setMessage("");
    setIsEditing(false);
  }

  async function saveEdit() {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setMessage("수정할 내용을 입력해주세요.");
      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!res.ok) {
        throw new Error("Todo 수정에 실패했습니다.");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleTodo() {
    setIsToggling(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) {
        throw new Error("완료 상태 변경에 실패했습니다.");
      }

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
    } finally {
      setIsToggling(false);
    }
  }

  async function deleteTodo() {
    setIsDeleting(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Todo 삭제에 실패했습니다.");
      }

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
      setIsDeleting(false);
    }
  }

  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      saveEdit();
    }
    if (event.key === "Escape") {
      cancelEditing();
    }
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                onKeyDown={handleEditKeyDown}
                className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                autoFocus
              />
              {message && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {message}
                </p>
              )}
            </>
          ) : (
            <>
              <span
                className={`block break-words text-base ${
                  todo.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-950"
                }`}
              >
                {todo.title}
              </span>
              {message && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={saveEdit}
                disabled={isSaving}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isSaving ? "저장 중" : "저장"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSaving}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:text-slate-300"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleTodo}
                disabled={isToggling}
                className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200 disabled:text-emerald-300"
              >
                {todo.completed ? "취소" : "완료"}
              </button>
              <button
                type="button"
                onClick={startEditing}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                인라인 수정
              </button>
              <Link
                href={`/todos/${todo.id}`}
                className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
              >
                상세 수정
              </Link>
              <button
                type="button"
                onClick={deleteTodo}
                disabled={isDeleting}
                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:text-red-300"
              >
                {isDeleting ? "삭제 중" : "삭제"}
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
