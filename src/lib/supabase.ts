import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const STORAGE_BUCKET = "imagenes_portafolio";
export const RESOURCES_BUCKET = "recursos_portafolio";

export function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = supabaseServer.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function getResourceUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = supabaseServer.storage.from(RESOURCES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ===== Tipos =====

export type Profile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar_url: string;
  resume_url: string;
  years_experience?: number;
  projects_count?: number;
  clients_count?: number;
  updated_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  order_index: number;
};

export type TechStackItem = {
  id: string;
  name: string;
  order_index: number;
};

export type Skill = {
  id: string;
  name: string;
  percentage: number;
  color: string;
  category: string;
  order_index: number;
  visible: boolean;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_type: string;
  visible: boolean;
  order_index: number;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  short_desc: string;
  long_desc: string;
  icon: string;
  price_label: string;
  visible: boolean;
  order_index: number;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  github_url: string;
  demo_url: string;
  tags: string[];
  year: string;
  visible: boolean;
  order_index: number;
  created_at: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  side: "left" | "right";
  order_index: number;
};

export type Testimonial = {
  id: string;
  text: string;
  author_name: string;
  author_role: string;
  author_image_url: string;
  rating: number;
  order_index: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};
