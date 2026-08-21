"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

interface DailyData {
  date: string;
  count: number;
}

interface Props {
  data: DailyData[];
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-white/10 rounded-xl px-3 py-2">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-cyan-400 font-bold text-sm">
          {payload[0].value} คน
        </p>
      </div>
    );
  }
  return null;
};

export default function RegistrationChart({ data }: Props) {
  const formatted = data.map((d) => ({
    date: (() => {
      try {
        return format(parseISO(d.date), "d MMM", { locale: th });
      } catch {
        return d.date;
      }
    })(),
    count: d.count,
  }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={17} className="text-cyan-400" />
          <h3 className="text-white font-semibold">Registration Overview</h3>
        </div>
        <span className="text-slate-500 text-xs">7 วันที่ผ่านมา</span>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-slate-600 text-sm">ยังไม่มีข้อมูล</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#colorCount)"
              dot={{ fill: "#22d3ee", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#22d3ee", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
