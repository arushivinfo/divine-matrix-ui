import Link from "next/link";
import { HeroGrid } from "@/components/hero-grid";
import { Logo } from "@/components/logo";
import { Eyebrow } from "@/components/ui";

const COMPARE = [
  ["Vague predictions", "Measurable scores you can track"],
  ["Long, dense readings", "Glanceable, watch-style dashboards"],
  ["One fixed reading for life", "A live overlay that updates daily"],
  ["Fear-driven warnings", "Clear windows for when to act"],
  ["Heavy jargon", "Plain language, classic term alongside"],
];

const FOUNDATIONS = [
  "Sidereal positions · Lahiri",
  "KP 249 sub-lords",
  "Vimshottari · Yogini · Chara dasha",
  "Panchang & muhurat",
  "Panchadha maitri",
  "Ashtakavarga load index",
  "Sub-arcsecond astronomy engine",
];

const STEPS = [
  ["01", "Add your birth details", "Date, exact time and city. That is all the engine needs — your data stays in your browser."],
  ["02", "We build your matrix", "Precise positions are mapped onto a 4×3 grid of element and mode, scored cell by cell."],
  ["03", "Watch it move", "Slide through time to see live alignments, life scores and the best windows for any day."],
];

const FEATURES = [
  ["Energy Grid", "Your 12-cell map, colour-scored from peak to low, with today overlaid live.", "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"],
  ["Time Slider", "Move a year forward or back, one day at a time, and see alignments as they form.", "M3 12h18M7 8v8M12 5v14M17 9v6"],
  ["Life Chapters", "Long and short life cycles on a timeline, with what is running right now.", "M4 6h16M4 12h10M4 18h6"],
  ["Life Scores", "Wealth, conflict risk, learning and wellbeing — scored and explained in plain words.", "M4 20V10M10 20V4M16 20v-7M22 20H2"],
  ["Daily Windows", "The best and worst hours of the day for work, money, property and travel.", "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"],
  ["Compatibility", "Compare two profiles and see where you flow and where you rub.", "M9 12a4 4 0 100-8 4 4 0 000 8zM15 20a4 4 0 100-8 4 4 0 000 8z"],
  ["Team Synergy", "Combine a whole team and get balance gaps and role suggestions.", "M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 10a4 4 0 100-8 4 4 0 000 8zM21 20v-2a4 4 0 00-3-3.9"],
  ["Journey Planner", "Pick a date and direction — get a travel score, best departure time and the best month.", "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"],
  ["Space Alignment", "See which directions of your home or desk support you most.", "M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"],
];

const PLANS = [
  { name: "Free", price: "₹0", per: "forever", featured: false, items: ["Your Energy Grid", "One profile", "Today’s windows"], cta: "Start free" },
  { name: "Pro", price: "₹[PRICE]", per: "/ month", featured: true, items: ["Time Slider & live alerts", "Life Chapters & Life Scores", "Compatibility & Journey Planner", "Multiple profiles"], cta: "Go Pro" },
  { name: "Enterprise", price: "Custom", per: "", featured: false, items: ["Team Synergy dashboards", "Multi-profile analysis", "API access", "White-label"], cta: "Talk to us" },
];

