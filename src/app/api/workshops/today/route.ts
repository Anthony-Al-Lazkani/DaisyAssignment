import { NextResponse } from 'next/server'
import { getTodayWorkshops, delay } from '@/lib/mock-data'

export async function GET() {
  await delay()
  const workshops = getTodayWorkshops()
  return NextResponse.json({ data: workshops })
}
