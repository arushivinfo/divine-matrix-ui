import type { Metadata } from "next";
import { ScoresView } from "./scores-view";

export const metadata: Metadata = { title: "Life Scores" };

export default function ScoresPage() {
  return <ScoresView />;
}
