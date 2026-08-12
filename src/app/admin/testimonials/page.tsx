"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import type { Testimonial } from "@/lib/supabase";
import { FiPlus, FiTrash2, FiSave, FiEdit2, FiX, FiUpload } from "react-icons/fi";
import Image from "next/image";

const empty: Omit<Testimonial, "id"> = {
  text: "",
  author_name: "",
  author_role: "",
  author_image_url: "",
  rating: 5,
  order_index: 0,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("order_index");
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `testimonials/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setEditing({ ...editing, author_image_url: data.publicUrl });
    }
    setUploading(false);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase.from("testimonials").upsert(editing);
    if (!error) { setMessage("✅ Guardado."); await load(); setEditing(null); }
    else setMessage("❌ Error.");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    await load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Testimonios</h1>
        <button
          onClick={() => { setEditing({ ...empty, id: crypto.randomUUID(), order_index: items.length }); setIsNew(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <FiPlus /> Agregar
        </button>
      </div>

      {message && <div className="mb-4 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm">{message}</div>}

      {editing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-700">{isNew ? "Nuevo Testimonio" : "Editar"}</h2>
            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Testimonio</label>
              <textarea
                rows={4}
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                placeholder="Lo que dijo el cliente..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  value={editing.author_name}
                  onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rol / Empresa</label>
                <input
                  type="text"
                  value={editing.author_role}
                  onChange={(e) => setEditing({ ...editing, author_role: e.target.value })}
                  placeholder="CEO, TechStart"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })}
                className="w-24 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Foto del Cliente</label>
              <div className="flex items-center gap-4">
                {editing.author_image_url && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                    <Image src={editing.author_image_url} alt="Author" fill className="object-cover" />
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  <FiUpload /> {uploading ? "Subiendo..." : "Subir foto"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
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
            No hay testimonios.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm">{item.author_name}</p>
              <p className="text-xs text-primary font-medium">{item.author_role}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">"{item.text}"</p>
              <p className="text-yellow-400 text-xs mt-1">{"★".repeat(item.rating)}</p>
            </div>
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
