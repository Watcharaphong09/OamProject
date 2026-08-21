import { NextResponse } from "next/server";
import { getActivities } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activities = await getActivities();
    // Return only active activities
    const activeActivities = activities.filter(a => a.is_active);
    return NextResponse.json(activeActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
