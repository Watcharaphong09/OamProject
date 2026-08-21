import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getChartData } from "@/lib/db";

export async function GET() {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = getChartData();
  return NextResponse.json(data);
}
