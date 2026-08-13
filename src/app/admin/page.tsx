"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  FiBriefcase, FiStar, FiMail, FiCpu, FiArrowRight,
  FiEye, FiUser, FiTrendingUp
} from "react-icons/fi";

type Stats = {
  projects: number;
  testimonials: number;
  messages: number;
  unread: number;
  experience: number;
  visible_projects: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, testimonials: 0, messages: 0, unread: 0, experience: 0, visible_projects: 0 });
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Admin");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  useEffect(() => {
    async function load() {
      const [
        { count: projects }, { count: visible },
        { count: testimonials },
        { count: messages }, { count: unread },
        { count: experience },
        { data: profile },
      ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("visible", true),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
        supabase.from("experience").select("id", { count: "exact", head: true }),
        supabase.from("profile").select("name").single(),
      ]);
      setStats({
        projects: projects || 0, visible_projects: visible || 0,
        testimonials: testimonials || 0,
        messages: messages || 0, unread: unread || 0,
        experience: experience || 0,
      });
      if (profile?.name) setProfileName(profile.name);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    {
      label: "Proyectos", value: stats.projects, sub: `${stats.visible_projects} visibles`,
      icon: FiBriefcase, color: "from-violet-500 to-primary", href: "/admin/projects"
    },
    {
      label: "Testimonios", value: stats.testimonials, sub: "de clientes",
      icon: FiStar, color: "from-amber-400 to-orange-500", href: "/admin/testimonials"
    },
    {
      label: "Mensajes", value: stats.messages, sub: stats.unread > 0 ? `${stats.unread} sin leer` : "todos leídos",
      icon: FiMail, color: stats.unread > 0 ? "from-red-500 to-rose-500" : "from-emerald-500 to-teal-500",
      href: "/admin/messages", badge: stats.unread > 0 ? stats.unread : undefined,
    },
    {
      label: "Experiencia", value: stats.experience, sub: "entradas",
      icon: FiCpu, color: "from-pink-500 to-secondary", href: "/admin/experience"
    },
  ];

  const quickLinks = [
    { label: "Editar Perfil", href: "/admin/profile", icon: FiUser, desc: "Foto, bio, estadísticas" },
    { label: "Redes Sociales", href: "/admin/profile?tab=redes", icon: FiTrendingUp, desc: "GitHub, LinkedIn, etc." },
    { label: "Ver Portafolio", href: "/", icon: FiEye, desc: "Cómo te ve el público", external: true },
  ];

  return (
    <div className="max-w-4xl">
      {/* Saludo */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">
          {greeting}, <span className="gradient-text">{profileName}</span> 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Aquí tienes un resumen de tu portafolio.{" "}
          {stats.unread > 0 && (
            <Link href="/admin/messages" className="text-red-500 font-semibold hover:underline">
              Tienes {stats.unread} mensaje{stats.unread !== 1 ? "s" : ""} sin leer.
            </Link>
          )}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, sub, icon: Icon, color, href, badge }) => (
          <Link key={label} href={href}
            className="relative bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            {badge && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {badge}
              </span>
            )}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm`}>
              <Icon size={18} className="text-white" />
            </div>
            {loading ? (
              <div className="h-7 w-10 animate-shimmer rounded-lg mb-1" />
            ) : (
              <p className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{value}</p>
            )}
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm">
        <h2 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Accesos rápidos</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {quickLinks.map(({ label, href, icon: Icon, desc, external }) => (
            <Link key={label} href={href} target={external ? "_blank" : undefined}
              className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/3 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Icon size={15} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <FiArrowRight size={14} className="text-slate-300 group-hover:text-primary ml-auto flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info de ayuda */}
      <div className="bg-gradient-to-r from-primary/8 to-secondary/8 border border-primary/15 rounded-2xl p-5">
        <h3 className="font-bold text-slate-700 mb-2 text-sm">💡 Primeros pasos</h3>
        <ol className="space-y-1.5 text-sm text-slate-500 list-decimal list-inside">
          <li>Ve a <Link href="/admin/profile" className="text-primary font-semibold hover:underline">Perfil</Link> y sube tu foto, nombre y bio.</li>
          <li>Agrega tus <Link href="/admin/profile" className="text-primary font-semibold hover:underline">redes sociales</Link> (GitHub, LinkedIn, etc.).</li>
          <li>Añade tus <Link href="/admin/projects" className="text-primary font-semibold hover:underline">proyectos</Link> con imagen y descripción.</li>
          <li>Registra tu <Link href="/admin/experience" className="text-primary font-semibold hover:underline">experiencia</Link> y educación.</li>
          <li><Link href="/" target="_blank" className="text-primary font-semibold hover:underline">Revisa tu portafolio</Link> para ver cómo queda.</li>
        </ol>
      </div>
    </div>
  );
}
