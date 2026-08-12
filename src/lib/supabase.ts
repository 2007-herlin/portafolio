import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zzqzhgwlqqdplppoblyt.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_SV6MrwSnWFuO1UM4N4s2Ng_l9FZEGRI";

// Client for use in Client Components
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Server-side client (for Server Components & Server Actions)
export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Storage bucket name
export const STORAGE_BUCKET = "imagenes_portafolio";

// Helper: get public URL of an image from the bucket
export function getStorageUrl(path: string): string {
  if (!path) return "";
  // If it's already a full URL, return as-is
  if (path.startsWith("http")) return path;
  const { data } = supabaseServer.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

// Database types
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
  updated_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order_index: number;
};

export type TechStackItem = {
  id: string;
  name: string;
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
  visible: boolean;
  order_index: number;
  created_at: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  description: string;
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
  message: string;
  read: boolean;
  created_at: string;
};
