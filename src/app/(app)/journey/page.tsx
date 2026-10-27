import type { Metadata } from "next";
import { JourneyView } from "./journey-view";

export const metadata: Metadata = { title: "Journey Planner" };

export default function JourneyPage() {
  return <JourneyView />;
}
