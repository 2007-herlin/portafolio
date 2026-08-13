"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import type { Profile, SocialLink } from "@/lib/supabase";
import {
  FiSave, FiUpload, FiLoader, FiCheckCircle, FiAlertTriangle,
  FiUser, FiGlobe, FiPlus, FiTrash2, FiArrowUp, FiArrowDown,
  FiLink, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiFacebook,
  FiYoutube, FiEdit2, FiEye, FiEyeOff
} from "react-icons/fi";
import Image from "next/image";

const PLATFORM_OPTIONS = [
  { value: "github", label: "GitHub", icon: "🐙" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "twitter", label: "Twitter / X", icon: "🐦" },
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "youtube", label: "YouTube", icon: "📺" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "twitch", label: "Twitch", icon: "🎮" },
  { value: "discord", label: "Discord", icon: "💬" },
  { value: "telegram", label: "Telegram", icon: "✈️" },
  { value: "whatsapp", label: "WhatsApp", icon: "💚" },
  { value: "behance", label: "Behance", icon: "🎨" },
  { value: "dribbble", label: "Dribbble", icon: "🏀" },
  { value: "website", label: "Sitio Web", icon: "🌐" },
  { value: "email", label: "Correo", icon: "📧" },
  { value: "otro", label: "Otro", icon: "🔗" },
];

const defaultProfile: Profile = {
  id: "", name: "DanyCode", title: "Desarrollador Full Stack",
  bio: "", email: "", phone: "", location: "",
  avatar_url: "", resume_url: "",
  years_experience: 0, projects_count: 0, clients_count: 0,
  updated_at: "",
};

type Toast = { type: "success" | "error"; msg: string } | null;

