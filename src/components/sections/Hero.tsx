"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiDownload, FiArrowRight,
  FiGithub, FiLinkedin, FiTwitter, FiGlobe,
  FiInstagram, FiFacebook, FiYoutube,
} from "react-icons/fi";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiNodedotjs, SiPython, SiArduino,
} from "react-icons/si";
import { Shield, MapPin, CheckCircle } from "lucide-react";
import type { Profile, SocialLink } from "@/lib/supabase";

const socialIconMap: Record<string, React.ElementType> = {
  github: FiGithub, linkedin: FiLinkedin, twitter: FiTwitter,
  instagram: FiInstagram, website: FiGlobe, facebook: FiFacebook, youtube: FiYoutube,
};

type FloatingIcon = { top?: string; bottom?: string; left?: string; right?: string; Icon: React.ElementType; color: string; delay: number; };
const floatingIcons: FloatingIcon[] = [
  { Icon: SiReact,      color: "#1d4ed8", top: "5%",   left: "6%",   delay: 0   },
  { Icon: SiJavascript, color: "#dc2626", top: "68%",  left: "2%",   delay: 0.8 },
  { Icon: SiTypescript, color: "#0ea5e9", top: "45%",  right: "0%",  delay: 1.6 },
  { Icon: SiNodedotjs,  color: "#1d4ed8", top: "8%",   right: "16%", delay: 1.2 },
  { Icon: SiNextdotjs,  color: "#0a0a0a", bottom: "10%", right: "12%", delay: 0.4 },
  { Icon: SiPython,     color: "#0ea5e9", bottom: "28%", left: "10%", delay: 2.0 },
  { Icon: SiArduino,    color: "#dc2626", top: "32%",  left: "0%",   delay: 0.6 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
} as const;

// Fotocheck / ID-card animation
const fotocheckVariants = {
  hidden: { y: -320, rotate: -18, opacity: 0, scale: 0.85 },
  show: {
    y: 0, 
    rotate: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
      mass: 1.2,
      delay: 0.3,
    },
  },
  swing: {
    rotate: [0, 2.5, -2.5, 1.5, -1, 0] as any,
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 1.5 },
  },
};

