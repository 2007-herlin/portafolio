"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";
import { FiPlus, FiTrash2, FiSave, FiUpload, FiEye, FiEyeOff, FiEdit2, FiX } from "react-icons/fi";
import Image from "next/image";

const emptyProject: Omit<Project, "id" | "created_at"> = {
  title: "",
  category: "",
  description: "",
  image_url: "",
  github_url: "",
  demo_url: "",
  visible: true,
  order_index: 0,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order_index");
    if (data) setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ ...emptyProject, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    setIsNew(true);
  };

  const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false); };
  const closeForm = () => { setEditing(null); setIsNew(false); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `projects/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setEditing({ ...editing, image_url: data.publicUrl });
    }
    setUploading(false);
  };

  const saveProject = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase.from("projects").upsert(editing);
    if (!error) {
      setMessage("✅ Proyecto guardado.");
      await load();
      closeForm();
    } else {
      setMessage("❌ Error al guardar.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
    await supabase.from("projects").delete().eq("id", id);
    await load();
  };

  const toggleVisible = async (p: Project) => {
    await supabase.from("projects").update({ visible: !p.visible }).eq("id", p.id);
    await load();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Proyectos</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <FiPlus /> Nuevo Proyecto
        </button>
      </div>

      {message && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm">{message}</div>
      )}

      {/* Edit / New Form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-700">{isNew ? "Nuevo Proyecto" : "Editar Proyecto"}</h2>
            <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><FiX /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Título", field: "title" as keyof Project, placeholder: "Mi Proyecto" },
              { label: "Categoría", field: "category" as keyof Project, placeholder: "React, Next.js..." },
              { label: "GitHub URL", field: "github_url" as keyof Project, placeholder: "https://github.com/..." },
              { label: "Demo URL", field: "demo_url" as keyof Project, placeholder: "https://..." },
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

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
              <textarea
                rows={3}
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Describe tu proyecto..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Imagen del Proyecto</label>
              <div className="flex items-center gap-4">
                {editing.image_url && (
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <Image src={editing.image_url} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  <FiUpload /> {uploading ? "Subiendo..." : "Subir imagen"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.visible}
                onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                className="accent-primary w-4 h-4"
              />
              Visible en el portafolio
            </label>
            <button
              onClick={saveProject}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 disabled:opacity-60 transition-all"
            >
              <FiSave /> {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
            No hay proyectos. ¡Agrega el primero!
          </div>
        )}
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
          >
            {project.image_url ? (
              <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <Image src={project.image_url} alt={project.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-12 rounded-xl bg-slate-100 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{project.title}</p>
              <p className="text-xs text-slate-400">{project.category}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleVisible(project)}
                title={project.visible ? "Ocultar" : "Mostrar"}
                className={`p-2 rounded-xl transition-colors ${project.visible ? "text-emerald-500 bg-emerald-50" : "text-slate-400 bg-slate-100"}`}
              >
                {project.visible ? <FiEye /> : <FiEyeOff />}
              </button>
              <button onClick={() => openEdit(project)} className="p-2 rounded-xl text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors">
                <FiEdit2 />
              </button>
              <button onClick={() => deleteProject(project.id)} className="p-2 rounded-xl text-red-400 bg-red-50 hover:bg-red-100 transition-colors">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
