import type { Todo, TodoCreateInput, TodoUpdateInput } from "./todos/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

type GetTodosParams = {
  filter?: "active" | "completed";
  search?: string;
};

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") {
      return data.detail;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

export async function getTodos(params: GetTodosParams = {}): Promise<Todo[]> {
  const searchParams = new URLSearchParams();

  if (params.filter) {
    searchParams.set("filter", params.filter);
  }
  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  const query = searchParams.toString();
  const url = `${BACKEND_URL}/todos${query ? `?${query}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to fetch todos"));
  }

  return res.json();
}

export async function getTodo(todoId: string | number): Promise<Todo | null> {
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to fetch todo"));
  }

  return res.json();
}

export async function createTodo(data: TodoCreateInput): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to create todo"));
  }

  return res.json();
}

export async function updateTodo(
  todoId: string | number,
  data: TodoUpdateInput,
): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to update todo"));
  }

  return res.json();
}

export async function deleteTodo(todoId: string | number): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Failed to delete todo"));
  }
}
