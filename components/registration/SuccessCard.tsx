"use client";

import { CheckCircle2, User, IdCard, GraduationCap, CalendarDays } from "lucide-react";
import { formatThaiDateTime, getBangkokNow } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  data: {
    first_name: string;
    last_name: string;
    student_id: string;
    grade: string;
    nickname: string;
    activity_name?: string;
  };
}

export default function SuccessCard({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  const now = getBangkokNow();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden animate-fade-in-up border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Checkmark */}
        <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
          <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" className="animate-circle" strokeOpacity="0.2" />
            <path d="M8 12l3 3 5-6" className="animate-checkmark" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-glow-cyan">
          ลงทะเบียนสำเร็จ!
        </h2>
        
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 mt-2 mb-6 animate-pulse">
          <p className="text-red-400 font-bold text-sm">
            🚨 กรุณาแคปหน้าจอนี้ไว้เป็นหลักฐาน 🚨
          </p>
        </div>

        {/* Data Card */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3 mb-8">
          <div className="flex items-center gap-3 text-slate-300 border-b border-white/5 pb-3">
            <CalendarDays size={18} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">กิจกรรมที่เข้าร่วม</p>
              <p className="font-medium text-white">{data.activity_name || "ไม่ระบุ"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <User size={18} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">ชื่อ-นามสกุล</p>
              <p className="font-medium text-white">
                {data.first_name} {data.last_name} ({data.nickname})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-300">
            <IdCard size={18} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">รหัสนักศึกษา</p>
              <p className="font-mono text-white">{data.student_id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-300">
            <GraduationCap size={18} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-500">ระดับชั้น</p>
              <p className="font-medium text-white">{data.grade}</p>
            </div>
          </div>
        </div>

        <a
          href="/"
          className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          กลับสู่หน้าหลัก
        </a>

        <p className="mt-6 text-xs text-slate-500">
          บันทึกข้อมูลเมื่อ {formatThaiDateTime(now)}
        </p>
      </div>
    </div>
  );
}
