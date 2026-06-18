"use client";

import { usePathname, useRouter } from "next/navigation";
import type { TodoFilter } from "../types";

const FILTERS: Array<{ value: TodoFilter; label: string }> = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default function TodoFilterTabs({
  filter,
  search,
}: {
  filter: TodoFilter;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function changeFilter(nextFilter: TodoFilter) {
    const params = new URLSearchParams();

    if (nextFilter !== "all") {
      params.set("filter", nextFilter);
    }
    if (search.trim()) {
      params.set("search", search.trim());
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {FILTERS.map((item) => {
        const isActive = filter === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => changeFilter(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
