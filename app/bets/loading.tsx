export default function BetsLoading() {
  return (
    <div className="min-h-dvh bg-[#f4f5f7]">
      <div className="flex items-center justify-between bg-[#2a2d36] px-3 py-2.5 text-white">
        <span className="text-[12px]">How to Cashout?</span>
        <span className="text-[12px] font-semibold">Register | Login</span>
      </div>
      <div className="grid grid-cols-2 bg-[#e8eaee] text-[14px] font-semibold">
        <div className="bg-white py-3 text-center">Open Bets</div>
        <div className="py-3 text-center text-muted">Bet History</div>
      </div>
      <div className="bg-white px-6 py-10 text-center text-[14px] text-muted">Loading tickets…</div>
    </div>
  );
}
