import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getStats } from "@/lib/db";

export async function GET() {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getStats();
  return NextResponse.json(stats);
}
