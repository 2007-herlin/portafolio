"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, STORAGE_BUCKET, getStorageUrl } from "@/lib/supabase";
import type { Profile, SocialLink } from "@/lib/supabase";
import { FiSave, FiUpload, FiPlus, FiTrash2, FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiInstagram } from "react-icons/fi";
import Image from "next/image";

const platformIcons: Record<string, React.ReactNode> = {
  github: <FiGithub />,
  linkedin: <FiLinkedin />,
  twitter: <FiTwitter />,
  instagram: <FiInstagram />,
  website: <FiGlobe />,
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const [{ data: prof }, { data: soc }] = await Promise.all([
        supabase.from("profile").select("*").single(),
        supabase.from("social_links").select("*").order("order_index"),
      ]);
      if (prof) setProfile(prof);
      if (soc) setSocials(soc);
    }
    load();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `avatars/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setProfile({ ...profile, avatar_url: urlData.publicUrl });
    }
    setUploading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profile")
      .upsert({ ...profile, updated_at: new Date().toISOString() });

    if (!error) {
      setMessage("✅ Perfil guardado correctamente.");
    } else {
      setMessage("❌ Error al guardar. Intenta de nuevo.");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const saveSocials = async () => {
    setSaving(true);
    // Delete all and re-insert
    await supabase.from("social_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    for (let i = 0; i < socials.length; i++) {
      const { id, ...rest } = socials[i];
      await supabase.from("social_links").upsert({ ...rest, order_index: i, id });
    }
    setMessage("✅ Redes sociales guardadas.");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const addSocial = () => {
    setSocials([...socials, { id: crypto.randomUUID(), platform: "website", url: "", icon: "website", order_index: socials.length }]);
  };

  const removeSocial = (id: string) => setSocials(socials.filter((s) => s.id !== id));

  const updateSocial = (id: string, field: keyof SocialLink, value: string) => {
    setSocials(socials.map((s) => (s.id === id ? { ...s, [field]: value, icon: field === "platform" ? value : s.icon } : s)));
  };

  if (!profile) return <div className="text-slate-500 animate-pulse">Cargando perfil...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-extrabold text-slate-800">Perfil & Redes Sociales</h1>

      {message && (
        <div className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium">{message}</div>
      )}

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-700 mb-4">Foto de Perfil</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
            {profile.avatar_url ? (
              <Image src={getStorageUrl(profile.avatar_url)} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">👤</div>
            )}
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              <FiUpload /> {uploading ? "Subiendo..." : "Subir imagen"}
            </button>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG o WebP. Max 5MB.</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-700 mb-2">Información Personal</h2>

        {[
          { label: "Nombre / Marca", field: "name" as keyof Profile, placeholder: "DanyCode" },
          { label: "Título / Rol", field: "title" as keyof Profile, placeholder: "Full Stack Developer" },
          { label: "Email de contacto", field: "email" as keyof Profile, placeholder: "dany@example.com" },
          { label: "Teléfono", field: "phone" as keyof Profile, placeholder: "+1 (234) 567-890" },
          { label: "Ubicación", field: "location" as keyof Profile, placeholder: "Bogotá, Colombia" },
          { label: "URL del CV (PDF)", field: "resume_url" as keyof Profile, placeholder: "https://..." },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
            <input
              type="text"
              value={(profile[field] as string) || ""}
              onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
              placeholder={placeholder}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bio</label>
          <textarea
            rows={4}
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Cuéntale al mundo quién eres..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 disabled:opacity-60 transition-all"
        >
          <FiSave /> {saving ? "Guardando..." : "Guardar Perfil"}
        </button>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-700">Redes Sociales</h2>
          <button
            onClick={addSocial}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <FiPlus /> Agregar
          </button>
        </div>

        <div className="space-y-3">
          {socials.map((social) => (
            <div key={social.id} className="flex items-center gap-3">
              <select
                value={social.platform}
                onChange={(e) => updateSocial(social.id, "platform", e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-primary"
              >
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
              </select>
              <input
                type="url"
                value={social.url}
                onChange={(e) => updateSocial(social.id, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-primary"
              />
              <button onClick={() => removeSocial(social.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={saveSocials}
          disabled={saving}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 disabled:opacity-60 transition-all"
        >
          <FiSave /> Guardar Redes
        </button>
      </div>
    </div>
  );
}
