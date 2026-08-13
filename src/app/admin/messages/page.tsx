"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ContactMessage } from "@/lib/supabase";
import { FiMail, FiTrash2, FiCheckCircle, FiCircle, FiTag, FiLoader } from "react-icons/fi";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<"todos" | "no-leidos" | "leidos">("todos");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let query = supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (filter === "no-leidos") query = query.eq("read", false);
    if (filter === "leidos") query = query.eq("read", true);
    const { data } = await query;
    if (data) setMessages(data);
    setLoading(false);
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

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Mensajes de Contacto</h1>
          {unread > 0 && (
            <p className="text-sm text-red-500 font-semibold mt-0.5">
              📬 {unread} mensaje{unread !== 1 ? "s" : ""} sin leer
            </p>
          )}
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {([["todos", "Todos"], ["no-leidos", "Sin leer"], ["leidos", "Leídos"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === val ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <FiLoader className="animate-spin text-3xl text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 text-slate-400">
          <FiMail size={48} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">No hay mensajes aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id}
              className={`bg-white rounded-2xl border p-5 transition-all ${
                !msg.read ? "border-primary/30 shadow-sm" : "border-slate-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.read ? "bg-primary animate-pulse" : "bg-slate-200"}`} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-none">{msg.name}</p>
                    <a href={`mailto:${msg.email}`} className="text-xs text-primary hover:underline mt-0.5 inline-block">{msg.email}</a>
                    {msg.subject && msg.subject !== "Sin asunto" && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <FiTag size={10} /> {msg.subject}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {new Date(msg.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <button onClick={() => toggleRead(msg)} title={msg.read ? "Marcar sin leer" : "Marcar leído"}
                    className={`p-1.5 rounded-lg transition-colors ${msg.read ? "text-slate-400 hover:text-primary hover:bg-primary/10" : "text-primary bg-primary/10 hover:bg-primary/20"}`}
                  >
                    {msg.read ? <FiCircle size={14} /> : <FiCheckCircle size={14} />}
                  </button>
                  <button onClick={() => deleteMsg(msg.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mt-3 pl-5">{msg.message}</p>
              <div className="pl-5 mt-3">
                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Contacto DanyCode"}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Responder por correo →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
