"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TodoFilter } from "../types";

export default function TodoSearch({
  initialSearch,
  filter,
}: {
  initialSearch: string;
  filter: TodoFilter;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(initialSearch);

  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const nextSearch = searchInput.trim();

    if (nextSearch === initialSearch) {
      return;
    }

    const timerId = window.setTimeout(() => {
      const params = new URLSearchParams();

      if (filter !== "all") {
        params.set("filter", filter);
      }
      if (nextSearch) {
        params.set("search", nextSearch);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [filter, initialSearch, pathname, router, searchInput]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label
        htmlFor="todo-search"
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        Todo 검색
      </label>
      <div className="flex gap-2">
        <input
          id="todo-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="검색어를 입력하세요..."
          className="min-h-12 flex-1 rounded-lg border border-slate-200 px-4 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
          >
            지우기
          </button>
        )}
      </div>
    </section>
  );
}
