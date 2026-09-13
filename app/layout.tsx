import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientRoot } from "@/components/client-root";
import { getAuthPayload } from "@/lib/session";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPORTBET — Bet Smart. Win Big.",
  description:
    "SPORTBET is a demo sportsbook for football, basketball, tennis and more. 18+ only. Play responsibly.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getAuthPayload();
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f4f5f7] font-sans text-ink">
        <ClientRoot initialUser={user}>{children}</ClientRoot>
      </body>
    </html>
  );
}
