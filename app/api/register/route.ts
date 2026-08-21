import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createRegistration,
  getRegistrationByStudentId,
} from "@/lib/db";
import { getBangkokNow } from "@/lib/utils";

const registrationSchema = z.object({
  first_name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(100, "ชื่อยาวเกินไป")
    .trim(),
  last_name: z
    .string()
    .min(1, "กรุณากรอกนามสกุล")
    .max(100, "นามสกุลยาวเกินไป")
    .trim(),
  student_id: z
    .string()
    .min(1, "กรุณากรอกรหัสนักเรียน")
    .regex(
      /^[A-Za-z0-9]{4,15}$/,
      "รหัสนักเรียนต้องเป็นตัวอักษรหรือตัวเลข 4-15 ตัวอักษร"
    )
    .trim(),
  grade: z.string().min(1, "กรุณาเลือกระดับชั้น").trim(),
  nickname: z
    .string()
    .min(1, "กรุณากรอกชื่อเล่น")
    .max(50, "ชื่อเล่นยาวเกินไป")
    .trim(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "ข้อมูลไม่ถูกต้อง",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { first_name, last_name, student_id, grade, nickname } = parsed.data;

    // Check duplicate
    const existing = getRegistrationByStudentId(student_id);
    if (existing) {
      return NextResponse.json(
        { error: "รหัสนักเรียนนี้ลงทะเบียนแล้ว" },
        { status: 409 }
      );
    }

    const registered_at = getBangkokNow();
    const registration = createRegistration({
      first_name,
      last_name,
      student_id,
      grade,
      nickname,
      registered_at,
    });

    return NextResponse.json({ success: true, data: registration }, { status: 201 });
  } catch (error) {
    console.error("[API] Register error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
