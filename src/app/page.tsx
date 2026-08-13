// Forzar renderizado dinámico en cada request (datos siempre frescos desde Supabase)
export const revalidate = 0;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Languages from "@/components/sections/Languages";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import TechStackBanner from "@/components/TechStackBanner";
import { supabaseServer } from "@/lib/supabase";
import type {
  Profile, TechStackItem, Project, Testimonial,
  Experience as ExperienceType, SocialLink,
} from "@/lib/supabase";

const defaultProfile: Profile = {
  id: "",
  name: "DanyCode",
  title: "Desarrollador Full Stack",
  bio: "Apasionado por construir aplicaciones web escalables y experiencias digitales increíbles.",
  email: "contacto@danycode.dev",
  phone: "",
  location: "Remoto / Disponible Globalmente",
  avatar_url: "",
  resume_url: "",
  years_experience: undefined,
  projects_count: undefined,
  clients_count: undefined,
  updated_at: "",
};

export default async function Home() {
  const [
    { data: profileData },
    { data: techStackData },
    { data: projectsData },
    { data: testimonialsData },
    { data: experienceData },
    { data: socialsData },
  ] = await Promise.all([
    supabaseServer.from("profile").select("*").single(),
    supabaseServer.from("tech_stack").select("*").order("order_index"),
    supabaseServer.from("projects").select("*").eq("visible", true).order("order_index"),
    supabaseServer.from("testimonials").select("*").order("order_index"),
    supabaseServer.from("experience").select("*").order("order_index"),
    supabaseServer.from("social_links").select("*").order("order_index"),
  ]);

  const profile: Profile = profileData ? { ...defaultProfile, ...profileData } : defaultProfile;
  const techStack: TechStackItem[] = techStackData || [];
  const projects: Project[] = projectsData || [];
  const testimonials: Testimonial[] = testimonialsData || [];
  const experiences: ExperienceType[] = experienceData || [];
  const socials: SocialLink[] = socialsData || [];

  return (
    <>
      <Navbar profile={profile} socials={socials} />
      <main className="flex-1 pt-16 min-h-screen">
        <Hero profile={profile} socials={socials} />
        <TechStackBanner techs={techStack} />
        <About profile={profile} />
        <Experience experiences={experiences} />
        <Languages />
        <Projects projects={projects} />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer profile={profile} socials={socials} />
    </>
  );
}
