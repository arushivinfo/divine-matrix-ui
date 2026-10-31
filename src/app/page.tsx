import Link from "next/link";
import type { ReactNode } from "react";
import { HeroGrid } from "@/components/hero-grid";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Ring, cx } from "@/components/ui";

const SYSTEMS = [
  "Lahiri Ayanamsa",
  "KP 249 sub-lords",
  "Vimshottari dasha",
  "Yogini dasha",
  "Chara dasha",
  "Ashtakavarga load index",
  "Panchang",
  "Choghadiya",
  "Panchadha maitri",
  "Sub-arcsecond astronomy",
];

const COMPARE = [
  ["Vague predictions", "Measurable scores you can track"],
  ["Long, dense readings", "Glanceable, watch-style dashboards"],
  ["One fixed reading for life", "A live overlay that updates daily"],
  ["Fear-driven warnings", "Clear windows for when to act"],
  ["Heavy jargon", "Plain language, classic term alongside"],
];

const STEPS = [
  ["01", "Add your birth details", "Date, exact time and city. Your data stays in your browser."],
  ["02", "We build your matrix", "Precise positions are mapped onto a 4×3 grid of element and mode."],
  ["03", "Watch it move", "Slide through time for live alignments, scores and the best windows."],
];

const PLANS = [
  { name: "Free", price: "₹0", per: "forever", featured: false, items: ["Your Energy Grid", "One profile", "Today’s windows"], cta: "Start free" },
  { name: "Pro", price: "₹[PRICE]", per: "/ month", featured: true, items: ["Time Slider & live alerts", "Life Chapters & Life Scores", "Compatibility & Journey Planner", "Multiple profiles"], cta: "Go Pro" },
  { name: "Enterprise", price: "Custom", per: "", featured: false, items: ["Team Synergy dashboards", "Multi-profile analysis", "API access", "White-label"], cta: "Talk to us" },
];

const GREEN = "#32D583";
const MINT = "var(--heat-high)";
const SLATE = "var(--heat-base)";
const RED = "#B42318";
const SKY = "#7CD4FD";
const COBALT = "#2F45FF";

