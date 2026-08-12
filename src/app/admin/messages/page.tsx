"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ContactMessage } from "@/lib/supabase";
import { FiMail, FiTrash2, FiCheckCircle, FiCircle } from "react-icons/fi";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const load = async () => {
    let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (filter === "unread") query = query.eq("read", false);
    if (filter === "read") query = query.eq("read", true);
    const { data } = await query;
    if (data) setMessages(data);
  };

  useEffect(() => { load(); }, [filter]);

  const toggleRead = async (msg: ContactMessage) => {
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    await load();
  };

  const deleteMsg = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    await load();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Mensajes de Contacto</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-primary font-medium mt-1">{unreadCount} mensaje{unreadCount !== 1 ? "s" : ""} sin leer</p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f === "all" ? "Todos" : f === "unread" ? "No leídos" : "Leídos"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <FiMail className="text-4xl mx-auto mb-3 opacity-30" />
            <p>No hay mensajes aquí.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-2xl border p-5 transition-all ${
              !msg.read ? "border-primary/30 shadow-sm" : "border-slate-100"
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                {!msg.read ? (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className="font-bold text-slate-800 text-sm">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline">{msg.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-xs text-slate-400">
                  {new Date(msg.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" })}
                </p>
                <button
                  onClick={() => toggleRead(msg)}
                  title={msg.read ? "Marcar como no leído" : "Marcar como leído"}
                  className={`p-1.5 rounded-lg transition-colors ${msg.read ? "text-slate-400 hover:text-primary" : "text-primary hover:text-primary/80"}`}
                >
                  {msg.read ? <FiCircle className="text-sm" /> : <FiCheckCircle className="text-sm" />}
                </button>
                <button
                  onClick={() => deleteMsg(msg.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed pl-5">{msg.message}</p>
            <div className="mt-3 pl-5">
              <a
                href={`mailto:${msg.email}?subject=Re: Contacto DanyCode`}
                className="text-xs text-primary hover:underline font-medium"
              >
                Responder por email →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
