"use client";

export default function TodosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-red-600">Todo를 불러오지 못했습니다.</p>
        <p className="text-sm text-slate-500">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mx-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
