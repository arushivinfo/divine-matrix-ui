import type { Metadata } from "next";
import { ChaptersView } from "./chapters-view";

export const metadata: Metadata = { title: "Life Chapters" };

export default function ChaptersPage() {
  return <ChaptersView />;
}
