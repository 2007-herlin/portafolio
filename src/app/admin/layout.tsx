"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, User, Briefcase, Cpu, Star,
  Mail, LogOut, Menu, X, Code2, Loader2,
  TrendingUp, FolderOpen, Zap
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Perfil & Redes", icon: User },
  { href: "/admin/skills", label: "Habilidades", icon: TrendingUp },
  { href: "/admin/services", label: "Servicios", icon: Zap },
  { href: "/admin/projects", label: "Proyectos", icon: Briefcase },
  { href: "/admin/experience", label: "Experiencia", icon: Cpu },
  { href: "/admin/resources", label: "Recursos", icon: FolderOpen },
  { href: "/admin/testimonials", label: "Testimonios", icon: Star },
  { href: "/admin/messages", label: "Mensajes", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) { setAuthChecked(true); setIsAuthed(false); return; }
      const { data } = await supabase.auth.getUser();
      if (!data?.user) { router.replace("/admin/login"); setAuthChecked(true); setIsAuthed(false); return; }
      setUserEmail(data.user.email || "");
      setIsAuthed(true);
      setAuthChecked(true);
      const { count } = await supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false);
      setUnreadCount(count || 0);
    }
    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.replace("/admin/login"); };

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  if (!authChecked && !isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin text-3xl text-blue-700" size={32} />
          <p className="text-sm font-medium">Verificando sesion...</p>
        </div>
      </div>
    );
  }

  if (!isLoginPage && !isAuthed) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] text-white flex flex-col z-30 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-sky-500 rounded-xl flex items-center justify-center">
            <Code2 className="text-white" size={16} />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm leading-none">DanyCode</p>
            <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-slate-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-700 text-white shadow-lg shadow-blue-900/40"
                      : "text-slate-400 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.label === "Mensajes" && unreadCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/8 space-y-1">
          <div className="px-3 py-1">
            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-white/6 hover:text-white transition-all">
            <LayoutDashboard size={15} />
            <span>Ver Portafolio</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={15} />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900 p-1">
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-slate-800">DanyCode Admin</span>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
