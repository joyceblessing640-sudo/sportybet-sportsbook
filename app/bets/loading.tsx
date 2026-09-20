export default function BetsLoading() {
  return (
    <div className="min-h-dvh bg-[#f4f5f7]">
      <div className="flex items-center justify-between bg-[#2a2d36] px-2.5 py-2 text-white">
        <span className="text-[12px]">How to Cashout?</span>
        <span className="text-[12px] font-semibold">Register | Login</span>
      </div>
      <div className="grid grid-cols-2 bg-[#e8eaee] text-[13px] font-semibold">
        <div className="bg-white py-2 text-center">Open Bets</div>
        <div className="py-2 text-center text-muted">Bet History</div>
      </div>
      <div className="bg-white px-5 py-8 text-center text-[13px] text-muted">Loading tickets…</div>
    </div>
  );
}
