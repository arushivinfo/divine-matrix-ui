import Link from "next/link";

const features = [
  {
    title: "Feature one",
    description: "Describe a core feature of Divine Matrix here.",
  },
  {
    title: "Feature two",
    description: "Describe another core feature of Divine Matrix here.",
  },
  {
    title: "Feature three",
    description: "Describe a third core feature of Divine Matrix here.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to <span className="text-accent">Divine Matrix</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          A short tagline that explains what Divine Matrix does and who it is
          for.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/about"
            className="rounded-full bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-accent-soft"
          >
            Learn more
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-muted">{feature.description}</p>
          </div>
        ))}
      </section>
    </>
  );
}
