"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { FiMapPin, FiMail, FiPhone, FiArrowRight } from "react-icons/fi";
import type { Profile } from "@/lib/supabase";

interface AboutProps { profile: Profile }

function StatCard({ value, label, delay }: { value: string | number; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="counter-badge"
    >
      <span className="text-3xl font-extrabold gradient-text leading-none">{value}+</span>
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1 text-center">{label}</span>
    </motion.div>
  );
}

export default function About({ profile }: AboutProps) {
  const infoItems = [
    profile.email && { icon: FiMail, label: "Correo", value: profile.email },
    profile.phone && { icon: FiPhone, label: "Teléfono", value: profile.phone },
    profile.location && { icon: FiMapPin, label: "Ubicación", value: profile.location },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <section id="sobre-mi" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 -translate-y-1/2 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            {/* Decoración de fondo */}
            <div className="absolute -top-4 -left-4 w-full h-full rounded-[2rem] border-2 border-primary/20" />
            <div className="w-72 h-80 md:w-80 md:h-96 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 relative">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl text-slate-200">👤</div>
              )}
            </div>
            {/* Badge experiencia */}
            {profile.years_experience && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl px-5 py-3 shadow-xl"
              >
                <p className="text-2xl font-extrabold leading-none">{profile.years_experience}+</p>
                <p className="text-xs font-medium opacity-80 mt-0.5">Años de<br/>experiencia</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="section-tag">Sobre mí</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
            Un poco de <span className="gradient-text">quién soy</span>
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {profile.bio || "Soy un desarrollador apasionado por crear experiencias digitales increíbles."}
          </p>

          {/* Info personal */}
          {infoItems.length > 0 && (
            <div className="space-y-3 mb-8">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</span>
                    <p className="text-slate-700 font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {(profile.projects_count || profile.clients_count || profile.years_experience) && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {profile.years_experience && <StatCard value={profile.years_experience} label="Años exp." delay={0} />}
              {profile.projects_count && <StatCard value={profile.projects_count} label="Proyectos" delay={0.1} />}
              {profile.clients_count && <StatCard value={profile.clients_count} label="Clientes" delay={0.2} />}
            </div>
          )}

          <a href="#contacto" className="btn-primary inline-flex">
            Trabajemos juntos <FiArrowRight />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
