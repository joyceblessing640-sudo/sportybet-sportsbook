import Link from "next/link";
import { FileText, Gift, Headphones, Info, RefreshCw } from "lucide-react";

export function AccountFooter({ gifts = 0, wheel = 0 }: { gifts?: number; wheel?: number }) {
  return (
    <>
      <div className="mx-3 mb-3 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-md bg-[#2a2d36] text-center text-[11px] text-white/85">
        <Link href="/bets?tab=history" className="px-2 py-4">
          <FileText className="mx-auto mb-1.5 h-5 w-5" />
          Sports Bet
          <br />
          History
        </Link>
        <Link href="/transactions" className="px-2 py-4">
          <RefreshCw className="mx-auto mb-1.5 h-5 w-5" />
          Transaction
          <br />
          Records
        </Link>
        <Link href="/rewards" className="px-2 py-4">
          <Gift className="mx-auto mb-1.5 h-5 w-5" />
          Gifts ({gifts})
          <br />
          Lucky Wheel ({wheel})
        </Link>
      </div>
      <div className="bg-white text-ink">
        <Link href="/support" className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
          <Headphones className="h-5 w-5 text-[#6b7280]" />
          <span className="flex-1 text-[13px] font-medium">Customer Service</span>
          <span className="text-xs text-[#9aa3b2]">Online 24/7</span>
          <span className="text-[#c5cad3]">›</span>
        </Link>
        <Link href="/how-to-play" className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
          <Info className="h-5 w-5 text-[#6b7280]" />
          <span className="flex-1 text-[13px] font-medium">How to play</span>
          <span className="text-[#c5cad3]">›</span>
        </Link>
        <Link href="/update" className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
          <RefreshCw className="h-5 w-5 text-[#6b7280]" />
          <span className="flex-1 text-[13px] font-medium">Update App</span>
          <span className="text-[#c5cad3]">›</span>
        </Link>
        <div className="flex items-center justify-between bg-[#f4f5f7] px-4 py-3 text-xs text-muted">
          <span className="flex items-center gap-1 font-semibold">
            <FileText className="h-3.5 w-3.5" /> Support
          </span>
          <span>Demo account tools</span>
        </div>
      </div>
    </>
  );
}
