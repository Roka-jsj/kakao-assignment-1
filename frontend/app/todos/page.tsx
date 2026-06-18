import { getTodos } from "../actions";
import TodoApp from "./components/TodoApp";
import type { TodoFilter } from "./types";

export const dynamic = "force-dynamic";

type SearchValue = string | string[] | undefined;

type TodosPageProps = {
  searchParams?: Promise<{
    filter?: SearchValue;
    search?: SearchValue;
  }>;
};

function firstParam(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeFilter(value: SearchValue): Exclude<TodoFilter, "all"> | undefined {
  const filter = firstParam(value);
  return filter === "active" || filter === "completed" ? filter : undefined;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const params = searchParams ? await searchParams : {};
  const filter = normalizeFilter(params.filter);
  const search = firstParam(params.search)?.trim() || undefined;

  const [visibleTodos, allTodosForStats] = await Promise.all([
    getTodos({ filter, search }),
    getTodos(),
  ]);

  return (
    <TodoApp
      initialTodos={visibleTodos}
      allTodosForStats={allTodosForStats}
      initialFilter={filter ?? "all"}
      initialSearch={search ?? ""}
    />
  );
}
