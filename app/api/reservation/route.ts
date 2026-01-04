import { NextRequest, NextResponse } from "next/server"
import { createWordPressReservation } from "@/lib/wordpress-api"

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const result = await createWordPressReservation(payload)
  return NextResponse.json(result)
}