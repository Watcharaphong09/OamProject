import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getAdminByUsername } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1, "กรุณากรอก Username").trim(),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const admin = getAdminByUsername(username);

    if (!admin) {
      return NextResponse.json(
        { error: "Username หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Username หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const token = await signToken({ userId: admin.id, username: admin.username });
    await setAuthCookie(token);

    return NextResponse.json(
      { success: true, username: admin.username },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Login error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}
