import { NextResponse } from 'next/server'
import { delay } from '@/lib/mock-data'

export async function POST(_: Request) {
  const body = await _.json()
  await delay()
  const newSlot = {
    id: `w${Date.now()}`,
    ...body,
    fillRate: 0,
    participants: [],
  }
  return NextResponse.json({ data: newSlot }, { status: 201 })
}
