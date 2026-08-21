"use client";

import { Filter, ChevronDown } from "lucide-react";
import { getDateRange } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Activity {
  id: number;
  name: string;
}

interface Props {
  grades: string[];
  selectedGrade: string;
  selectedActivity: string;
  dateFrom: string;
  dateTo: string;
  onGradeChange: (g: string) => void;
  onActivityChange: (a: string) => void;
  onDateChange: (from: string, to: string) => void;
}

const DATE_PRESETS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "วันนี้", value: "today" },
  { label: "เมื่อวาน", value: "yesterday" },
  { label: "7 วัน", value: "7days" },
  { label: "เดือนนี้", value: "month" },
];

export default function FilterPanel({
  grades,
  selectedGrade,
  selectedActivity,
  dateFrom,
  dateTo,
  onGradeChange,
  onActivityChange,
  onDateChange,
}: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch(console.error);
  }, []);

  const handlePreset = (preset: string) => {
    if (preset === "all") {
      onDateChange("", "");
    } else {
      const range = getDateRange(preset);
      onDateChange(range.from, range.to);
    }
  };

  const selectClass =
    "bg-white/5 border border-white/10 rounded-xl px-3 py-2 pr-8 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50 appearance-none cursor-pointer hover:border-white/20 transition-all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-slate-500 text-xs shrink-0">
        <Filter size={13} />
        <span>Filter:</span>
      </div>

      {/* Activity filter */}
      <div className="relative">
        <select
          value={selectedActivity}
          onChange={(e) => onActivityChange(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-slate-900">
            ทุกกิจกรรม
          </option>
          {activities.map((a) => (
            <option key={a.id} value={a.id} className="bg-slate-900">
              {a.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
      </div>

      {/* Grade filter */}
      <div className="relative">
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className={selectClass}
        >
          <option value="" className="bg-slate-900">
            ทุกระดับชั้น
          </option>
          {grades.map((g) => (
            <option key={g} value={g} className="bg-slate-900">
              {g}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
      </div>

      {/* Date presets */}
      <div className="flex gap-1">
        {DATE_PRESETS.map((p) => {
          const isActive =
            p.value === "all"
              ? !dateFrom && !dateTo
              : dateFrom === getDateRange(p.value).from &&
                dateTo === getDateRange(p.value).to;
          return (
            <button
              key={p.value}
              onClick={() => handlePreset(p.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-cyan-400/15 border border-cyan-400/30 text-cyan-400"
                  : "border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom date range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateChange(e.target.value, dateTo)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50 transition-all [color-scheme:dark]"
        />
        <span className="text-slate-600 text-xs">–</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateChange(dateFrom, e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50 transition-all [color-scheme:dark]"
        />
      </div>
    </div>
  );
}
