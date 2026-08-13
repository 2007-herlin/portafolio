"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/lib/supabase";
import {
  FiPlus, FiTrash2, FiSave, FiEdit2, FiX, FiLoader,
  FiCheckCircle, FiAlertTriangle, FiBriefcase, FiCalendar
} from "react-icons/fi";

const empty: Omit<Experience, "id"> = {
  title: "", company: "", description: "",
  start_date: "", end_date: "", current: false,
  side: "left", order_index: 0,
};

type Toast = { type: "success" | "error"; msg: string } | null;

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    const { data } = await supabase.from("experience").select("*").order("order_index");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing || !editing.title.trim() || !editing.company.trim()) {
      showToast("error", "Título y empresa son obligatorios.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("experience").upsert(editing);
    if (!error) {
      showToast("success", "Guardado correctamente.");
      await load();
      setEditing(null);
    } else {
      showToast("error", "Error al guardar.");
    }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Eliminar esta entrada de experiencia?")) return;
    await supabase.from("experience").delete().eq("id", id);
    await load();
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-300";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
          {toast.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertTriangle size={18} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Experiencia</h1>
          <p className="text-slate-400 text-sm mt-0.5">Trabajo, educación y formación</p>
        </div>
        <button onClick={() => setEditing({ ...empty, id: crypto.randomUUID(), order_index: items.length })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          <FiPlus size={16} /> Agregar
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <FiBriefcase size={16} className="text-primary" />
              {editing.title ? "Editar entrada" : "Nueva entrada"}
            </h2>
            <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
              <FiX size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cargo / Título *</label>
              <input type="text" value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Ej: Desarrollador Frontend" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Empresa / Institución *</label>
              <input type="text" value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                placeholder="Ej: Google, UNAL..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha de inicio</label>
              <input type="text" value={editing.start_date}
                onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                placeholder="2022 o Ene 2022" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha de fin</label>
              <input type="text" value={editing.end_date}
                onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                placeholder="2024 o Dic 2024" disabled={editing.current} className={inputClass} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="current" checked={editing.current}
                onChange={(e) => setEditing({ ...editing, current: e.target.checked, end_date: e.target.checked ? "" : editing.end_date })}
                className="w-4 h-4 accent-primary" />
              <label htmlFor="current" className="text-sm font-semibold text-slate-600 cursor-pointer">
                Trabajo / Estudio actual
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea rows={3} value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Describe tus logros y responsabilidades..." className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className={labelClass}>Columna en timeline</label>
              <select value={editing.side}
                onChange={(e) => setEditing({ ...editing, side: e.target.value as "left" | "right" })}
                className={inputClass}
              >
                <option value="left">Izquierda (trabajo / laboral)</option>
                <option value="right">Derecha (educación / académico)</option>
              </select>
            </div>
          </div>

          <button onClick={save} disabled={saving}
            className="mt-5 flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
          >
            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Guardar
          </button>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <FiBriefcase size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">Sin entradas de experiencia.</p>
          </div>
        )}
        {items.map((item) => {
          const dateLabel = item.current
            ? `${item.start_date} — Actualidad`
            : item.end_date ? `${item.start_date} — ${item.end_date}` : item.start_date;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold ${
                  item.side === "left" ? "bg-primary" : "bg-secondary"
                }`}>
                  {item.side === "left" ? "💼" : "🎓"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                  {item.current && (
                    <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">Actual</span>
                  )}
                </div>
                <p className="text-primary font-semibold text-xs mt-0.5">{item.company}</p>
                {dateLabel && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <FiCalendar size={10} /> {dateLabel}
                  </p>
                )}
                {item.description && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.description}</p>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setEditing({ ...item })} className="p-1.5 rounded-lg text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors">
                  <FiEdit2 size={13} />
                </button>
                <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 transition-colors">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
