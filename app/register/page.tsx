"use client";

import { useState, Suspense } from "react";
import { QrCode, Shield, Loader2 } from "lucide-react";
import RegistrationForm from "@/components/registration/RegistrationForm";
import SuccessCard from "@/components/registration/SuccessCard";
import { Registration } from "@/lib/db";

export default function RegisterPage() {
  const [registration, setRegistration] = useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden">
      {/* Background grid */}
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

      {/* Glow orbs */}
      <div className="fixed top-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-cyan-400/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {!registration ? (
          <>
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up">
              {/* Logo/Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-400/20 mb-5 glow-cyan">
                <QrCode size={38} className="text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 gradient-text">
                Activity Registration
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                กรุณากรอกข้อมูลเพื่อลงทะเบียนเข้าร่วมกิจกรรม
              </p>
            </div>

            {/* Form Card */}
            <div
              className="glass-card rounded-2xl p-6 animate-fade-in-up delay-100"
              style={{ animationFillMode: "both" }}
            >
              <Suspense fallback={<div className="h-[400px] flex items-center justify-center text-cyan-400"><Loader2 className="animate-spin" /></div>}>
                <RegistrationForm onSuccess={setRegistration} />
              </Suspense>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center animate-fade-in-up delay-200" style={{ animationFillMode: "both" }}>
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
                <Shield size={12} />
                <span>ข้อมูลของคุณได้รับการปกป้องอย่างปลอดภัย</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Header for Success */}
            <div className="text-center mb-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-400/20 mb-3">
                <QrCode size={26} className="text-cyan-400" />
              </div>
              <p className="text-slate-500 text-xs">Activity Registration System</p>
            </div>
            <SuccessCard data={registration} />
          </>
        )}
      </div>
    </div>
  );
}
