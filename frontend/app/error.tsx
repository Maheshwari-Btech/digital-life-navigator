'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
