"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Hash,
  GraduationCap,
  Smile,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { GRADE_OPTIONS } from "@/lib/utils";
import { Registration } from "@/lib/db";

const schema = z.object({
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
  grade: z.string().min(1, "กรุณาเลือกระดับชั้น"),
  nickname: z
    .string()
    .min(1, "กรุณากรอกชื่อเล่น")
    .max(50, "ชื่อเล่นยาวเกินไป")
    .trim(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: (registration: Registration) => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }

      onSuccess(json.data);
    } catch {
      setServerError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-white/5 border ${
      hasError ? "border-red-500/70" : "border-white/10"
    } rounded-xl px-4 py-3.5 pl-11 text-white placeholder-white/30 transition-all duration-200 focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1),0_0_15px_rgba(34,211,238,0.1)] text-base`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          ชื่อ <span className="text-cyan-400">*</span>
        </label>
        <div className="relative">
          <User
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70"
          />
          <input
            {...register("first_name")}
            type="text"
            placeholder="กรอกชื่อ"
            className={inputClass(!!errors.first_name)}
            disabled={isLoading}
          />
        </div>
        {errors.first_name && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={13} />
            {errors.first_name.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          นามสกุล <span className="text-cyan-400">*</span>
        </label>
        <div className="relative">
          <User
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70"
          />
          <input
            {...register("last_name")}
            type="text"
            placeholder="กรอกนามสกุล"
            className={inputClass(!!errors.last_name)}
            disabled={isLoading}
          />
        </div>
        {errors.last_name && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={13} />
            {errors.last_name.message}
          </p>
        )}
      </div>

      {/* Student ID */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          รหัสนักเรียน <span className="text-cyan-400">*</span>
        </label>
        <div className="relative">
          <Hash
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70"
          />
          <input
            {...register("student_id")}
            type="text"
            placeholder="รหัสนักเรียน (4-15 ตัวอักษร)"
            className={inputClass(!!errors.student_id)}
            disabled={isLoading}
            autoCapitalize="characters"
          />
        </div>
        {errors.student_id && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={13} />
            {errors.student_id.message}
          </p>
        )}
      </div>

      {/* Grade */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          ระดับชั้น <span className="text-cyan-400">*</span>
        </label>
        <div className="relative">
          <GraduationCap
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70 pointer-events-none"
          />
          <select
            {...register("grade")}
            className={`${inputClass(!!errors.grade)} appearance-none cursor-pointer pr-10`}
            disabled={isLoading}
          >
            <option value="" className="bg-slate-900">
              เลือกระดับชั้น
            </option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g} className="bg-slate-900">
                {g}
              </option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
        </div>
        {errors.grade && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={13} />
            {errors.grade.message}
          </p>
        )}
      </div>

      {/* Nickname */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          ชื่อเล่น <span className="text-cyan-400">*</span>
        </label>
        <div className="relative">
          <Smile
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70"
          />
          <input
            {...register("nickname")}
            type="text"
            placeholder="กรอกชื่อเล่น"
            className={inputClass(!!errors.nickname)}
            disabled={isLoading}
          />
        </div>
        {errors.nickname && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={13} />
            {errors.nickname.message}
          </p>
        )}
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3.5">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300">{serverError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary relative z-10 text-white font-semibold py-4 px-6 rounded-xl text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2.5"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>กำลังลงทะเบียน...</span>
          </>
        ) : (
          <>
            <GraduationCap size={20} />
            <span>ลงทะเบียน</span>
          </>
        )}
      </button>
    </form>
  );
}
