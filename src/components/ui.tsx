import type { ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <section
      className={cx(
        "flex flex-col gap-4 rounded-3xl p-6",
        dark ? "bg-contrast text-paper" : "border border-line bg-surface",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small pill naming the classical system behind a modern label. */
export function ClassicTag({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={cx(
        "rounded-full px-2.5 py-1 font-mono text-xs font-semibold tracking-wide",
        dark ? "bg-ink-3 text-signal" : "bg-cobalt-soft text-link",
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("font-mono text-xs uppercase tracking-[0.12em]", className ?? "text-link")}>{children}</span>;
}

export function PageHeader({ kicker, title, tag, actions }: { kicker: ReactNode; title: string; tag?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted">{kicker}</span>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[32px] font-extrabold tracking-tight">{title}</h1>
          {tag && <ClassicTag>{tag}</ClassicTag>}
        </div>
      </div>
      {actions}
    </div>
  );
}

export function CardTitle({ title, sub, tag, right }: { title: string; sub?: string; tag?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {tag && <ClassicTag>{tag}</ClassicTag>}
        </div>
        {sub && <span className="text-sm text-muted">{sub}</span>}
      </div>
      {right}
    </div>
  );
}

export function Ring({
  value,
  size = 64,
  stroke = 7,
  color = "#32D583",
  track = "#262C38",
  label,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2 - 1;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} style={{ stroke: track }} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * Math.max(0, Math.min(100, value))) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ stroke: color, transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">{children}</span>
    </div>
  );
}

export function Bar({ value, color, track = "bg-subtle" }: { value: number; color: string; track?: string }) {
  return (
    <div className={cx("h-2.5 overflow-hidden rounded-full", track)}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

const TONES = {
  good: "bg-green-soft text-green",
  info: "bg-cobalt-soft text-link",
  warn: "bg-amber-soft text-amber",
  bad: "bg-red-soft text-red",
  neutral: "bg-subtle text-muted",
  signal: "bg-signal text-ink",
} as const;
export type Tone = keyof typeof TONES;

export function Badge({ tone, children, mono }: { tone: Tone; children: ReactNode; mono?: boolean }) {
  return (
    <span className={cx("rounded-full px-2.5 py-1 text-xs font-semibold", mono && "font-mono tracking-wider", TONES[tone])}>
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-3xl bg-subtle", className)} />;
}

/** Segmented control used for view and mode switches. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  dark,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className={cx("flex flex-wrap rounded-full p-1", dark ? "bg-ink-3" : "bg-subtle")}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cx(
              "min-h-10 flex-1 cursor-pointer rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
              active
                ? dark
                  ? "bg-signal text-ink"
                  : "bg-fg text-bg"
                : dark
                  ? "text-soft hover:text-white"
                  : "text-muted hover:text-fg",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
