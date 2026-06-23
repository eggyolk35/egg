import { NextRequest, NextResponse } from "next/server";
import { insertReading, listReadings } from "@/lib/db";
import type { SaveReadingInput } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveReadingInput;
    const id = insertReading(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/readings]", err);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = listReadings(50);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("[GET /api/readings]", err);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }
}
