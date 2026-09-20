import { HomeView } from "@/components/home/home-view";
import { getHomePayload } from "@/lib/data";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomePayload();
  return (
    <HomeView
      featured={data.featured.map(serializeMatch)}
      live={data.live.map(serializeMatch)}
      today={data.today.map(serializeMatch)}
      upcoming={data.upcoming.map(serializeMatch)}
      leagues={data.leagues.map((l) => ({ name: l.name, slug: l.slug, country: l.country }))}
      promotions={data.promotions.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        href: p.href,
        theme: p.theme,
      }))}
    />
  );
}
