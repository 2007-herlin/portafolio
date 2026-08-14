"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Skill } from "@/lib/supabase";
import {
  Plus, Trash2, Save, Loader2, CheckCircle, AlertTriangle,
  GripVertical, Eye, EyeOff, TrendingUp
} from "lucide-react";

const COLOR_OPTIONS = [
  { label: "Azul → Celeste", value: "from-blue-700 to-sky-500" },
  { label: "Azul oscuro → Azul", value: "from-blue-800 to-blue-600" },
  { label: "Celeste → Azul", value: "from-sky-500 to-blue-600" },
  { label: "Rojo → Rosa", value: "from-red-600 to-red-400" },
  { label: "Rojo oscuro", value: "from-red-800 to-red-500" },
  { label: "Negro → Azul", value: "from-gray-900 to-blue-700" },
];

const emptySkill = (): Omit<Skill, "id"> => ({
  name: "",
  percentage: 80,
  category: "",
  color: "from-blue-700 to-sky-500",
  order_index: 0,
  visible: true,
});

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

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState(emptySkill());

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    supabase.from("skills").select("*").order("order_index").then(({ data }) => {
      if (data) setSkills(data);
      setLoading(false);
    });
  }, []);

  const updateField = (id: string, field: keyof Skill, value: unknown) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveSkill = async (skill: Skill) => {
    setSaving(skill.id);
    const { error } = await supabase.from("skills").update({
      name: skill.name,
      percentage: skill.percentage,
      category: skill.category,
      color: skill.color,
      order_index: skill.order_index,
      visible: skill.visible,
    }).eq("id", skill.id);
    setSaving(null);
    if (error) showToast("error", "Error al guardar");
    else showToast("success", "Guardado");
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("¿Eliminar esta habilidad?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (!error) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showToast("success", "Eliminado");
    } else {
      showToast("error", "Error al eliminar");
    }
  };

  const addSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) {
      showToast("error", "Nombre y categoría son obligatorios");
      return;
    }
    const idx = skills.length > 0 ? Math.max(...skills.map((s) => s.order_index)) + 1 : 1;
    const { data, error } = await supabase.from("skills").insert({ ...newSkill, order_index: idx }).select().single();
    if (error) { showToast("error", "Error al agregar"); return; }
    if (data) setSkills((prev) => [...prev, data]);
    setNewSkill(emptySkill());
    setAdding(false);
    showToast("success", "Habilidad agregada");
  };

  return (
    <div className="max-w-4xl">
      <Toaster t={toast} />

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <TrendingUp size={22} className="text-blue-700" /> Habilidades
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Edita nombre, porcentaje y categoría de cada habilidad.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
          <Plus size={16} /> Nueva habilidad
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-blue-800 mb-4 text-sm">Nueva Habilidad</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input className="field" placeholder="Nombre *" value={newSkill.name} onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))} />
            <input className="field" placeholder="Categoría *" value={newSkill.category} onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold">Porcentaje: {newSkill.percentage}%</label>
              <input type="range" min={0} max={100} value={newSkill.percentage} onChange={(e) => setNewSkill((p) => ({ ...p, percentage: +e.target.value }))} className="w-full mt-1 accent-blue-700" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold">Color</label>
              <select className="field mt-1" value={newSkill.color} onChange={(e) => setNewSkill((p) => ({ ...p, color: e.target.value }))}>
                {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={newSkill.visible} onChange={(e) => setNewSkill((p) => ({ ...p, visible: e.target.checked }))} className="accent-blue-700 w-4 h-4" />
                Visible
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addSkill} className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors"><Plus size={14} /> Agregar</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Skills list */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-700" size={28} /></div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="grid sm:grid-cols-[1fr_1fr_160px_auto] gap-3 items-end">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Nombre</label>
                  <input className="field mt-1" value={skill.name} onChange={(e) => updateField(skill.id, "name", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Categoría</label>
                  <input className="field mt-1" value={skill.category} onChange={(e) => updateField(skill.id, "category", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Porcentaje: {skill.percentage}%</label>
                  <input type="range" min={0} max={100} value={skill.percentage} onChange={(e) => updateField(skill.id, "percentage", +e.target.value)} className="w-full mt-2 accent-blue-700" />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateField(skill.id, "visible", !skill.visible)} className={`p-2 rounded-xl border transition-colors ${skill.visible ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                    {skill.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => saveSkill(skill)} disabled={saving === skill.id} className="flex items-center gap-1 px-3 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition-colors">
                    {saving === skill.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Guardar
                  </button>
                  <button onClick={() => deleteSkill(skill.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Color picker */}
              <div className="mt-3 flex items-center gap-2">
                <label className="text-xs text-slate-400 font-semibold">Color:</label>
                <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700" value={skill.color} onChange={(e) => updateField(skill.id, "color", e.target.value)}>
                  {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <div className={`h-4 w-16 rounded-full bg-gradient-to-r ${skill.color}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .field {
          width: 100%;
          padding: 0.55rem 0.875rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          background: white;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s;
        }
        .field:focus { border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(29,78,216,0.08); }
      `}</style>
    </div>
  );
}
