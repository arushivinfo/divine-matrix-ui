/** Shown in place of engine results when the request failed. */
export function EngineNotice({ error, onRetry, compact }: { error: string; onRetry: () => void; compact?: boolean }) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red/30 bg-red-soft text-sm ${compact ? "px-4 py-3" : "p-5"}`}
    >
      <span className="font-medium text-red">{error}</span>
      <button type="button" onClick={onRetry} className="cursor-pointer rounded-full bg-surface px-4 py-2 font-semibold text-fg">
        Try again
      </button>
    </div>
  );
}
