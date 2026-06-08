import { WorkshopCheckIn } from "@/components/check-in/workshop-check-in"

export default async function CheckInDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <WorkshopCheckIn id={id} />
}
