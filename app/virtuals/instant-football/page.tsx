import type { Metadata } from "next";
import { InstantFootballView } from "@/components/virtuals/instant-football-view";

export const metadata: Metadata = {
  title: "Instant Football — Virtual matches",
  description: "Virtual Instant Football fixtures, 1X2 odds, and simulated results. These are not live football matches.",
};

export default function InstantFootballPage() {
  return <InstantFootballView />;
}
