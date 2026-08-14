"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/supabase";
import {
  Plus, Trash2, Save, Loader2, CheckCircle, AlertTriangle,
  Eye, EyeOff, Zap, X, ArrowUp, ArrowDown
} from "lucide-react";

const ICON_OPTIONS = [
  "Code", "Code2", "Cpu", "Globe", "Database", "Layers", "Wifi", "Settings",
  "BarChart3", "Smartphone", "Server", "Shield", "Zap", "GitBranch", "Terminal",
  "Monitor", "Package", "Cloud", "Lock", "Wrench",
];

type Toast = { type: "success" | "error"; msg: string } | null;

function Toaster({ t }: { t: Toast }) {
  if (!t) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold ${t.type === "success" ? "bg-blue-700" : "bg-red-600"}`}>
      {t.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
      {t.msg}
    </div>
  );
}

const emptyService = (): Omit<Service, "id"> => ({
  name: "",
  short_desc: "",
  long_desc: "",
  icon: "Code2",
  price_label: "",
  visible: true,
  order_index: 0,
});

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyService());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    supabase.from("services").select("*").order("order_index").then(({ data }) => {
      if (data) setServices(data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!form.name.trim() || !form.short_desc.trim()) {
      showToast("error", "Nombre y descripción corta son obligatorios");
      return;
    }
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from("services").update(form).eq("id", editing.id);
      if (!error) {
        setServices((prev) => prev.map((s) => s.id === editing.id ? { ...editing, ...form } : s));
        showToast("success", "Actualizado");
      } else showToast("error", "Error al guardar");
    } else {
      const idx = services.length > 0 ? Math.max(...services.map((s) => s.order_index)) + 1 : 1;
      const { data, error } = await supabase.from("services").insert({ ...form, order_index: idx }).select().single();
      if (!error && data) {
        setServices((prev) => [...prev, data]);
        showToast("success", "Servicio agregado");
      } else showToast("error", "Error al guardar");
    }
    setSaving(false);
    setAdding(false);
    setEditing(null);
    setForm(emptyService());
  };

  const deleteService = async (svc: Service) => {
    if (!confirm(`¿Eliminar "${svc.name}"?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", svc.id);
    if (!error) {
      setServices((prev) => prev.filter((s) => s.id !== svc.id));
      showToast("success", "Eliminado");
    } else showToast("error", "Error al eliminar");
  };

  const toggleVisible = async (svc: Service) => {
    const { error } = await supabase.from("services").update({ visible: !svc.visible }).eq("id", svc.id);
    if (!error) setServices((prev) => prev.map((s) => s.id === svc.id ? { ...s, visible: !s.visible } : s));
  };

  const moveService = async (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= services.length) return;
    const updated = [...services];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updated[idx] = { ...updated[idx], order_index: idx };
    updated[newIdx] = { ...updated[newIdx], order_index: newIdx };
    setServices(updated);
    await Promise.all([
      supabase.from("services").update({ order_index: idx }).eq("id", updated[idx].id),
      supabase.from("services").update({ order_index: newIdx }).eq("id", updated[newIdx].id),
    ]);
  };

  const startEdit = (svc: Service) => {
    setEditing(svc);
    setForm({ name: svc.name, short_desc: svc.short_desc, long_desc: svc.long_desc ?? "", icon: svc.icon, price_label: svc.price_label ?? "", visible: svc.visible, order_index: svc.order_index });
    setAdding(true);
  };

  return (
    <div className="max-w-4xl">
      <Toaster t={toast} />

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Zap size={22} className="text-blue-700" /> Servicios
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Define los servicios que ofreces a tus clientes.</p>
        </div>
        <button onClick={() => { setAdding(true); setEditing(null); setForm(emptyService()); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      {/* Form */}
      {adding && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-blue-800 text-sm">{editing ? "Editar Servicio" : "Nuevo Servicio"}</h3>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input className="field" placeholder="Nombre del servicio *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="field" placeholder="Precio / Etiqueta (ej: Desde $50/h)" value={form.price_label} onChange={(e) => setForm((p) => ({ ...p, price_label: e.target.value }))} />
          </div>

          <input className="field mb-3" placeholder="Descripción corta * (aparece en la card)" value={form.short_desc} onChange={(e) => setForm((p) => ({ ...p, short_desc: e.target.value }))} />
          <textarea className="field mb-3 resize-none" rows={3} placeholder="Descripción larga (detalle opcional)" value={form.long_desc} onChange={(e) => setForm((p) => ({ ...p, long_desc: e.target.value }))} />

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Ícono (nombre de Lucide)</label>
              <select className="field" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}>
                {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))} className="accent-blue-700 w-4 h-4" />
                Visible en el portafolio
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAdding(false); setEditing(null); }} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">Cancelar</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {editing ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-700" size={28} /></div>
      ) : services.length === 0 && !adding ? (
        <div className="text-center py-20 text-slate-400">
          <Zap size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Sin servicios. Crea el primero.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc, i) => (
            <div key={svc.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveService(i, -1)} disabled={i === 0} className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-30 transition-colors"><ArrowUp size={13} /></button>
                <button onClick={() => moveService(i, 1)} disabled={i === services.length - 1} className="p-1 text-slate-300 hover:text-blue-600 disabled:opacity-30 transition-colors"><ArrowDown size={13} /></button>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {svc.icon.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{svc.name}</p>
                <p className="text-xs text-slate-400 truncate">{svc.short_desc}</p>
                {svc.price_label && <span className="text-xs font-bold text-blue-600">{svc.price_label}</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleVisible(svc)} className={`p-2 rounded-xl border transition-colors ${svc.visible ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                  {svc.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => startEdit(svc)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
                  <Save size={15} />
                </button>
                <button onClick={() => deleteService(svc)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .field { width: 100%; padding: 0.55rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.875rem; background: white; color: #1e293b; outline: none; transition: border-color 0.2s; }
        .field:focus { border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(29,78,216,0.08); }
      `}</style>
    </div>
  );
}