function Check({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-ink text-paper">
        <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 p-6">
          <Logo />
          <nav aria-label="Main" className="flex flex-wrap items-center gap-7 text-[15px]">
            <a href="#product" className="hidden text-[#C9CED8] hover:text-white sm:inline">Product</a>
            <a href="#how" className="hidden text-[#C9CED8] hover:text-white sm:inline">How it works</a>
            <a href="#pricing" className="hidden text-[#C9CED8] hover:text-white sm:inline">Pricing</a>
            <Link href="/dashboard" className="text-[#C9CED8] hover:text-white">Sign in</Link>
            <Link href="/start" className="rounded-full bg-signal px-5 py-3 font-semibold text-ink">Create your matrix</Link>
          </nav>
        </header>

        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-16 px-6 pt-[72px] pb-24">
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
            <span className="self-start rounded-full border border-ink-line px-3.5 py-1.5 font-mono text-xs tracking-[0.12em] text-signal uppercase">
              Modern cosmic life optimization engine
            </span>
            <h1 className="font-display text-[clamp(44px,6vw,76px)] leading-[1.02] font-extrabold tracking-[-0.035em]">
              Know <span className="text-signal">when</span>,<br />not just what.
            </h1>
            <p className="max-w-[460px] text-[19px] leading-relaxed text-soft">
              Meet your digital cosmic assistant. Know exactly when to act, when to hold, and how to master your day.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/start" className="rounded-full bg-signal px-7 py-4 font-semibold text-ink">Start free</Link>
              <Link href="/dashboard" className="rounded-full border border-ink-line px-7 py-4 font-semibold text-paper">
                See a sample dashboard
              </Link>
            </div>
          </div>
          <HeroGrid />
        </section>

        <div className="border-t border-ink-3">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-10 gap-y-4 px-6 py-7">
            <div className="flex flex-col gap-1">
              <span className="font-display text-[17px] font-bold">Backed by classical Vedic &amp; modern astrology</span>
              <span className="text-[13px] text-muted-2">Powered by the Divine Matrix System™</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-mono text-[13px] text-soft">
              {["Lahiri Ayanamsa", "KP 249", "Panchadha Maitri", "Sub-arcsecond astronomy"].map((t, i, all) => (
                <span key={t} className="flex items-center gap-5">
                  {t}
                  {i < all.length - 1 && <span aria-hidden="true" className="text-signal">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="different" className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[680px] flex-col gap-3">
            <Eyebrow>Astrology, re-engineered</Eyebrow>
            <h2 className="font-display text-[44px] leading-[1.1] font-extrabold tracking-[-0.03em]">
              Not traditional astrology. Not a prediction tool.
            </h2>
          </div>
          <p className="max-w-[400px] leading-relaxed text-muted">
            We keep the depth of classical Vedic systems and drop the vague forecasts. You get data you can glance at, track and act
            on — like a smartwatch for your life.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
          <div className="flex flex-col gap-4.5 rounded-[28px] border border-line bg-white p-8">
            <span className="font-display text-xl font-bold text-muted">Traditional astrology</span>
            {COMPARE.map(([old]) => (
              <div key={old} className="flex items-center gap-3 border-b border-[#F0F2F5] pb-3.5 text-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C94A3" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="shrink-0">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                {old}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4.5 rounded-[28px] bg-ink p-8 text-paper">
            <span className="font-display text-xl font-bold text-signal">Divine Matrix</span>
            {COMPARE.map(([, neu]) => (
              <div key={neu} className="flex items-center gap-3 border-b border-ink-3 pb-3.5">
                <Check color="#32D583" />
                {neu}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <span className="text-sm font-semibold text-muted">Built on classical systems, computed with modern precision</span>
          <div className="flex flex-wrap gap-2.5">
            {FOUNDATIONS.map((f) => (
              <span key={f} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pt-28 pb-12">
        <div className="flex max-w-[640px] flex-col gap-3">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display text-[44px] leading-[1.1] font-extrabold tracking-[-0.03em]">Three inputs. One living map.</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {STEPS.map(([n, title, body]) => (
            <div key={n} className="flex flex-col gap-3.5 rounded-3xl border border-line bg-white p-8">
              <span className="flex size-10 items-center justify-center rounded-xl bg-signal font-mono text-sm font-semibold">{n}</span>
              <h3 className="font-display text-[22px] font-bold">{title}</h3>
              <p className="leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[640px] flex-col gap-3">
            <Eyebrow>Product</Eyebrow>
            <h2 className="font-display text-[44px] leading-[1.1] font-extrabold tracking-[-0.03em]">
              Everything you need to time your next move.
            </h2>
          </div>
          <p className="max-w-[380px] leading-relaxed text-muted">
            Built on a precise positional engine, calculated live in your browser for any date — past or future.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {FEATURES.map(([title, body, icon]) => (
            <div key={title} className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-7">
              <span className="flex size-11 items-center justify-center rounded-xl bg-cobalt-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F45FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={icon} />
                </svg>
              </span>
              <h3 className="font-display text-[19px] font-bold">{title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pt-16 pb-28">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-display text-[44px] leading-[1.1] font-extrabold tracking-[-0.03em]">Start free. Go deeper when you need to.</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col gap-5 rounded-[28px] p-9 ${p.featured ? "bg-ink text-paper" : "border border-line bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[22px] font-bold">{p.name}</h3>
                {p.featured && <span className="rounded-full bg-signal px-3 py-1.5 text-xs font-semibold text-ink">Most popular</span>}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[44px] font-extrabold tracking-[-0.03em]">{p.price}</span>
                <span className="opacity-75">{p.per}</span>
              </div>
              <ul className="flex flex-1 flex-col gap-3 text-[15px]">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5">
                    <Check color={p.featured ? "#32D583" : "#2F45FF"} />
                    {it}
                  </li>
                ))}
              </ul>
              <Link
                href="/start"
                className={`rounded-full px-5 py-3.5 text-center font-semibold ${p.featured ? "bg-signal text-ink" : "bg-ink text-white"}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-6 px-6 pt-10 pb-6 text-sm text-muted">
          <span className="font-display font-extrabold text-ink">Divine Matrix</span>
          <span className="max-w-[560px] leading-relaxed">
            Insights are for guidance and reflection only. Wellbeing scores are not medical advice — please consult a qualified professional.
          </span>
          <span>© Divine Matrix</span>
        </div>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-1.5 border-t border-[#F0F2F5] px-6 pt-5 pb-10 text-center font-mono text-xs leading-relaxed text-muted">
          <span>Powered by Divine Matrix System™ · Live Engine · Astronomy Engine (sub-arcsecond accuracy)</span>
          <span>Lahiri (Chitrapaksha) Ayanamsa · KP 249 · Panchadha Maitri · DMLI Heatmap</span>
        </div>
      </footer>
    </div>
  );
}
