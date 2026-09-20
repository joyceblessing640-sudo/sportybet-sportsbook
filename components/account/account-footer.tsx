import Link from "next/link";
import { FileText, Gift, Headphones, Info, RefreshCw, Send } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants";

export function AccountFooter({ gifts = 0, wheel = 0 }: { gifts?: number; wheel?: number }) {
  return (
    <>
      <div className="grid grid-cols-3 divide-x divide-white/10 bg-[#2a2d36] text-center text-[11px] text-white/85">
        <Link href="/bets" className="px-2 py-4">
          <FileText className="mx-auto mb-1 h-5 w-5" />
          Sports Bet
          <br />
          History
        </Link>
        <Link href="/transactions" className="px-2 py-4">
          <RefreshCw className="mx-auto mb-1 h-5 w-5" />
          Transaction
          <br />
          Records
        </Link>
        <Link href="/rewards" className="px-2 py-4">
          <Gift className="mx-auto mb-1 h-5 w-5" />
          Gifts ({gifts})
          <br />
          Lucky Wheel ({wheel})
        </Link>
      </div>
      <div className="bg-white">
        <Link href="/support" className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
          <Headphones className="h-5 w-5 text-[#6b7280]" />
          <span className="flex-1 text-sm font-medium">Customer Service</span>
          <span className="text-xs text-[#9aa3b2]">24/7 Online</span>
          <span className="text-[#c5cad3]">›</span>
        </Link>
        <Link href="/how-to-play" className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
          <Info className="h-5 w-5 text-[#6b7280]" />
          <span className="flex-1 text-sm font-medium">How to play</span>
          <span className="text-[#c5cad3]">›</span>
        </Link>
        <Link href="/update" className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
          <RefreshCw className="h-5 w-5 text-[#6b7280]" />
          <span className="flex-1 text-sm font-medium">Update App</span>
          <span className="text-[#c5cad3]">›</span>
        </Link>
        <div className="flex items-center justify-between px-4 py-3 text-xs text-muted">
          <span className="flex items-center gap-1 font-semibold">
            <FileText className="h-3.5 w-3.5" /> 18+
          </span>
          <span>© {new Date().getFullYear()} SportyBets. All rights reserved.</span>
        </div>
      </div>
      <section className="bg-ink px-4 py-8 text-center text-white">
        <p className="text-lg font-black italic tracking-wide">
          <span className="text-brand">Sporty</span>Bets
        </p>
        <p className="mt-2 text-sm text-white/70">Independent demo sportsbook. Not affiliated with any third-party betting brand.</p>
        <div className="mt-5 flex items-center justify-center gap-3 text-[11px] font-black text-white">
          {["f", "X", "ig", "tg", "yt"].map((id) => (
            <span key={id} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 uppercase">
              {id === "tg" ? <Send className="h-4 w-4" /> : id}
            </span>
          ))}
        </div>
        <p className="mt-5 text-xs text-white/55">Paybill:</p>
        <p className="text-sm font-bold tracking-wide">*711*222#</p>
        <p className="mt-4 text-xs text-white/55">Payment methods</p>
        <div className="mx-auto mt-2 grid max-w-xs grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((method) => (
            <span key={method} className="rounded bg-white/10 py-2 text-[11px] font-bold uppercase tracking-wide text-white/80">
              {method}
            </span>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-white/45">
          Age 18 and above only. Play Responsibly. Betting is addictive and can be psychologically harmful. SportyBets is a
          software demonstration and is not licensed by any gaming commission.
        </p>
      </section>
    </>
  );
}
