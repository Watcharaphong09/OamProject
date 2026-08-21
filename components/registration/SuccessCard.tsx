"use client";

import { CheckCircle2, User, Hash, GraduationCap, Calendar, Clock, Home } from "lucide-react";
import { Registration } from "@/lib/db";
import { formatThaiDate, formatThaiTime } from "@/lib/utils";
import Link from "next/link";

interface Props {
  registration: Registration;
}

export default function SuccessCard({ registration }: Props) {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      {/* Success Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center animate-pulse-glow">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="#22d3ee"
                strokeWidth="2"
                fill="none"
                className="animate-circle"
              />
              <polyline
                points="16,28 24,36 40,20"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="animate-checkmark"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">ลงทะเบียนสำเร็จ!</h2>
        <p className="text-slate-400 text-center text-sm leading-relaxed">
          ระบบได้บันทึกข้อมูลการลงทะเบียนของคุณเรียบร้อยแล้ว
        </p>
      </div>

      {/* Info Card */}
      <div className="glass-card rounded-2xl p-5 space-y-3.5 mb-6">
        <h3 className="text-xs font-semibold text-cyan-400/80 uppercase tracking-widest mb-4">
          ข้อมูลการลงทะเบียน
        </h3>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <User size={15} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-none mb-1">ชื่อ - นามสกุล</p>
            <p className="text-white font-medium">
              {registration.first_name} {registration.last_name}
            </p>
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Hash size={15} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-none mb-1">รหัสนักเรียน</p>
            <p className="text-white font-mono font-medium">{registration.student_id}</p>
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <GraduationCap size={15} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-none mb-1">ระดับชั้น</p>
            <p className="text-white font-medium">{registration.grade}</p>
          </div>
        </div>

        <div className="border-t border-white/5" />

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Calendar size={15} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 leading-none mb-1">วันที่และเวลาลงทะเบียน</p>
            <div className="flex items-center gap-3">
              <p className="text-white font-medium">
                {formatThaiDate(registration.registered_at)}
              </p>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock size={12} />
                <span className="text-sm">{formatThaiTime(registration.registered_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href="/register"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-white/10 bg-white/5 text-slate-300 font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:text-white"
      >
        <Home size={18} />
        <span>กลับหน้าหลัก</span>
      </Link>
    </div>
  );
}
