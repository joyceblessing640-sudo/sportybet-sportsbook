import { BetSlipPanel } from "@/components/betting/bet-slip";
import { readSlipItems } from "@/lib/slip";

export const dynamic = "force-dynamic";

export default async function SlipPage() {
  const items = await readSlipItems();
  return (
    <div className="mx-auto h-[calc(100dvh-8rem)] max-w-lg bg-white">
      <BetSlipPanel items={items} />
    </div>
  );
}
