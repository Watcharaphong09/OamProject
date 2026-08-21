"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import StatCards from "@/components/admin/StatCards";
import RegistrationTable from "@/components/admin/RegistrationTable";
import RegistrationDetail from "@/components/admin/RegistrationDetail";
import SearchBar from "@/components/admin/SearchBar";
import FilterPanel from "@/components/admin/FilterPanel";
import RegistrationChart from "@/components/admin/RegistrationChart";
import ClassChart from "@/components/admin/ClassChart";
import { Registration } from "@/lib/db";
import {
  RefreshCw,
  Bell,
  QrCode,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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

interface ChartData {
  daily: { date: string; count: number }[];
  byGrade: { grade: string; count: number }[];
  byActivity?: { activity_name: string; count: number }[];
}

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
  { value: "student_id_asc", label: "รหัสนักเรียน ↑" },
  { value: "grade_asc", label: "ระดับชั้น ↑" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationsData | null>(null);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [showQR, setShowQR] = useState(false);

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
    SORT_OPTIONS.find(
      (o) => o.value === `${sortBy}_${sortOrder}`
    )?.label ?? "ใหม่ที่สุด";

  // Fetch stats + chart
  const fetchStats = useCallback(async () => {
    const [sRes, cRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/chart"),
    ]);
    if (sRes.ok) setStats(await sRes.json());
    if (cRes.ok) setChartData(await cRes.json());
  }, []);

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
      page: "1",
      pageSize: "10",
    });
    const res = await fetch(`/api/admin/registrations?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRegistrations(data);
    }
  }, [search, grade, activityId, dateFrom, dateTo, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, grade, activityId, dateFrom, dateTo, sortBy, sortOrder]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStats(), fetchRegistrations()]);
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

  // QR Code URL
  const baseUrl = "https://oam-project.vercel.app/";

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
      {/* Sidebar */}
      <Sidebar username="admin" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 glass-card border-b border-white/5 px-5 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:block hidden">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-500 text-xs mt-0.5">
                ระบบลงทะเบียนกิจกรรมผ่าน QR Code
              </p>
            </div>
            {/* Mobile title spacer */}
            <div className="lg:hidden pl-12">
              <h1 className="text-lg font-bold text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* QR Code button */}
              <button
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 text-sm hover:bg-cyan-400/15 transition-all"
              >
                <QrCode size={16} />
                <span className="hidden sm:inline">QR Code</span>
              </button>

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => alert("ไม่มีการแจ้งเตือนใหม่ในขณะนี้")}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <Bell size={16} />
                </button>
                {stats && stats.today > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full text-[9px] font-bold text-black flex items-center justify-center">
                    {stats.today > 9 ? "9+" : stats.today}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-5 lg:px-8 py-6 space-y-6">
          {/* Stat Cards */}
          {stats ? (
            <StatCards stats={stats} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-5 h-28 shimmer border border-white/5" />
              ))}
            </div>
          )}

          {/* Charts */}
          {chartData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <RegistrationChart data={chartData.daily} />
              <ClassChart 
                data={chartData.byActivity 
                  ? chartData.byActivity.map(a => ({ grade: a.activity_name, count: a.count }))
                  : chartData.byGrade
                } 
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-5 h-64 shimmer border border-white/5" />
              ))}
            </div>
          )}

          {/* Recent Registrations Header */}
          <div className="flex items-center justify-between mt-10 mb-4" id="registrations">
            <div>
              <h2 className="text-lg font-bold text-white">ผู้ลงทะเบียนล่าสุด</h2>
              <p className="text-slate-500 text-sm">แสดง 10 รายการล่าสุด</p>
            </div>
            <Link 
              href="/admin/registrations"
              className="text-cyan-400 text-sm hover:text-cyan-300 font-medium"
            >
              ดูทั้งหมด &rarr;
            </Link>
          </div>

          {/* Table */}
          {registrations ? (
            <RegistrationTable
              registrations={registrations.data}
              total={registrations.total}
              page={registrations.page}
              pageSize={registrations.pageSize}
              totalPages={1}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onPageChange={setPage}
              onRowClick={setSelectedReg}
            />
          ) : (
            <div className="glass-card rounded-2xl h-64 shimmer border border-white/5" />
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <RegistrationDetail
          registration={selectedReg}
          onClose={() => setSelectedReg(null)}
        />
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          />
          <div className="relative z-10 glass-card rounded-2xl border border-white/10 p-6 w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">QR Code ลงทะเบียน</h3>
              <button
                onClick={() => setShowQR(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl">
                <QRCodeSVG value={baseUrl} size={200} />
              </div>
              <p className="text-slate-400 text-sm text-center">
                สแกน QR Code เพื่อเปิดหน้าลงทะเบียน
              </p>
              <code className="text-cyan-400 text-xs bg-cyan-400/5 px-3 py-2 rounded-lg border border-cyan-400/20 break-all">
                {baseUrl}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
