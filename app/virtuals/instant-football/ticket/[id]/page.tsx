import { InstantFootballTicket } from "@/components/virtuals/instant-football-ticket";

export default async function InstantFootballTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InstantFootballTicket ticketId={id} />;
}
