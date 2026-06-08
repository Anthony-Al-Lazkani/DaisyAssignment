import { NextResponse } from 'next/server'
import { getWorkshop, delay } from '@/lib/mock-data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await delay()
  const workshop = getWorkshop(id)
  if (!workshop) {
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
  }
  return NextResponse.json({ data: workshop })
}
