"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Experience } from "@/lib/supabase";
import { FiPlus, FiTrash2, FiSave, FiEdit2, FiX } from "react-icons/fi";

const empty: Omit<Experience, "id"> = {
  title: "",
  company: "",
  description: "",
  side: "left",
  order_index: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase.from("experience").select("*").order("order_index");
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ ...empty, id: crypto.randomUUID(), order_index: items.length });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase.from("experience").upsert(editing);
    if (!error) { setMessage("✅ Guardado."); await load(); setEditing(null); }
    else setMessage("❌ Error.");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Eliminar esta experiencia?")) return;
    await supabase.from("experience").delete().eq("id", id);
    await load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Experiencia</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <FiPlus /> Agregar
        </button>
      </div>

      {message && <div className="mb-4 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm">{message}</div>}

      {editing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">{isNew ? "Nueva Experiencia" : "Editar"}</h2>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
          </div>
          <div className="space-y-4">
            {[
              { label: "Título / Cargo", field: "title" as keyof Experience, placeholder: "Frontend Developer" },
              { label: "Empresa / Institución", field: "company" as keyof Experience, placeholder: "Google" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                <input
                  type="text"
                  value={(editing[field] as string) || ""}
                  onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Posición en la línea de tiempo</label>
              <select
                value={editing.side}
                onChange={(e) => setEditing({ ...editing, side: e.target.value as "left" | "right" })}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-primary"
              >
                <option value="left">Izquierda</option>
                <option value="right">Derecha</option>
              </select>
            </div>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="mt-5 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 disabled:opacity-60 transition-all"
          >
            <FiSave /> {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
            No hay experiencias registradas.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm">{item.title}</p>
              <p className="text-xs text-primary font-medium">{item.company}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg capitalize">{item.side}</span>
            <div className="flex gap-2">
              <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="p-2 rounded-xl text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors">
                <FiEdit2 />
              </button>
              <button onClick={() => deleteItem(item.id)} className="p-2 rounded-xl text-red-400 bg-red-50 hover:bg-red-100 transition-colors">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
