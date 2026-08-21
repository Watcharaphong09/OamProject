"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  QrCode,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/dashboard#registrations", icon: Users, label: "Registrations" },
  { href: "/admin/dashboard#students", icon: GraduationCap, label: "Students" },
  { href: "/admin/dashboard#settings", icon: Settings, label: "Settings" },
];

interface Props {
  username?: string;
}

export default function Sidebar({ username }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-400/30 border border-cyan-400/20 flex items-center justify-center shrink-0">
          <QrCode size={18} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">OAM System</p>
          <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href === "/admin/dashboard" && pathname === "/admin/dashboard");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-cyan-400/10 text-cyan-400 border-l-2 border-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"} />
              <span className="text-sm font-medium">{label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-cyan-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold uppercase">
              {username?.[0] ?? "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{username ?? "Admin"}</p>
            <p className="text-slate-500 text-xs">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 group"
        >
          <LogOut size={17} className="group-hover:text-red-400" />
          <span className="text-sm">{isLoggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 h-screen sticky top-0 glass-card border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass-card border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <Menu size={20} />
        </button>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-[#0a1628] border-r border-white/5 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
          <SidebarContent />
        </aside>
      </div>
    </>
  );
}
