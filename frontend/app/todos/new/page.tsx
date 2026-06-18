import NewTodoForm from "../components/NewTodoForm";

type SearchValue = string | string[] | undefined;

type NewTodoPageProps = {
  searchParams?: Promise<{
    date?: SearchValue;
  }>;
};

function firstParam(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateString(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const params = searchParams ? await searchParams : {};
  const date = firstParam(params.date);
  const initialDate = isDateString(date) ? date : getToday();

  return <NewTodoForm initialDate={initialDate} />;
}
