"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiDownload, FiArrowRight,
  FiGithub, FiLinkedin, FiTwitter, FiGlobe,
  FiInstagram, FiFacebook, FiYoutube,
} from "react-icons/fi";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiNodedotjs, SiPython, SiTailwindcss,
} from "react-icons/si";
import type { Profile, SocialLink } from "@/lib/supabase";

// ─── Iconos de redes sociales ────────────────────────────────────
const socialIconMap: Record<string, React.ElementType> = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  instagram: FiInstagram,
  website: FiGlobe,
  facebook: FiFacebook,
  youtube: FiYoutube,
};

// ─── Iconos flotantes de tecnologías ─────────────────────────────
type FloatingIconPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

type FloatingIcon = FloatingIconPos & {
  Icon: React.ElementType;
  color: string;
  delay: number;
};

const floatingIcons: FloatingIcon[] = [
  { Icon: SiReact, color: "#61DAFB", top: "8%", left: "8%", delay: 0 },
  { Icon: SiJavascript, color: "#F7DF1E", top: "72%", left: "5%", delay: 0.8 },
  { Icon: SiTypescript, color: "#3178C6", top: "48%", right: "2%", delay: 1.6 },
  { Icon: SiNodedotjs, color: "#339933", top: "10%", right: "18%", delay: 1.2 },
  { Icon: SiNextdotjs, color: "#000000", bottom: "12%", right: "14%", delay: 0.4 },
  { Icon: SiPython, color: "#3776AB", bottom: "30%", left: "12%", delay: 2.0 },
  { Icon: SiTailwindcss, color: "#06B6D4", top: "35%", left: "2%", delay: 0.6 },
];

// ─── Variantes de animación ───────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
} as const;

// ─── Props ────────────────────────────────────────────────────────
interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
}

export default function Hero({ profile, socials }: HeroProps) {
  return (
    <section
      id="inicio"
      className="min-h-screen pt-28 pb-16 relative flex flex-col justify-center overflow-hidden"
    >
      {/* Fondo con blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/6 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">

        {/* ── Columna izquierda: texto ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start order-2 md:order-1"
        >
          <motion.span variants={itemVariants} className="section-tag mb-4">
            👋 Bienvenido a mi portafolio
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 mb-4 leading-[1.1] tracking-tight"
          >
            Hola, soy
            <br />
            <span className="gradient-text animate-gradient-x">
              {profile.name || "DanyCode"}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-500 font-medium mb-3"
          >
            {profile.title || "Desarrollador Full Stack"}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-slate-600 text-base mb-8 max-w-lg leading-relaxed"
          >
            {profile.bio ||
              "Apasionado por construir aplicaciones web escalables, con experiencia en tecnologías modernas y diseño centrado en el usuario."}
          </motion.p>

          {/* Botones CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-8"
          >
            {profile.resume_url && profile.resume_url !== "#" && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FiDownload /> Descargar CV
              </a>
            )}
            <Link
              href="#contacto"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
            >
              Contáctame <FiArrowRight />
            </Link>
          </motion.div>

          {/* Redes sociales */}
          {socials.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-slate-400 font-medium mr-1">
                Sígueme:
              </span>
              {socials.map((s) => {
                const Icon = socialIconMap[s.platform] ?? FiGlobe;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label || s.platform}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:shadow-lg border border-slate-100 transition-all hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>
          )}

          {/* Estadísticas rápidas */}
          {(profile.years_experience ||
            profile.projects_count ||
            profile.clients_count) && (
              <motion.div
                variants={itemVariants}
                className="flex gap-6 mt-8 pt-6 border-t border-slate-100 w-full"
              >
                {profile.years_experience ? (
                  <div>
                    <p className="text-2xl font-extrabold gradient-text">
                      {profile.years_experience}+
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Años de exp.
                    </p>
                  </div>
                ) : null}
                {profile.projects_count ? (
                  <div>
                    <p className="text-2xl font-extrabold gradient-text">
                      {profile.projects_count}+
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Proyectos
                    </p>
                  </div>
                ) : null}
                {profile.clients_count ? (
                  <div>
                    <p className="text-2xl font-extrabold gradient-text">
                      {profile.clients_count}+
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Clientes
                    </p>
                  </div>
                ) : null}
              </motion.div>
            )}
        </motion.div>

        {/* ── Columna derecha: avatar + iconos flotantes ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="relative flex justify-center items-center h-[380px] md:h-[500px] order-1 md:order-2"
        >
          {/* Anillo giratorio decorativo */}
          <div
            className="absolute w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border-[2px] border-dashed border-primary/25 animate-spin-smooth"
            style={{ animationDuration: "30s" }}
          />

          {/* Avatar */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl border-[6px] border-white bg-gradient-to-tr from-slate-100 to-primary/10 overflow-hidden z-10">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                <span className="text-6xl">👤</span>
                <span className="text-xs text-slate-400 mt-2 text-center px-4">
                  Sube tu foto desde el Admin
                </span>
              </div>
            )}
          </div>

          {/* Badge de disponibilidad */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute top-6 right-6 md:right-12 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100 flex items-center gap-2 z-20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs font-bold text-slate-700">
              Disponible para trabajar
            </span>
          </motion.div>

          {/* Iconos de tecnologías flotantes */}
          {floatingIcons.map(({ Icon, color, delay, ...pos }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + delay, type: "spring" }}
              className="absolute z-20 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-100 animate-float"
              style={{
                animationDelay: `${delay}s`,
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
              }}
            >
              <Icon size={22} style={{ color }} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-400 font-medium">Desplázate</span>
        <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
