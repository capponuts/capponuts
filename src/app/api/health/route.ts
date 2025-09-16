import { NextResponse } from 'next/server'
import { db } from '@/db/client'

export async function GET() {
  try {
    await db.execute("select 1 as ok")
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}