function Toast({ toast }: { toast: Toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-xs ${
      toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
    }`}>
      {toast.type === "success" ? <FiCheckCircle size={18} /> : <FiAlertTriangle size={18} />}
      {toast.msg}
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [activeTab, setActiveTab] = useState<"perfil" | "redes">("perfil");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profile").select("*").single(),
        supabase.from("social_links").select("*").order("order_index"),
      ]);
      if (p) setProfile({ ...defaultProfile, ...p });
      if (s) setSocials(s);
    }
    load();
  }, []);

  // ─── Perfil ──────────────────────────────────────────────────────
  const handleField = (key: keyof Profile, val: string | number) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/avatar_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    } else {
      showToast("error", "Error al subir la imagen.");
    }
    setUploading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const payload = { ...profile, updated_at: new Date().toISOString() };
    const { error } = profile.id
      ? await supabase.from("profile").update(payload).eq("id", profile.id)
      : await supabase.from("profile").insert(payload);
    if (!error) showToast("success", "Perfil guardado correctamente.");
    else showToast("error", "Error al guardar. Intenta de nuevo.");
    setSaving(false);
  };

  // ─── Redes Sociales ───────────────────────────────────────────────
  const addSocial = () => {
    const newSocial: SocialLink = {
      id: crypto.randomUUID(),
      platform: "github", label: "", url: "", icon: "",
      order_index: socials.length,
    };
    setSocials((prev) => [...prev, newSocial]);
  };

  const updateSocial = (id: string, key: keyof SocialLink, val: string | number) => {
    setSocials((prev) => prev.map((s) => s.id === id ? { ...s, [key]: val } : s));
  };

  const removeSocial = async (id: string) => {
    setSocials((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("social_links").delete().eq("id", id);
  };

  const moveSocial = (id: string, dir: -1 | 1) => {
    const idx = socials.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= socials.length) return;
    const arr = [...socials];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setSocials(arr.map((s, i) => ({ ...s, order_index: i })));
  };

  const saveSocials = async () => {
    setSaving(true);
    const { error } = await supabase.from("social_links").upsert(
      socials.map((s, i) => ({ ...s, order_index: i }))
    );
    if (!error) showToast("success", "Redes sociales guardadas.");
    else showToast("error", "Error al guardar redes. Intenta de nuevo.");
    setSaving(false);
  };

  const tabs = [
    { key: "perfil" as const, label: "Perfil e Información", icon: FiUser },
    { key: "redes" as const, label: "Redes Sociales", icon: FiGlobe },
  ];

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-slate-300";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-3xl">
      <Toast toast={toast} />

      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-slate-800">Perfil & Redes Sociales</h1>
        <p className="text-slate-400 text-sm mt-1">Administra tu información personal y cuentas de redes sociales.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 rounded-2xl p-1.5 mb-7 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Perfil ── */}
      {activeTab === "perfil" && (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-700 mb-5 flex items-center gap-2"><FiUser size={16} className="text-primary" /> Foto de Perfil</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">👤</div>
                )}
              </div>
              <div>
                <button onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-semibold hover:border-primary hover:text-primary transition-all disabled:opacity-60"
                >
                  {uploading ? <FiLoader className="animate-spin" /> : <FiUpload size={14} />}
                  {uploading ? "Subiendo..." : "Subir nueva foto"}
                </button>
                <p className="text-xs text-slate-400 mt-2">JPG, PNG o WEBP. Máx 5MB.</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-700 mb-5 flex items-center gap-2"><FiEdit2 size={16} className="text-primary" /> Información Básica</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Nombre completo</label>
                <input type="text" value={profile.name} onChange={(e) => handleField("name", e.target.value)} placeholder="Tu nombre" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Título profesional</label>
                <input type="text" value={profile.title} onChange={(e) => handleField("title", e.target.value)} placeholder="Ej: Desarrollador Full Stack" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input type="email" value={profile.email} onChange={(e) => handleField("email", e.target.value)} placeholder="tu@correo.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input type="tel" value={profile.phone} onChange={(e) => handleField("phone", e.target.value)} placeholder="+57 300 000 0000" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Ubicación</label>
                <input type="text" value={profile.location} onChange={(e) => handleField("location", e.target.value)} placeholder="Ciudad, País" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Biografía / Descripción</label>
                <textarea rows={4} value={profile.bio} onChange={(e) => handleField("bio", e.target.value)} placeholder="Cuéntanos sobre ti..." className={inputClass + " resize-none"} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>URL del CV / Portafolio</label>
                <input type="url" value={profile.resume_url} onChange={(e) => handleField("resume_url", e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-700 mb-2 flex items-center gap-2">📊 Estadísticas de Logros</h2>
            <p className="text-xs text-slate-400 mb-5">Estos números aparecen en la sección Hero y Sobre mí.</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Años exp.</label>
                <input type="number" min={0} value={profile.years_experience || ""} onChange={(e) => handleField("years_experience", parseInt(e.target.value) || 0)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Proyectos</label>
                <input type="number" min={0} value={profile.projects_count || ""} onChange={(e) => handleField("projects_count", parseInt(e.target.value) || 0)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Clientes</label>
                <input type="number" min={0} value={profile.clients_count || ""} onChange={(e) => handleField("clients_count", parseInt(e.target.value) || 0)} placeholder="0" className={inputClass} />
              </div>
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
          >
            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Guardar Perfil
          </button>
        </div>
      )}

      {/* ── Tab: Redes Sociales ── */}
      {activeTab === "redes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Agrega todas las redes sociales que quieras. Se mostrarán en el portafolio.</p>
            <button onClick={addSocial}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:-translate-y-0.5 transition-all shadow-md shadow-primary/30"
            >
              <FiPlus size={14} /> Agregar
            </button>
          </div>

          {socials.length === 0 && (
            <div className="text-center py-14 bg-white rounded-2xl border border-slate-100 text-slate-400">
              <FiGlobe size={36} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">No hay redes sociales aún.</p>
              <p className="text-sm mt-1">Haz clic en "Agregar" para añadir una.</p>
            </div>
          )}

          {socials.map((s, idx) => {
            const platform = PLATFORM_OPTIONS.find((p) => p.value === s.platform);
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{platform?.icon || "🔗"}</span>
                    <span className="font-bold text-slate-700 text-sm">{platform?.label || s.platform}</span>
                    <span className="text-xs text-slate-400">#{idx + 1}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveSocial(s.id, -1)} disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"><FiArrowUp size={14} /></button>
                    <button onClick={() => moveSocial(s.id, 1)} disabled={idx === socials.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"><FiArrowDown size={14} /></button>
                    <button onClick={() => removeSocial(s.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 size={14} /></button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Plataforma</label>
                    <select value={s.platform} onChange={(e) => updateSocial(s.id, "platform", e.target.value)}
                      className={inputClass}
                    >
                      {PLATFORM_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Etiqueta (opcional)</label>
                    <input type="text" value={s.label} onChange={(e) => updateSocial(s.id, "label", e.target.value)}
                      placeholder="Ej: @miusuario" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>URL</label>
                    <input type="url" value={s.url} onChange={(e) => updateSocial(s.id, "url", e.target.value)}
                      placeholder="https://..." className={inputClass} />
                  </div>
                </div>
              </div>
            );
          })}

          {socials.length > 0 && (
            <button onClick={saveSocials} disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
            >
              {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Guardar Redes Sociales
            </button>
          )}
        </div>
      )}
    </div>
  );
}
