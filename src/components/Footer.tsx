import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail, FiTwitter, FiGlobe, FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";
import type { Profile, SocialLink } from "@/lib/supabase";

const iconMap: Record<string, React.ElementType> = {
  github: FiGithub, linkedin: FiLinkedin, twitter: FiTwitter,
  instagram: FiInstagram, website: FiGlobe, email: FiMail,
  facebook: FiFacebook, youtube: FiYoutube,
};

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "Sobre mí", href: "#sobre-mi" },
  { name: "Experiencia", href: "#experiencia" },
  { name: "Proyectos", href: "#proyectos" },
  { name: "Contacto", href: "#contacto" },
];

interface FooterProps { profile: Profile; socials: SocialLink[] }

export default function Footer({ profile, socials }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">

          {/* Marca */}
          <div>
            <Link href="#inicio" className="text-2xl font-extrabold text-white inline-block mb-3">
              {profile.name || "DanyCode"}<span className="text-primary">.</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {profile.title || "Desarrollador Full Stack"} — construyendo experiencias digitales increíbles.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-5">
                {socials.map((s) => {
                  const Icon = iconMap[s.platform] || FiGlobe;
                  return (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                      title={s.label || s.platform}
                      className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/15 border border-white/8 transition-all hover:-translate-y-0.5"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 text-sm hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto rápido */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <div className="space-y-2.5">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-slate-400 text-sm hover:text-primary transition-colors">
                  <FiMail size={14} /> {profile.email}
                </a>
              )}
              {profile.location && (
                <p className="text-slate-400 text-sm">📍 {profile.location}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs">
            © {year} <span className="text-slate-400">{profile.name || "DanyCode"}</span>. Todos los derechos reservados.
          </p>
          <p className="text-slate-600 text-xs">
            Construido con Next.js & Supabase ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
