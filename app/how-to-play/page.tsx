export default function HowToPlayPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-black">How to Play</h1>
      <article className="rounded-xl bg-white p-4 text-sm leading-relaxed text-[#374151]">
        <p>SPORTBET is a demo sportsbook. Tap an odd to add it to the bet slip, enter a stake, then place the bet. Your wallet is debited only after the server accepts the ticket.</p>
        <p className="mt-3">Cashout is not enabled in this build. Settled tickets appear under My Bets when an administrator or settlement job updates the result.</p>
        <p className="mt-3 font-semibold">Responsible play</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>You must be 18 or older.</li>
          <li>Never stake money you cannot afford to lose.</li>
          <li>There are no guaranteed wins, sure predictions, or locked profits.</li>
          <li>If betting stops being fun, take a break and seek help locally.</li>
        </ul>
      </article>
    </div>
  );
}