export default function Hero({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  const cardControls = useAnimationControls();

  useEffect(() => {
    async function seq() {
      await cardControls.start("show");
      cardControls.start("swing");
    }
    seq();
  }, [cardControls]);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(29,78,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Blue orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ===== LEFT: Text ===== */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="order-2 lg:order-1">
            <motion.div variants={itemVariants} className="mb-5">
              <span className="section-tag">
                <motion.span animate={{ rotate: [0, 14, -14, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>👋</motion.span>
                &nbsp;Bienvenido a mi portafolio
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-4 leading-[1.1] tracking-tight">
              Hola, soy
              <br />
              <motion.span
                className="gradient-text inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                {profile.name || "DanyCode"}
              </motion.span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-500 font-semibold mb-3">
              {profile.title || "Desarrollador Full Stack"}
            </motion.p>

            <motion.p variants={itemVariants} className="text-gray-500 text-base mb-8 max-w-lg leading-relaxed">
              {profile.bio || "Apasionado por construir aplicaciones web escalables, con experiencia en tecnologias modernas y diseno centrado en el usuario."}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
              {profile.resume_url && profile.resume_url !== "#" && (
                <motion.a
                  href={profile.resume_url} target="_blank" rel="noopener noreferrer"
                  className="btn-primary"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                >
                  <FiDownload /> Descargar CV
                </motion.a>
              )}
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="#contacto" className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border-2 border-black/10 text-black font-bold hover:border-blue-700 hover:text-blue-700 transition-all shadow-sm">
                  Contactame <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>

            {/* Socials */}
            {socials.length > 0 && (
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 font-medium mr-1">Sigueme:</span>
                {socials.map((s, i) => {
                  const Icon = socialIconMap[s.platform] ?? FiGlobe;
                  return (
                    <motion.a
                      key={s.id}
                      href={s.url} target="_blank" rel="noopener noreferrer" title={s.label || s.platform}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.2, y: -3 }}
                      className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-700 hover:shadow-lg border border-black/8 transition-colors"
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </motion.div>
            )}

            {/* Stats */}
            {(profile.years_experience || profile.projects_count || profile.clients_count) && (
              <motion.div variants={itemVariants} className="flex gap-8 mt-8 pt-6 border-t border-black/6 w-full">
                {[
                  { val: profile.years_experience, label: "Años exp." },
                  { val: profile.projects_count, label: "Proyectos" },
                  { val: profile.clients_count, label: "Clientes" },
                ].filter(s => s.val).map((stat, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.1 }} className="cursor-default">
                    <p className="text-2xl font-extrabold gradient-text">{stat.val}+</p>
                    <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* ===== RIGHT: Fotocheck / ID Card ===== */}
          <div className="relative flex justify-center items-start pt-12 order-1 lg:order-2 min-h-[480px]">

            {/* Cord del fotocheck */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-black/20 to-black/5 rounded-full"
              style={{ height: "60px", transformOrigin: "top" }}
            />
            {/* Clip del fotocheck */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="absolute top-[52px] left-1/2 -translate-x-1/2 z-20 w-8 h-4 bg-black/15 rounded-sm border border-black/20"
            />

            {/* ID CARD / Fotocheck */}
            <motion.div
              variants={fotocheckVariants}
              initial="hidden"
              animate={cardControls}
              className="relative z-10 mt-14"
              style={{ transformOrigin: "top center" }}
            >
              <div className="w-72 bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/10"
                style={{ boxShadow: "0 25px 60px -10px rgba(29,78,216,0.25), 0 8px 20px rgba(0,0,0,0.08)" }}>

                {/* Header de la card */}
                <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 relative overflow-hidden">
                  <motion.div
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]"
                  />
                  <div className="absolute bottom-2 right-4 text-white/20 font-mono text-xs font-bold tracking-widest">PORTFOLIO ID</div>
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }} />
                </div>

                {/* Foto */}
                <div className="flex justify-center -mt-14 mb-4 relative z-10">
                  <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100">
                    {profile.avatar_url ? (
                      <Image src={profile.avatar_url} alt={profile.name} width={112} height={112} className="object-cover w-full h-full" priority />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="px-6 pb-6 text-center">
                  <h3 className="text-xl font-extrabold text-black mb-0.5">{profile.name || "DanyCode"}</h3>
                  <p className="text-sm text-blue-700 font-bold mb-1">{profile.title || "Desarrollador Full Stack"}</p>
                  {profile.location && (
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-3">
                      <MapPin size={11} /> {profile.location}
                    </div>
                  )}

                  {/* Badge disponible */}
                  <motion.div
                    animate={{ boxShadow: ["0 0 0 0 rgba(29,78,216,0)", "0 0 0 6px rgba(29,78,216,0.12)", "0 0 0 0 rgba(29,78,216,0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 mb-4"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-blue-600"
                    />
                    <span className="text-xs font-bold text-blue-700">Disponible para trabajar</span>
                  </motion.div>

                  {/* Stats minibadges */}
                  {(profile.years_experience || profile.projects_count) && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {profile.years_experience && (
                        <div className="bg-black/3 rounded-xl p-2">
                          <p className="text-lg font-extrabold text-black">{profile.years_experience}+</p>
                          <p className="text-xs text-gray-400">Años</p>
                        </div>
                      )}
                      {profile.projects_count && (
                        <div className="bg-black/3 rounded-xl p-2">
                          <p className="text-lg font-extrabold text-black">{profile.projects_count}+</p>
                          <p className="text-xs text-gray-400">Proyectos</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ID bar */}
                  <div className="bg-gradient-to-r from-black via-blue-900 to-black h-8 rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={{ scaleX: [0, 1, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="h-0.5 w-24 bg-white/40 rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-gray-300 font-mono mt-1.5 tracking-widest">
                    {(profile.id || "ID-2024").toString().slice(0, 12).toUpperCase()}
                  </p>
                </div>

                {/* Verified stamp */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: -15 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="absolute top-32 right-3 opacity-30"
                >
                  <div className="border-4 border-blue-700 rounded-lg px-2 py-1">
                    <CheckCircle size={14} className="text-blue-700" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Iconos flotantes de tecnologias */}
            {floatingIcons.map(({ Icon, color, delay, ...pos }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + delay, type: "spring", stiffness: 180 }}
                className="absolute z-20 bg-white rounded-2xl p-2.5 shadow-lg border border-black/8 animate-float"
                style={{ animationDelay: `${delay}s`, top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right }}
                whileHover={{ scale: 1.25, rotate: 10 }}
              >
                <Icon size={22} style={{ color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 font-medium">Desplazate</span>
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-black/15 flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
        </motion.div>
      </motion.div>
    </section>
  );
}
