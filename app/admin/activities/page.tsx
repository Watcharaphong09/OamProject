"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Plus, Trash2, Loader2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface Activity {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/admin/activities");
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newActivity }),
      });

      if (res.ok) {
        setNewActivity("");
        fetchActivities();
      } else {
        alert("Failed to create activity");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity? It might affect existing registrations.")) return;

    try {
      const res = await fetch(`/api/admin/activities?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchActivities();
      } else {
        alert("Failed to delete activity");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar username="admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 glass-card border-b border-white/5 px-5 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <CalendarDays size={20} />
            </div>
            <h1 className="text-xl font-bold text-white">จัดการกิจกรรม</h1>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">เพิ่มกิจกรรมใหม่</h2>
            <form onSubmit={handleAdd} className="flex gap-3 max-w-xl">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="ชื่อกิจกรรม เช่น งานกีฬาสี 2569"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !newActivity.trim()}
                className="btn-primary px-6 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                เพิ่ม
              </button>
            </form>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">รายการกิจกรรมทั้งหมด</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-sm font-medium text-slate-400">
                    <th className="px-6 py-4 whitespace-nowrap">รหัสกิจกรรม</th>
                    <th className="px-6 py-4 whitespace-nowrap">ชื่อกิจกรรม</th>
                    <th className="px-6 py-4 whitespace-nowrap">วันที่สร้าง</th>
                    <th className="px-6 py-4 whitespace-nowrap text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        <Loader2 size={24} className="mx-auto animate-spin text-cyan-500 mb-2" />
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  ) : activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        ยังไม่มีกิจกรรมใดๆ ในระบบ
                      </td>
                    </tr>
                  ) : (
                    activities.map((act) => (
                      <tr key={act.id} className="table-row-hover text-slate-200">
                        <td className="px-6 py-4 font-mono text-cyan-400">ACT-{act.id.toString().padStart(4, "0")}</td>
                        <td className="px-6 py-4 font-medium">{act.name}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {format(new Date(act.created_at), "dd MMM yyyy HH:mm", { locale: th })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(act.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="ลบกิจกรรม"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
