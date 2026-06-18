import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

type RouteContext = {
  params: Promise<{ todoId: string }>;
};

async function toNextResponse(res: Response) {
  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const text = await res.text();
  if (!text) {
    return new NextResponse(null, { status: res.status });
  }

  try {
    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch {
    return new NextResponse(text, { status: res.status });
  }
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { todoId } = await context.params;
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    cache: "no-store",
  });

  return toNextResponse(res);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { todoId } = await context.params;
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return toNextResponse(res);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { todoId } = await context.params;
  const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  return toNextResponse(res);
}
