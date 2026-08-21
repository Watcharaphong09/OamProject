"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GraduationCap } from "lucide-react";

interface GradeData {
  grade: string;
  count: number;
}

interface Props {
  data: GradeData[];
}

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-white/10 rounded-xl px-3 py-2">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-blue-400 font-bold text-sm">
          {payload[0].value} คน
        </p>
      </div>
    );
  }
  return null;
};

export default function ClassChart({ data }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/5">
      <div className="flex items-center gap-2 mb-5">
        <GraduationCap size={17} className="text-blue-400" />
        <h3 className="text-white font-semibold">Activity/Grade split</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-slate-600 text-sm">ยังไม่มีข้อมูล</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="grade"
                tick={{ fill: "#64748b", fontSize: 10 }}
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
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-2">
            {data.map((d, i) => (
              <div key={d.grade} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-slate-400">
                  {d.grade}: <span className="text-white font-medium">{d.count}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
