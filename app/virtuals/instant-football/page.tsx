import type { Metadata } from "next";
import { InstantFootballView } from "@/components/virtuals/instant-football-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instant Football — Virtual matches",
  description: "Virtual Instant Football fixtures, 1X2 odds, and simulated results. These are not live football matches.",
};

export default function InstantFootballPage() {
  return (
    <>
      <link rel="preload" as="image" href="/virtuals/if-states/1-single.jpg?v=5" />
      <link rel="preload" as="image" href="/virtuals/if-states/2-multi.jpg?v=5" />
      <link rel="preload" as="image" href="/virtuals/if-states/3-sheet.jpg?v=5" />
      <link rel="preload" as="image" href="/virtuals/if-states/4-confirm.jpg?v=5" />
      <link rel="preload" as="image" href="/virtuals/if-states/5-submitting.jpg?v=5" />
      <InstantFootballView />
    </>
  );
}
