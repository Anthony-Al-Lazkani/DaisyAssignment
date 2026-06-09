import { NextResponse } from 'next/server'
import { getWorkshopsByFilter, delay } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const filter = (searchParams.get("filter") as "today" | "upcoming" | "cancelled") || "today"

  await delay()
  const workshops = getWorkshopsByFilter(filter)
  return NextResponse.json({ data: workshops })
}
