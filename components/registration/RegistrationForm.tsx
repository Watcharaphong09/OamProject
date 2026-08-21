"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { User, GraduationCap, IdCard, Tag, ArrowRight, Loader2, CalendarDays } from "lucide-react";
import { GRADE_OPTIONS } from "@/lib/utils";

const formSchema = z.object({
  first_name: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  last_name: z.string().min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  student_id: z.string().min(4, "รหัสนักเรียนไม่ถูกต้อง"),
  grade: z.string().min(1, "กรุณาเลือกระดับชั้น"),
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
  activity_id: z.number({ required_error: "กรุณาเลือกกิจกรรม" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSuccess: (data: FormValues & { activity_name?: string }) => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }

      const selectedActivityName = activities.find(a => a.id === data.activity_id)?.name;
      onSuccess({ ...data, activity_name: selectedActivityName });
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all input-focus";

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden animate-fade-in-up border border-white/10 shadow-2xl">
      {/* Decorative blobs */}
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2 text-glow-cyan">
          ลงทะเบียนเข้าร่วมกิจกรรม
        </h2>
        <p className="text-slate-400 text-sm">
          กรุณากรอกข้อมูลให้ครบถ้วนเพื่อยืนยันการเข้าร่วม
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-fade-in-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        {/* Activity Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">กิจกรรมที่เข้าร่วม</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <CalendarDays size={18} />
            </div>
            <select
              {...register("activity_id", { valueAsNumber: true })}
              className={`${inputClass} appearance-none`}
            >
              <option value="" className="bg-[#0a1628]">-- เลือกกิจกรรม --</option>
              {activities.map((act) => (
                <option key={act.id} value={act.id} className="bg-[#0a1628]">
                  {act.name}
                </option>
              ))}
            </select>
            {errors.activity_id && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.activity_id.message}</p>
            )}
          </div>
        </div>

        {/* Existing Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">ชื่อ</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                {...register("first_name")}
                placeholder="สมชาย"
                className={inputClass}
              />
            </div>
            {errors.first_name && (
              <p className="text-red-400 text-xs ml-1">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">นามสกุล</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                {...register("last_name")}
                placeholder="ใจดี"
                className={inputClass}
              />
            </div>
            {errors.last_name && (
              <p className="text-red-400 text-xs ml-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">ชื่อเล่น</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Tag size={18} />
            </div>
            <input
              {...register("nickname")}
              placeholder="ชาย"
              className={inputClass}
            />
          </div>
          {errors.nickname && (
            <p className="text-red-400 text-xs ml-1">{errors.nickname.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">รหัสนักเรียน</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <IdCard size={18} />
              </div>
              <input
                {...register("student_id")}
                placeholder="660000"
                className={inputClass}
              />
            </div>
            {errors.student_id && (
              <p className="text-red-400 text-xs ml-1">{errors.student_id.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">ระดับชั้น</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <GraduationCap size={18} />
              </div>
              <select
                {...register("grade")}
                className={`${inputClass} appearance-none`}
              >
                <option value="" className="bg-[#0a1628]">เลือก</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g} className="bg-[#0a1628]">
                    {g}
                  </option>
                ))}
              </select>
            </div>
            {errors.grade && (
              <p className="text-red-400 text-xs ml-1">{errors.grade.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-8 py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              กำลังบันทึกข้อมูล...
            </>
          ) : (
            <>
              ยืนยันการลงทะเบียน
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
