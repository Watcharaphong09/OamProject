"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("กรุณากรอก Username และรหัสผ่าน");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "เกิดข้อผิดพลาด");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-white/30 transition-all duration-200 focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] text-base";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-cyan-400/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-400/20 mb-4 glow-cyan">
            <QrCode size={30} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-slate-500 text-sm">Student Registration System</p>
        </div>

        {/* Card */}
        <div
          className="glass-card rounded-2xl p-6 animate-fade-in-up delay-100"
          style={{ animationFillMode: "both" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Lock size={15} className="text-cyan-400" />
            <h2 className="text-white font-semibold">เข้าสู่ระบบ Admin</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอก Username"
                  className={inputClass}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className={`${inputClass} pr-11`}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary relative z-10 text-white font-semibold py-3.5 px-6 rounded-xl text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-5 animate-fade-in-up delay-200" style={{ animationFillMode: "both" }}>
          ระบบนี้สำหรับผู้ดูแลระบบเท่านั้น
        </p>
      </div>
    </div>
  );
}
