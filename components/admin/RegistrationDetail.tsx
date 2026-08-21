"use client";

import { X, User, Hash, GraduationCap, Smile, Calendar, Clock } from "lucide-react";
import { Registration } from "@/lib/db";
import { formatThaiDate, formatThaiTime } from "@/lib/utils";

interface Props {
  registration: Registration;
  onClose: () => void;
}

export default function RegistrationDetail({ registration, onClose }: Props) {
  const fields = [
    {
      icon: User,
      label: "ชื่อ",
      value: registration.first_name,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: User,
      label: "นามสกุล",
      value: registration.last_name,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Hash,
      label: "รหัสนักเรียน",
      value: registration.student_id,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      mono: true,
    },
    {
      icon: Calendar,
      label: "กิจกรรม",
      value: registration.activity_name || "-",
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      icon: GraduationCap,
      label: "ระดับชั้น",
      value: registration.grade,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Smile,
      label: "ชื่อเล่น",
      value: registration.nickname,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      icon: Calendar,
      label: "วันที่ลงทะเบียน",
      value: formatThaiDate(registration.registered_at),
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Clock,
      label: "เวลาลงทะเบียน",
      value: formatThaiTime(registration.registered_at),
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      mono: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-2xl border border-white/10 animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="text-white font-semibold">รายละเอียดผู้ลงทะเบียน</h3>
            <p className="text-slate-500 text-xs mt-0.5">#{registration.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center pt-5 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold">
              {registration.first_name[0]?.toUpperCase()}
            </span>
          </div>
          <p className="text-white font-semibold text-lg">
            {registration.first_name} {registration.last_name}
          </p>
          <p className="text-slate-500 text-sm">"{registration.nickname}"</p>
        </div>

        {/* Fields */}
        <div className="px-5 pb-5 space-y-3">
          {fields.map((field, i) => {
            const Icon = field.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${field.iconBg}`}
                >
                  <Icon size={15} className={field.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">{field.label}</p>
                  <p
                    className={`text-white text-sm font-medium truncate ${
                      field.mono ? "font-mono" : ""
                    }`}
                  >
                    {field.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 hover:text-white transition-all"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
