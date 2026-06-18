export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
};

export type TodoCreateInput = {
  title: string;
  completed?: boolean;
  date?: string | null;
};

export type TodoUpdateInput = {
  title?: string;
  completed?: boolean;
  date?: string | null;
};

export type TodoFilter = "all" | "active" | "completed";
