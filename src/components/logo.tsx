import Link from "next/link";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 22) / 28} viewBox="0 0 28 22" aria-hidden="true">
      <g fill="#3A4150">
        {[
          [0, 0], [7.6, 0], [15.2, 0], [0, 8.5], [15.2, 8.5], [22.8, 8.5], [0, 17], [7.6, 17], [22.8, 17],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1.5" />
        ))}
      </g>
      <rect x="22.8" y="0" width="5" height="5" rx="1.5" fill="#32D583" />
      <rect x="7.6" y="8.5" width="5" height="5" rx="1.5" fill="#2F45FF" />
      <rect x="15.2" y="17" width="5" height="5" rx="1.5" fill="#32D583" />
    </svg>
  );
}

export function Logo({ href = "/", size = 28 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-paper no-underline">
      <LogoMark size={size} />
      <span className="font-display text-[19px] font-extrabold tracking-tight">Divine Matrix</span>
    </Link>
  );
}
