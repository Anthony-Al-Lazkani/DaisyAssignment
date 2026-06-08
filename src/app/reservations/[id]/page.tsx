import { ReservationDetail } from "@/components/reservations/reservation-detail"

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReservationDetail id={id} />
}
