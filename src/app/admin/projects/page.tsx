"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";
import {
  FiPlus, FiTrash2, FiSave, FiEdit2, FiX, FiUpload,
  FiLoader, FiEye, FiEyeOff, FiCheckCircle, FiAlertTriangle,
  FiGithub, FiExternalLink, FiBriefcase, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import Image from "next/image";

const CATEGORIES = ["Web", "Móvil", "Backend", "IA / ML", "Diseño", "Otro"];

const empty: Omit<Project, "id" | "created_at"> = {
  title: "", category: "", description: "", image_url: "",
  github_url: "", demo_url: "", tags: [], year: new Date().getFullYear().toString(),
  visible: true, order_index: 0,
};

type Toast = { type: "success" | "error"; msg: string } | null;

function ToastNotif({ toast }: { toast: Toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold max-w-xs ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
      {toast.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertTriangle size={18} />}
      {toast.msg}
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("order_index");
    if (data) setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({
      ...empty,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      order_index: projects.length,
    });
    setTagInput("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `projects/proj_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setEditing({ ...editing, image_url: data.publicUrl });
    } else {
      showToast("error", "Error al subir imagen.");
    }
    setUploading(false);
  };

  const addTag = () => {
    if (!editing || !tagInput.trim()) return;
    const tag = tagInput.trim();
    if (!editing.tags.includes(tag)) {
      setEditing({ ...editing, tags: [...editing.tags, tag] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    if (!editing) return;
    setEditing({ ...editing, tags: editing.tags.filter((t) => t !== tag) });
  };

  const save = async () => {
    if (!editing || !editing.title.trim()) {
      showToast("error", "El título es obligatorio.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("projects").upsert(editing);
    if (!error) {
      showToast("success", "Proyecto guardado.");
      await load();
      setEditing(null);
    } else {
      showToast("error", "Error al guardar.");
    }
    setSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await supabase.from("projects").delete().eq("id", id);
    await load();
  };

  const toggleVisible = async (p: Project) => {
    await supabase.from("projects").update({ visible: !p.visible }).eq("id", p.id);
    await load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= projects.length) return;
    const updated = [...projects];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setProjects(updated);
    await Promise.all(updated.map((p, i) => supabase.from("projects").update({ order_index: i }).eq("id", p.id)));
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-300";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-4xl">
      <ToastNotif toast={toast} />
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Proyectos</h1>
          <p className="text-slate-400 text-sm mt-0.5">{projects.length} proyecto{projects.length !== 1 ? "s" : ""} en total</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          <FiPlus size={16} /> Nuevo Proyecto
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-7 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <FiBriefcase size={16} className="text-primary" />
              {editing.created_at === new Date().toISOString() ? "Nuevo Proyecto" : "Editar Proyecto"}
            </h2>
            <button onClick={() => setEditing(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <FiX size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div className="sm:col-span-2">
              <label className={labelClass}>Título *</label>
              <input type="text" value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Nombre del proyecto" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Categoría</label>
              <select value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className={inputClass}
              >
                <option value="">Sin categoría</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Año</label>
              <input type="text" value={editing.year}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                placeholder="2024" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>URL GitHub</label>
              <input type="url" value={editing.github_url}
                onChange={(e) => setEditing({ ...editing, github_url: e.target.value })}
                placeholder="https://github.com/..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>URL Demo</label>
              <input type="url" value={editing.demo_url}
                onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })}
                placeholder="https://..." className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea rows={3} value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Breve descripción del proyecto..." className={inputClass + " resize-none"} />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Tecnologías / Tags</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Ej: React, Node.js, PostgreSQL" className={inputClass} />
                <button onClick={addTag}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors flex-shrink-0"
                >Agregar</button>
              </div>
              {editing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {editing.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><FiX size={11} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Imagen del Proyecto</label>
              <div className="flex items-center gap-4">
                {editing.image_url && (
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                    <Image src={editing.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-semibold hover:border-primary hover:text-primary transition-all disabled:opacity-60"
                >
                  {uploading ? <FiLoader className="animate-spin" /> : <FiUpload size={14} />}
                  {uploading ? "Subiendo..." : "Subir imagen"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Visible */}
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <input type="checkbox" id="visible" checked={editing.visible}
                onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                className="w-4 h-4 accent-primary" />
              <label htmlFor="visible" className="text-sm font-semibold text-slate-600 cursor-pointer">
                Visible en el portafolio público
              </label>
            </div>
          </div>

          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
          >
            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Guardar Proyecto
          </button>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
            <FiBriefcase size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">No hay proyectos aún.</p>
            <p className="text-sm mt-1">Haz clic en "Nuevo Proyecto" para empezar.</p>
          </div>
        )}
        {projects.map((p, idx) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary/30">
                  {p.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-slate-800 text-sm truncate">{p.title}</p>
                {p.category && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-semibold">{p.category}</span>}
                {p.year && <span className="text-xs text-slate-400">{p.year}</span>}
              </div>
              {p.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{p.description}</p>}
              {p.tags && p.tags.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                  {p.tags.length > 3 && <span className="text-xs text-slate-400">+{p.tags.length - 3}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => move(p.id, -1)} disabled={idx === 0} className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 disabled:opacity-30 transition-colors"><FiArrowUp size={13} /></button>
              <button onClick={() => move(p.id, 1)} disabled={idx === projects.length - 1} className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 disabled:opacity-30 transition-colors"><FiArrowDown size={13} /></button>
              <button onClick={() => toggleVisible(p)} title={p.visible ? "Ocultar" : "Mostrar"}
                className={`p-1.5 rounded-lg transition-colors ${p.visible ? "text-emerald-500 bg-emerald-50" : "text-slate-400 bg-slate-50"}`}>
                {p.visible ? <FiEye size={13} /> : <FiEyeOff size={13} />}
              </button>
              {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"><FiGithub size={13} /></a>}
              {p.demo_url && <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"><FiExternalLink size={13} /></a>}
              <button onClick={() => { setEditing({ ...p }); setTagInput(""); }}
                className="p-1.5 rounded-lg text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors"><FiEdit2 size={13} /></button>
              <button onClick={() => deleteProject(p.id)}
                className="p-1.5 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 transition-colors"><FiTrash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
