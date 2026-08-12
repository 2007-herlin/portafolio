"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FiBriefcase, FiMail, FiStar, FiUser, FiArrowRight } from "react-icons/fi";

type Stats = {
  projects: number;
  messages: number;
  unreadMessages: number;
  testimonials: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, messages: 0, unreadMessages: 0, testimonials: 0 });
  const [profileName, setProfileName] = useState("DanyCode");

  useEffect(() => {
    async function loadStats() {
      const [
        { count: projects },
        { count: messages },
        { count: unreadMessages },
        { count: testimonials },
        { data: profile },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase.from("profile").select("name").single(),
      ]);

      setStats({
        projects: projects || 0,
        messages: messages || 0,
        unreadMessages: unreadMessages || 0,
        testimonials: testimonials || 0,
      });

      if (profile?.name) setProfileName(profile.name);
    }

    loadStats();
  }, []);

  const cards = [
    { label: "Proyectos", value: stats.projects, icon: FiBriefcase, href: "/admin/projects", color: "from-blue-500 to-cyan-500" },
    { label: "Mensajes", value: stats.messages, badge: stats.unreadMessages, icon: FiMail, href: "/admin/messages", color: "from-violet-500 to-purple-500" },
    { label: "Testimonios", value: stats.testimonials, icon: FiStar, href: "/admin/testimonials", color: "from-amber-500 to-orange-500" },
    { label: "Perfil", value: "", icon: FiUser, href: "/admin/profile", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Bienvenido, <span className="text-primary">{profileName}</span> 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Aquí puedes gestionar todo el contenido de tu portafolio.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-sm`}>
              <card.icon className="text-white text-base" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">{card.label}</p>
                <p className="text-2xl font-extrabold text-slate-800">{card.value}</p>
              </div>
              {card.badge !== undefined && card.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {card.badge} nuevos
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Acciones rápidas</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { href: "/admin/projects", label: "Agregar nuevo proyecto" },
            { href: "/admin/profile", label: "Actualizar foto de perfil" },
            { href: "/admin/messages", label: "Leer mensajes recibidos" },
            { href: "/admin/testimonials", label: "Agregar testimonio" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all group"
            >
              <span className="text-sm font-medium text-slate-700 group-hover:text-primary">{action.label}</span>
              <FiArrowRight className="text-slate-400 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
