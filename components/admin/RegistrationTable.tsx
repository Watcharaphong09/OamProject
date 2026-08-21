"use client";

import { Registration } from "@/lib/db";
import { formatThaiDate, formatThaiTime } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  registrations: Registration[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (col: string) => void;
  onPageChange: (p: number) => void;
  onRowClick: (reg: Registration) => void;
}

const columns = [
  { key: "id", label: "ลำดับ", sortable: false },
  { key: "first_name", label: "ชื่อ", sortable: true },
  { key: "last_name", label: "นามสกุล", sortable: true },
  { key: "student_id", label: "รหัสนักเรียน", sortable: true },
  { key: "grade", label: "ระดับชั้น", sortable: true },
  { key: "nickname", label: "ชื่อเล่น", sortable: false },
  { key: "registered_at_date", label: "วันที่", sortable: false },
  { key: "registered_at_time", label: "เวลา", sortable: false },
  { key: "action", label: "", sortable: false },
];

function SortIcon({ col, sortBy, sortOrder }: { col: string; sortBy: string; sortOrder: string }) {
  if (col !== sortBy) return <ChevronsUpDown size={13} className="text-slate-600" />;
  return sortOrder === "asc" ? (
    <ChevronUp size={13} className="text-cyan-400" />
  ) : (
    <ChevronDown size={13} className="text-cyan-400" />
  );
}

export default function RegistrationTable({
  registrations,
  total,
  page,
  pageSize,
  totalPages,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onRowClick,
}: Props) {
  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Users size={17} className="text-cyan-400" />
          <h3 className="text-white font-semibold">ข้อมูลผู้ลงทะเบียน</h3>
        </div>
        <span className="text-slate-500 text-sm">
          ทั้งหมด <span className="text-white font-medium">{total.toLocaleString()}</span> รายการ
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable
                      ? "cursor-pointer hover:text-slate-300 transition-colors"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon col={col.key} sortBy={sortBy} sortOrder={sortOrder} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users size={36} className="text-slate-700" />
                    <p className="text-slate-500 font-medium">ไม่พบข้อมูลผู้ลงทะเบียน</p>
                    <p className="text-slate-600 text-sm">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
                  </div>
                </td>
              </tr>
            ) : (
              registrations.map((reg, index) => {
                const rowNo = (page - 1) * pageSize + index + 1;
                return (
                  <tr
                    key={reg.id}
                    onClick={() => onRowClick(reg)}
                    className="border-b border-white/5 table-row-hover group"
                  >
                    <td className="px-4 py-3.5 text-slate-500 text-sm">{rowNo}</td>
                    <td className="px-4 py-3.5 text-white text-sm font-medium">{reg.first_name}</td>
                    <td className="px-4 py-3.5 text-white text-sm">{reg.last_name}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-cyan-400 text-sm bg-cyan-400/5 px-2 py-0.5 rounded-md">
                        {reg.student_id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">
                        {reg.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 text-sm">{reg.nickname}</td>
                    <td className="px-4 py-3.5 text-slate-300 text-sm whitespace-nowrap">
                      {formatThaiDate(reg.registered_at)}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-sm font-mono whitespace-nowrap">
                      {formatThaiTime(reg.registered_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-cyan-400/80 hover:text-cyan-400 text-xs">
                        <Eye size={14} />
                        <span>ดู</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            หน้า {page} จาก {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5 && page > 3) {
                p = page - 2 + i;
              }
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
                    p === page
                      ? "bg-cyan-400/20 border border-cyan-400/40 text-cyan-400"
                      : "border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
