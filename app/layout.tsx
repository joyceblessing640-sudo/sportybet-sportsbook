import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClientRoot } from "@/components/client-root";
import { getAuthPayload } from "@/lib/session";
import { readSlipItems } from "@/lib/slip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SportyBets — Bet Smart. Win Big.",
  description:
    "SportyBets is a demo sportsbook for football, basketball, tennis and more. 18+ only. Play responsibly.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, slipItems] = await Promise.all([getAuthPayload(), readSlipItems()]);
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-background font-sans text-ink">
        <ClientRoot initialUser={user} slipItems={slipItems}>
          {children}
        </ClientRoot>
      </body>
    </html>
  );
}
