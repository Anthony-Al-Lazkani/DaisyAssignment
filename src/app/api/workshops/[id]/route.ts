import { NextResponse } from 'next/server'
import { getWorkshop, updateWorkshop, delay } from '@/lib/db'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await delay()
  const workshop = getWorkshop(id)
  if (!workshop) {
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
  }
  return NextResponse.json({ data: workshop })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { title, time, duration, studio, capacity, price } = body

  await delay()

  const success = updateWorkshop(id, { title, time, duration, studio, capacity, price })

  if (!success) {
    return NextResponse.json({ error: 'Workshop not found or no changes' }, { status: 404 })
  }

  const workshop = getWorkshop(id)
  return NextResponse.json({ data: workshop })
}
