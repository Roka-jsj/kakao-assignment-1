import { notFound } from "next/navigation";
import { getTodo } from "../../actions";
import EditTodoForm from "../components/EditTodoForm";

export const dynamic = "force-dynamic";

type EditTodoPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { todoId } = await params;
  const todo = await getTodo(todoId);

  if (!todo) {
    notFound();
  }

  return <EditTodoForm todo={todo} />;
}
