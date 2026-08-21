import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createRegistration,
  getRegistrationByStudentId,
} from "@/lib/db";
import { getBangkokNow } from "@/lib/utils";

const registrationSchema = z.object({
  first_name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  last_name: z.string().min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  student_id: z.string().min(4, "รหัสนักเรียนไม่ถูกต้อง"),
  grade: z.string().min(1, "กรุณาเลือกระดับชั้น"),
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
  activity_id: z.number({ required_error: "กรุณาเลือกกิจกรรม" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      const error = parsed.error.issues[0].message;
      return NextResponse.json({ error }, { status: 400 });
    }

    const { first_name, last_name, student_id, grade, nickname, activity_id } = parsed.data;

    // Check duplicate
    const existing = await getRegistrationByStudentId(student_id);
    if (existing) {
      return NextResponse.json(
        { error: "รหัสนักเรียนนี้ลงทะเบียนแล้ว" },
        { status: 409 }
      );
    }

    const registered_at = getBangkokNow();
    const registration = await createRegistration({
      first_name,
      last_name,
      student_id,
      grade,
      nickname,
      activity_id,
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
