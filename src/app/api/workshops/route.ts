import { NextResponse } from 'next/server'
import { getWorkshops, delay } from '@/lib/db'

export async function GET() {
  await delay()
  const workshops = getWorkshops()
  return NextResponse.json({ data: workshops })
}
