'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[60dvh] flex flex-col items-center justify-center gap-6 px-4 text-center" role="alert">
      <h2>Something went wrong</h2>
      <p className="text-muted-foreground max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Try again
      </button>
    </section>
  );
}
