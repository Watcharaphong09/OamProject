"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Sidebar from "@/components/admin/Sidebar";
import RegistrationTable from "@/components/admin/RegistrationTable";
import RegistrationDetail from "@/components/admin/RegistrationDetail";
import SearchBar from "@/components/admin/SearchBar";
import FilterPanel from "@/components/admin/FilterPanel";
import { Registration } from "@/lib/db";
import { ArrowUpDown, ChevronDown, RefreshCw, Loader2 } from "lucide-react";

interface RegistrationsData {
  data: Registration[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  grades: string[];
}

const SORT_OPTIONS = [
  { value: "registered_at_desc", label: "ใหม่ที่สุด" },
  { value: "registered_at_asc", label: "เก่าที่สุด" },
  { value: "first_name_asc", label: "ชื่อ A-Z" },
  { value: "first_name_desc", label: "ชื่อ Z-A" },
  { value: "student_id_asc", label: "รหัสนักศึกษา ↑" },
  { value: "grade_asc", label: "ระดับชั้น ↑" },
];

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationsData | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [activityId, setActivityId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("registered_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === `${sortBy}_${sortOrder}`)?.label ?? "ใหม่ที่สุด";

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    const params = new URLSearchParams({
      search,
      grade,
      activityId,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page: String(page),
      pageSize: "20",
    });
    const res = await fetch(`/api/admin/registrations?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRegistrations(data);
    }
  }, [search, grade, activityId, dateFrom, dateTo, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, grade, activityId, dateFrom, dateTo, sortBy, sortOrder]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRegistrations();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
  };

  const handleSortPreset = (value: string) => {
    const [col, order] = value.split("_");
    setSortBy(col);
    setSortOrder(order as "asc" | "desc");
    setShowSortDropdown(false);
  };

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar username="admin" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 glass-card border-b border-white/5 px-5 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">รายชื่อผู้ลงทะเบียน</h1>
              <p className="text-slate-500 text-xs mt-0.5">ระบบจัดการและค้นหาข้อมูลผู้ลงทะเบียน</p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleRefresh}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin text-cyan-400" : ""}
                />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 space-y-6">
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <SearchBar value={search} onChange={setSearch} />

              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSortDropdown((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm hover:border-white/20 transition-all whitespace-nowrap"
                >
                  <ArrowUpDown size={14} />
                  <span>{currentSortLabel}</span>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 z-20 glass-card border border-white/10 rounded-xl overflow-hidden w-44 shadow-2xl">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSortPreset(opt.value)}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          opt.value === `${sortBy}_${sortOrder}`
                            ? "bg-cyan-400/10 text-cyan-400"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Panel */}
            <FilterPanel
              grades={registrations?.grades || []}
              selectedGrade={grade}
              selectedActivity={activityId}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onGradeChange={setGrade}
              onActivityChange={setActivityId}
              onDateChange={(from, to) => {
                setDateFrom(from);
                setDateTo(to);
              }}
            />
          </div>

          {/* Table */}
          {registrations ? (
            <RegistrationTable
              registrations={registrations.data}
              total={registrations.total}
              page={registrations.page}
              pageSize={registrations.pageSize}
              totalPages={registrations.totalPages}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onPageChange={setPage}
              onRowClick={setSelectedReg}
            />
          ) : (
            <div className="glass-card rounded-2xl h-64 shimmer border border-white/5 flex items-center justify-center">
              <Loader2 className="animate-spin text-cyan-400" size={32} />
            </div>
          )}
        </main>
      </div>

      {selectedReg && (
        <RegistrationDetail
          registration={selectedReg}
          onClose={() => setSelectedReg(null)}
        />
      )}
    </div>
  );
}
