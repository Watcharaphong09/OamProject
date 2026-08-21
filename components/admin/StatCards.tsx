"use client";

import { Users, CalendarCheck, GraduationCap, Clock, TrendingUp } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

interface StatsData {
  total: number;
  today: number;
  classCount: number;
  latest?: {
    first_name: string;
    last_name: string;
    registered_at: string;
  };
}

interface Props {
  stats: StatsData;
}

export default function StatCards({ stats }: Props) {
  const cards = [
    {
      label: "Total Registrations",
      value: stats.total.toLocaleString(),
      sub: "ผู้ลงทะเบียนทั้งหมด",
      icon: Users,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      trend: null,
    },
    {
      label: "Today",
      value: stats.today.toLocaleString(),
      sub: "วันนี้",
      icon: CalendarCheck,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      trend: stats.today > 0 ? `+${stats.today} วันนี้` : null,
    },
    {
      label: "Classes",
      value: stats.classCount.toLocaleString(),
      sub: "ระดับชั้น",
      icon: GraduationCap,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      trend: null,
    },
    {
      label: "Latest Registration",
      value: stats.latest
        ? `${stats.latest.first_name} ${stats.latest.last_name}`
        : "ยังไม่มีข้อมูล",
      sub: stats.latest
        ? getRelativeTime(stats.latest.registered_at)
        : "-",
      icon: Clock,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="glass-card rounded-2xl p-4 lg:p-5 animate-fade-in-up border border-white/5 hover:border-white/10 transition-all duration-300"
            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.iconBg}`}
              >
                <Icon size={19} className={card.iconColor} />
              </div>
              {card.trend && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <TrendingUp size={11} />
                  <span>{card.trend}</span>
                </div>
              )}
            </div>
            <p className="text-slate-500 text-xs font-medium mb-1">{card.label}</p>
            <p
              className="text-white font-bold text-xl lg:text-2xl leading-tight truncate"
              title={card.value}
            >
              {card.value}
            </p>
            <p className="text-slate-600 text-xs mt-1">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