function Check({ color = GREEN }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function SectionHead({ kicker, title, sub, center }: { kicker: string; title: ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={cx("flex max-w-[720px] flex-col gap-4", center && "mx-auto items-center text-center")}>
      <span className="font-mono text-xs tracking-[0.14em] text-accent-text uppercase">{kicker}</span>
      <h2 className="font-display text-[clamp(34px,4.6vw,56px)] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance">{title}</h2>
      {sub && <p className="max-w-[560px] text-[17px] leading-relaxed text-fg-soft">{sub}</p>}
    </div>
  );
}

function Bento({ className, title, body, children }: { className?: string; title: string; body: string; children: ReactNode }) {
  return (
    <div
      className={cx(
        "glass flex min-h-[260px] flex-col justify-between gap-6 overflow-hidden rounded-[28px] p-7 transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="flex flex-1 items-center justify-center" aria-hidden="true">
        {children}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-xl font-bold text-fg">{title}</h3>
        <p className="text-[15px] leading-relaxed text-fg-soft">{body}</p>
      </div>
    </div>
  );
}

function Orb({ className, color, delay = "0s" }: { className: string; color: string; delay?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute -z-10 rounded-full blur-[110px]", className)}
      style={{ background: color, animation: `dm-drift 18s ease-in-out ${delay} infinite` }}
    />
  );
}

function Complication({ value, color, title, note, className, delay }: { value: number; color: string; title: string; note: string; className: string; delay: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("glass-strong absolute z-10 hidden items-center gap-3 rounded-2xl p-3 pr-5 lg:flex", className)}
      style={{ animation: `dm-float 6s ease-in-out ${delay} infinite` }}
    >
      <Ring track="var(--ring-track)" value={value} size={44} stroke={5} color={color} label="">
        <span className="font-mono text-xs font-semibold">{value}</span>
      </Ring>
      <span className="text-left text-sm leading-tight">
        {title}
        <br />
        <span className="text-fg-muted">{note}</span>
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-bg text-fg">
      {/* Floating glass nav */}
      <div className="sticky top-0 z-30 px-4 pt-4">
        <header className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 glass-strong rounded-full py-2.5 pr-2.5 pl-5">
          <Logo size={24} className="text-fg" />
          <nav aria-label="Main" className="flex items-center gap-1 text-[15px]">
            {[
              ["#product", "Product"],
              ["#how", "How it works"],
              ["#pricing", "Pricing"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="hidden rounded-full px-4 py-2 text-fg-soft transition-colors hover:text-fg md:inline">
                {label}
              </a>
            ))}
            <Link href="/dashboard" className="hidden rounded-full px-4 py-2 text-fg-soft transition-colors hover:text-fg sm:inline">
              Sign in
            </Link>
            <ThemeToggle className="mr-1" />
            <Link href="/start" className="rounded-full bg-fg px-5 py-2.5 font-semibold text-bg transition-opacity hover:opacity-90">
              Get started
            </Link>
          </nav>
        </header>
      </div>

      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--dots)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)] bg-[size:28px_28px]"
        />
        <Orb className="top-[38%] left-[8%] size-[380px] opacity-30" color="#32D583" />
        <Orb className="top-[48%] right-[6%] size-[340px] opacity-25" color="#2F45FF" delay="-6s" />
        <Orb className="top-[72%] left-[38%] size-[300px] opacity-20" color="#7CD4FD" delay="-12s" />

        <div className="relative mx-auto flex max-w-[1160px] flex-col items-center gap-8 px-6 pt-20 text-center sm:pt-28">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-full border border-edge bg-tint py-1.5 pr-3 pl-1.5 text-xs whitespace-nowrap text-fg-soft sm:text-sm transition-colors hover:border-fg/20"
          >
            <span className="rounded-full bg-signal px-2.5 py-0.5 text-xs font-semibold text-ink">Live</span>
            Modern cosmic life optimization engine
            <span aria-hidden="true">→</span>
          </Link>
          <h1 className="max-w-[920px] font-display text-[clamp(48px,8.4vw,104px)] leading-[0.95] font-extrabold tracking-[-0.045em] text-balance">
            Know <span className="text-accent-text">when</span>, not just what.
          </h1>
          <p className="max-w-[520px] text-lg leading-relaxed text-fg-soft sm:text-xl">
            Meet your digital cosmic assistant. Know exactly when to act, when to hold, and how to master your day.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/start" className="rounded-full bg-signal px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5">
              Create your matrix — free
            </Link>
            <Link href="/dashboard" className="glass-soft rounded-full px-7 py-4 font-semibold text-fg transition-colors hover:bg-tint">
              See a live demo
            </Link>
          </div>
          <span className="text-sm text-fg-muted">Backed by classical Vedic &amp; modern astrology · Powered by the Divine Matrix System™</span>
        </div>

        {/* Product window */}
        <div className="relative mx-auto mt-16 max-w-[980px] px-6 pb-24">
          <div className="glass relative rounded-[28px] p-2">
            <div className="flex items-center gap-2 px-4 py-3" aria-hidden="true">
              <span className="size-3 rounded-full bg-tint" />
              <span className="size-3 rounded-full bg-tint" />
              <span className="size-3 rounded-full bg-tint" />
              <span className="mx-auto rounded-full bg-tint px-4 py-1 font-mono text-xs text-fg-muted">divinematrix.app/dashboard</span>
            </div>
            <div className="grid gap-2 rounded-[22px] bg-[var(--window)] p-3 sm:p-5 md:grid-cols-[1.5fr_1fr]">
              <div className="glass-soft rounded-2xl p-5">
                <HeroGrid />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 glass-soft rounded-2xl p-5">
                  <Ring track="var(--ring-track)" value={72} size={72} stroke={8} color={GREEN} label="Overall score 72 of 100">
                    <span className="font-mono text-lg font-semibold">72</span>
                  </Ring>
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-sm text-fg-soft">Overall today</span>
                    <span className="font-display text-xl font-bold">Favourable</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 glass-soft rounded-2xl p-5 text-left">
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-accent-text uppercase">
                    <span className="size-1.5 rounded-full bg-signal" style={{ animation: "dm-pulse 1.8s ease-out infinite" }} />
                    Live alert · Exact
                  </span>
                  <span className="font-display text-lg font-bold">Relationships &amp; lifestyle</span>
                  <span className="text-sm leading-relaxed text-fg-soft">Live Mercury meets your birth Venus. Network actively this week.</span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 glass-soft rounded-2xl p-5 text-left">
                  <span className="text-sm text-fg-soft">Golden window · Abhijit</span>
                  <span className="font-mono text-2xl font-semibold text-accent-text">11:46 – 12:34</span>
                </div>
              </div>
            </div>
          </div>
          <Complication value={86} color={SKY} title="Focus" note="Peak 06–08" className="-top-6 -left-10" delay="0s" />
          <Complication value={61} color="#FFB547" title="Harmony" note="Watch Thursday" className="-right-10 bottom-14" delay="1.2s" />
        </div>
      </section>

      {/* Systems ticker */}
      <section aria-label="Built on classical systems" className="border-y border-edge py-6">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex shrink-0" style={{ animation: "dm-marquee 40s linear infinite" }}>
            {[...SYSTEMS, ...SYSTEMS].map((s, i) => (
              <span key={i} aria-hidden={i >= SYSTEMS.length} className="flex shrink-0 items-center gap-10 pr-10 font-mono text-sm whitespace-nowrap text-fg-muted">
                {s}
                <span aria-hidden="true" className="text-accent-text">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Astrology, re-engineered */}
      <section id="different" className="relative mx-auto flex max-w-[1160px] flex-col gap-14 px-6 py-28">
        <Orb className="top-1/2 -right-40 size-[360px] opacity-20" color="#32D583" />
        <SectionHead
          kicker="Astrology, re-engineered"
          title={
            <>
              Not traditional astrology.
              <br className="hidden sm:block" /> Not a prediction tool.
            </>
          }
          sub="We keep the depth of classical Vedic systems and drop the vague forecasts. Data you can glance at, track and act on — like a smartwatch for your life."
        />
        <div className="glass overflow-hidden rounded-[28px]">
          <div className="grid grid-cols-2 border-b border-edge bg-tint font-mono text-xs tracking-[0.1em] uppercase">
            <span className="px-5 py-4 text-fg-muted sm:px-6">Traditional</span>
            <span className="border-l border-edge px-5 py-4 text-accent-text sm:px-6">Divine Matrix</span>
          </div>
          {COMPARE.map(([old, neu]) => (
            <div key={old} className="grid grid-cols-2 border-b border-edge last:border-b-0">
              <span className="flex items-center px-5 py-5 text-fg-muted line-through decoration-fg/25 sm:px-6">{old}</span>
              <span className="flex items-center gap-3 border-l border-edge px-5 py-5 font-medium sm:px-6">
                <Check />
                {neu}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bento features */}
      <section id="product" className="relative mx-auto flex max-w-[1160px] flex-col gap-14 px-6 pb-28">
        <Orb className="top-1/3 -left-32 size-[420px] opacity-25" color="#2F45FF" />
        <Orb className="bottom-0 right-0 size-[380px] opacity-20" color="#32D583" delay="-8s" />
        <SectionHead kicker="Product" title="Everything you need to time your next move." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <Bento className="md:col-span-4" title="Energy Grid" body="Your 12-zone map scored by load index, with today’s positions overlaid live.">
            <div className="grid w-full max-w-[420px] grid-cols-4 gap-2">
              {[GREEN, MINT, SLATE, MINT, SLATE, RED, GREEN, SLATE, MINT, SLATE, GREEN, RED].map((c, i) => (
                <span key={i} className="h-12 rounded-lg" style={{ background: c }} />
              ))}
            </div>
          </Bento>
          <Bento className="md:col-span-2" title="Life Scores" body="Wealth, harmony, learning and wellbeing at a glance.">
            <div className="flex gap-3">
              {(
                [
                  [76, GREEN],
                  [61, "#FFB547"],
                  [84, SKY],
                ] as const
              ).map(([v, c]) => (
                <Ring track="var(--ring-track)" key={v} value={v} size={64} stroke={7} color={c} label="">
                  <span className="font-mono text-sm font-semibold">{v}</span>
                </Ring>
              ))}
            </div>
          </Bento>
          <Bento className="md:col-span-2" title="Time Slider" body="Move a year either way and watch alignments form.">
            <div className="flex w-full flex-col gap-3">
              <div className="relative h-1.5 rounded-full bg-tint">
                <div className="absolute inset-y-0 left-0 w-3/5 rounded-full bg-signal" />
                <span className="absolute top-1/2 left-3/5 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink-2 bg-signal" />
              </div>
              <div className="flex justify-between font-mono text-xs text-fg-muted">
                <span>−365d</span>
                <span className="text-accent-text">+42 days</span>
                <span>+365d</span>
              </div>
            </div>
          </Bento>
          <Bento className="md:col-span-2" title="Daily Windows" body="Golden and caution windows, hour by hour.">
            <div className="flex w-full gap-1">
              {[RED, RED, SLATE, MINT, GREEN, RED, MINT, RED, MINT, MINT, GREEN, SLATE].map((c, i) => (
                <span key={i} className="h-14 flex-1 rounded-md" style={{ background: c }} />
              ))}
            </div>
          </Bento>
          <Bento className="md:col-span-2" title="Life Chapters" body="Vimshottari, Yogini and Chara cycles on one timeline.">
            <div className="flex w-full gap-1 font-mono text-[11px] font-semibold">
              {(
                [
                  ["Su", 6, SLATE],
                  ["Mo", 10, SLATE],
                  ["Ma", 7, SLATE],
                  ["Ra", 18, GREEN],
                  ["Ju", 16, COBALT],
                  ["Sa", 19, COBALT],
                ] as const
              ).map(([c, w, bg]) => (
                <span
                  key={c}
                  className={cx("flex h-12 min-w-0 items-center justify-center rounded-md", bg === GREEN ? "text-ink" : bg === COBALT ? "text-white" : "text-fg-soft")}
                  style={{ flex: `${w} 1 0`, background: bg }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Bento>
          <Bento className="md:col-span-3" title="Compatibility & teams" body="See where two people flow — or a whole team’s balance.">
            <div className="flex items-center">
              <span className="size-24 rounded-full border-2 border-signal bg-signal/10" />
              <span className="-ml-8 size-24 rounded-full border-2 border-[#7CD4FD] bg-[#7CD4FD]/10" />
              <span className="ml-5 font-display text-4xl font-extrabold">81%</span>
            </div>
          </Bento>
          <Bento className="md:col-span-3" title="Journey Planner" body="Blocked directions, best departure time and the best months to travel.">
            <div className="grid grid-cols-3 gap-1.5 font-mono text-sm font-semibold">
              {["", "N", "", "W", "●", "E", "", "S", ""].map((d, i) => (
                <span
                  key={i}
                  className={cx(
                    "flex size-12 items-center justify-center rounded-xl",
                    d === "E" ? "bg-signal text-ink" : d === "N" ? "bg-[#B42318] text-white" : d ? "bg-tint text-fg-soft" : "",
                  )}
                >
                  {d}
                </span>
              ))}
            </div>
          </Bento>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto flex max-w-[1160px] flex-col gap-14 px-6 pb-28">
        <SectionHead kicker="How it works" title="Three inputs. One living map." />
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map(([n, title, body]) => (
            <li key={n} className="flex flex-col gap-4 border-t border-edge pt-6">
              <span className="font-mono text-sm text-accent-text">{n}</span>
              <h3 className="font-display text-2xl font-bold">{title}</h3>
              <p className="leading-relaxed text-fg-soft">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mx-auto flex max-w-[1160px] flex-col gap-14 px-6 pb-28">
        <Orb className="top-1/3 left-[calc(50%-210px)] size-[420px] opacity-25" color="#32D583" />
        <SectionHead center kicker="Pricing" title="Start free. Go deeper when you need to." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={cx("relative flex flex-col gap-6 rounded-[28px] p-8", p.featured ? "glass-strong !border-signal/50 shadow-[0_0_60px_-12px_rgba(50,213,131,0.45)]" : "glass")}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                {p.featured && <span className="rounded-full bg-signal px-3 py-1 text-xs font-semibold text-ink">Most popular</span>}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-extrabold tracking-[-0.03em]">{p.price}</span>
                <span className="text-fg-muted">{p.per}</span>
              </div>
              <ul className="flex flex-1 flex-col gap-3 text-[15px]">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5">
                    <Check />
                    {it}
                  </li>
                ))}
              </ul>
              <Link
                href="/start"
                className={cx(
                  "rounded-full px-5 py-3.5 text-center font-semibold transition-colors",
                  p.featured ? "bg-signal text-ink hover:brightness-110" : "border border-edge hover:bg-tint",
                )}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto flex max-w-[1160px] flex-col items-center gap-7 overflow-hidden rounded-[36px] bg-signal px-6 py-20 text-center text-ink">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(13,17,23,0.12)_1px,transparent_1px)] bg-[size:22px_22px]" />
          <h2 className="relative max-w-[720px] font-display text-[clamp(36px,5.4vw,64px)] leading-none font-extrabold tracking-[-0.04em] text-balance">
            Your timing, finally visible.
          </h2>
          <p className="relative max-w-[460px] text-lg text-ink/75">Build your matrix in under a minute. Free, private, and calculated in your browser.</p>
          <Link href="/start" className="relative rounded-full bg-ink px-8 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5">
            Create your matrix
          </Link>
        </div>
      </section>

      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-start justify-between gap-6 px-6 pt-10 pb-6 text-sm text-fg-muted">
          <Logo size={22} className="text-fg" />
          <span className="max-w-[520px] leading-relaxed">
            Insights are for guidance and reflection only. Wellbeing scores are not medical advice — please consult a qualified professional.
          </span>
          <span>© Divine Matrix</span>
        </div>
        <div className="mx-auto flex max-w-[1160px] flex-col gap-1.5 px-6 pb-10 text-center font-mono text-xs leading-relaxed text-fg-muted">
          <span>Powered by Divine Matrix System™ · Live Engine · Astronomy Engine (sub-arcsecond accuracy)</span>
          <span>Lahiri (Chitrapaksha) Ayanamsa · KP 249 · Panchadha Maitri · DMLI Heatmap</span>
        </div>
      </footer>
    </div>
  );
}
