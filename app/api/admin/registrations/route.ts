import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getRegistrations, getDistinctGrades } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const grade = searchParams.get("grade") || "";
  const activityId = searchParams.get("activityId") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const sortBy = searchParams.get("sortBy") || "registered_at";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "50", 10)));

  const result = await getRegistrations({ search, grade, activityId, dateFrom, dateTo, sortBy, sortOrder, page, pageSize });
  const grades = await getDistinctGrades();

  return NextResponse.json({
    data: result.data,
    total: result.total,
    page,
    pageSize,
    totalPages: Math.ceil(result.total / pageSize),
    grades,
  });
}
