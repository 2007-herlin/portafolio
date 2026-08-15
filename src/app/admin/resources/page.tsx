"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, RESOURCES_BUCKET } from "@/lib/supabase";
import type { Resource } from "@/lib/supabase";
import { useDropzone } from "react-dropzone";
import {
  Upload, Plus, Trash2, Eye, EyeOff, Save, Loader2,
  CheckCircle, AlertTriangle, FolderOpen, FileText, Link2, X,
  File, Image as ImageIcon, FileArchive
} from "lucide-react";

const CATEGORIES = ["certificado", "cv", "portafolio", "otro"];

// Todos los tipos de archivo aceptados
const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/svg+xml": [".svg"],
  "text/csv": [".csv"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "text/plain": [".txt"],
};

const MAX_SIZE_MB = 50;

function getFileIcon(type: string) {
  if (["png","jpg","jpeg","webp","gif","svg"].includes(type)) return ImageIcon;
  if (["zip","rar"].includes(type)) return FileArchive;
  if (type === "pdf") return FileText;
  return File;
}

type Toast = { type: "success" | "error" | "info"; msg: string } | null;
function Toaster({ t }: { t: Toast }) {
  if (!t) return null;
  const bg = t.type === "success" ? "bg-blue-700" : t.type === "info" ? "bg-sky-600" : "bg-red-600";
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold max-w-sm ${bg}`}>
      {t.type === "success" ? <CheckCircle size={16} /> : t.type === "info" ? <Loader2 size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
      {t.msg}
    </div>
  );
}

const emptyResource = (): Omit<Resource, "id" | "created_at"> => ({
  title: "", description: "", category: "otro",
  file_url: "", file_type: "pdf", visible: true, order_index: 0,
});

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyResource());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const showToast = (type: "success" | "error" | "info", msg: string, dur = 3500) => {
    setToast({ type, msg });
    if (dur > 0) setTimeout(() => setToast(null), dur);
  };

  useEffect(() => {
    supabase.from("resources").select("*").order("order_index").then(({ data }) => {
      if (data) setResources(data);
      setLoading(false);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors?.[0];
      if (err?.code === "file-too-large") showToast("error", `El archivo supera el límite de ${MAX_SIZE_MB}MB.`);
      else showToast("error", `Tipo de archivo no permitido: ${rejectedFiles[0].file.name}`);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > MAX_SIZE_MB) {
      showToast("error", `El archivo pesa ${sizeMB.toFixed(1)}MB. Máximo ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    showToast("info", "Subiendo archivo...", 0);

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `uploads/${Date.now()}_${cleanName}`;

    setUploadProgress(`Subiendo ${file.name} (${sizeMB.toFixed(1)}MB)...`);

    const { data, error } = await supabase.storage
      .from(RESOURCES_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    setUploading(false);
    setUploadProgress("");

    if (error) {
      console.error("Storage error:", error);
      if (error.message.includes("row-level security") || error.message.includes("policy")) {
        showToast("error", "Error de permisos en el bucket. Ve al SQL de Supabase y ejecuta las políticas de Storage.");
      } else if (error.message.includes("Bucket not found")) {
        showToast("error", "Bucket 'recursos_portafolio' no encontrado. Créalo en Supabase Storage.");
      } else {
        showToast("error", `Error al subir: ${error.message}`);
      }
      return;
    }

    const { data: pub } = supabase.storage.from(RESOURCES_BUCKET).getPublicUrl(data.path);
    setForm((prev) => ({
      ...prev,
      file_url: pub.publicUrl,
      file_type: ext,
      title: prev.title || file.name.replace(`.${ext}`, "").replace(/_/g, " "),
    }));
    showToast("success", "Archivo subido correctamente");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    disabled: uploading,
  });

  const saveResource = async () => {
    if (!form.title.trim() || !form.file_url.trim()) {
      showToast("error", "Titulo y archivo/URL son obligatorios");
      return;
    }
    setSaving(true);
    const idx = resources.length > 0 ? Math.max(...resources.map((r) => r.order_index)) + 1 : 1;
    const { data, error } = await supabase.from("resources").insert({ ...form, order_index: idx }).select().single();
    setSaving(false);
    if (error) { showToast("error", `Error al guardar: ${error.message}`); return; }
    if (data) setResources((prev) => [...prev, data]);
    setForm(emptyResource());
    setAdding(false);
    setUrlMode(false);
    showToast("success", "Recurso agregado");
  };

  const toggleVisible = async (res: Resource) => {
    const { error } = await supabase.from("resources").update({ visible: !res.visible }).eq("id", res.id);
    if (!error) setResources((prev) => prev.map((r) => r.id === res.id ? { ...r, visible: !r.visible } : r));
  };

  const deleteResource = async (res: Resource) => {
    if (!confirm(`¿Eliminar "${res.title}"?`)) return;
    await supabase.from("resources").delete().eq("id", res.id);
    setResources((prev) => prev.filter((r) => r.id !== res.id));
    showToast("success", "Eliminado");
  };

  return (
    <div className="max-w-4xl">
      <Toaster t={toast} />

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <FolderOpen size={22} className="text-blue-700" /> Recursos
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">PDFs, imágenes, documentos. Máx. {MAX_SIZE_MB}MB por archivo.</p>
        </div>
        <button onClick={() => { setAdding(true); setForm(emptyResource()); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
          <Plus size={16} /> Nuevo recurso
        </button>
      </div>

      {/* Info box sobre políticas de bucket */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-xs text-amber-800">
        <strong>⚠ Si tienes error al subir:</strong> Ve a Supabase → SQL Editor y ejecuta:<br />
        <code className="bg-amber-100 px-1 rounded text-[11px]">
          CREATE POLICY &quot;Auth upload resources&quot; ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = &apos;recursos_portafolio&apos;);
        </code><br />
        <code className="bg-amber-100 px-1 rounded text-[11px]">
          CREATE POLICY &quot;Public read resources&quot; ON storage.objects FOR SELECT USING (bucket_id = &apos;recursos_portafolio&apos;);
        </code>
      </div>

      {/* Form */}
      {adding && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-blue-800 text-sm">Nuevo Recurso</h3>
            <button onClick={() => setAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input className="field" placeholder="Título *" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            <select className="field" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <textarea className="field mb-4 resize-none" rows={2} placeholder="Descripción (opcional)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />

          {/* Toggle subir / URL */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setUrlMode(false)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${!urlMode ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-600 border-slate-200"}`}>
              <Upload size={11} className="inline mr-1" /> Subir archivo
            </button>
            <button onClick={() => setUrlMode(true)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${urlMode ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-600 border-slate-200"}`}>
              <Link2 size={11} className="inline mr-1" /> Pegar URL
            </button>
          </div>

          {urlMode ? (
            <div className="mb-4 space-y-2">
              <input className="field" placeholder="https://... URL del archivo" value={form.file_url} onChange={(e) => setForm((p) => ({ ...p, file_url: e.target.value }))} />
              <input className="field" placeholder="Extensión del archivo (pdf, png, docx...)" value={form.file_type} onChange={(e) => setForm((p) => ({ ...p, file_type: e.target.value.toLowerCase() }))} />
            </div>
          ) : (
            <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 select-none ${isDragActive ? "border-blue-500 bg-blue-100" : "border-blue-300 hover:border-blue-500 bg-blue-50/50"} ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}>
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <Loader2 size={30} className="animate-spin" />
                  <p className="text-sm font-bold">Subiendo...</p>
                  {uploadProgress && <p className="text-xs text-slate-500">{uploadProgress}</p>}
                </div>
              ) : form.file_url && !urlMode ? (
                <div className="flex flex-col items-center gap-1 text-blue-700">
                  <CheckCircle size={30} />
                  <p className="text-sm font-bold">Archivo listo</p>
                  <p className="text-xs text-slate-400 truncate max-w-xs">{form.file_url.split("/").pop()}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Upload size={30} className="text-blue-400" />
                  <p className="text-sm font-semibold text-slate-600">Arrastra o haz clic para seleccionar</p>
                  <p className="text-xs">PDF, PNG, JPG, WEBP, CSV, DOC, DOCX, XLS, PPTX, ZIP, TXT...</p>
                  <p className="text-xs font-bold text-blue-600">Máx. {MAX_SIZE_MB}MB</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))} className="accent-blue-700 w-4 h-4" />
              Visible en el portafolio
            </label>
            <div className="flex gap-2">
              <button onClick={() => { setAdding(false); setUrlMode(false); }} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50">Cancelar</button>
              <button onClick={saveResource} disabled={saving || uploading} className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 disabled:opacity-60">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-700" size={28} /></div>
      ) : resources.length === 0 && !adding ? (
        <div className="text-center py-20 text-slate-300">
          <FolderOpen size={52} className="mx-auto mb-3" />
          <p className="font-semibold text-slate-400">Sin recursos. Agrega el primero.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((res) => {
            const Icon = getFileIcon(res.file_type);
            return (
              <div key={res.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Icon size={18} className="text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{res.title}</p>
                  <p className="text-xs text-slate-400">{res.file_type.toUpperCase()} · {res.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleVisible(res)} className={`p-2 rounded-xl border transition-colors ${res.visible ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                    {res.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
                    <Link2 size={15} />
                  </a>
                  <button onClick={() => deleteResource(res)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        .field { width: 100%; padding: 0.55rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.875rem; background: white; color: #1e293b; outline: none; transition: border-color 0.2s; }
        .field:focus { border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(29,78,216,0.08); }
      `}</style>
    </div>
  );
}
