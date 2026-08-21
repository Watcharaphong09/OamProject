import { getActivities } from "@/lib/db";
import Link from "next/link";
import { CalendarDays, ArrowRight, Activity, QrCode } from "lucide-react";
import { formatThaiDateTime } from "@/lib/utils";

export default async function Home() {
  const activities = await getActivities();
  const activeActivities = activities.filter(a => a.is_active);

  return (
    <div className="min-h-screen flex flex-col py-12 px-5 relative overflow-hidden bg-[#060d1a]">
      {/* Background blobs */}
      <div className="fixed top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-400/20 mb-5 glow-cyan">
            <Activity size={38} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 gradient-text">
            ระบบลงทะเบียนกิจกรรม
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            เลือกกิจกรรมที่คุณต้องการเข้าร่วมจากรายการด้านล่าง
          </p>
        </div>

        {/* Activity Cards */}
        {activeActivities.length === 0 ? (
          <div className="w-full glass-card rounded-3xl p-10 text-center border border-white/5 animate-fade-in-up">
            <CalendarDays size={48} className="mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-slate-300 mb-2">ไม่มีกิจกรรมที่เปิดรับลงทะเบียนในขณะนี้</h2>
            <p className="text-slate-500">กรุณาติดต่อผู้ดูแลระบบ</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeActivities.map((act, idx) => (
              <div 
                key={act.id}
                className="group glass-card rounded-3xl p-6 border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
                  <CalendarDays size={24} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {act.name}
                </h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    เปิดรับลงทะเบียน
                  </span>
                  
                  <Link 
                    href={`/register?activityId=${act.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-lg group-hover:bg-cyan-500/20 transition-colors"
                  >
                    เข้าร่วม <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20">
          <Link href="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            สำหรับผู้ดูแลระบบ (Admin)
          </Link>
        </div>
      </div>
    </div>
  );
}
