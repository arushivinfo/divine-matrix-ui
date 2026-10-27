import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { ProfileProvider } from "@/lib/profile-context";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["600", "700", "800"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: {
    default: "Divine Matrix — Modern cosmic life optimization engine",
    template: "%s · Divine Matrix",
  },
  description:
    "Meet your digital cosmic assistant. Know exactly when to act, when to hold, and how to master your day. Backed by classical Vedic & modern astrology.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
