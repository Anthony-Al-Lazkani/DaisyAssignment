import { NextResponse } from 'next/server'
import { createWorkshop, delay } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  await delay(600)
  const result = createWorkshop(body)
  return NextResponse.json({ data: result }, { status: 201 })
}
