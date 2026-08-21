"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ค้นหาชื่อ, นามสกุล, รหัสนักเรียน, ชื่อเล่น..."
        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
