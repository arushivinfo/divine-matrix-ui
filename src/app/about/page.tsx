import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight">About Divine Matrix</h1>
      <p className="mt-6 text-muted">
        Tell visitors about Divine Matrix: the mission, the story, and the team.
      </p>
    </section>
  );
}
