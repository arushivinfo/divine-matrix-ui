import type { Metadata } from "next";
import { CompatibilityView } from "./compatibility-view";

export const metadata: Metadata = { title: "Compatibility" };

export default function CompatibilityPage() {
  return <CompatibilityView />;
}
