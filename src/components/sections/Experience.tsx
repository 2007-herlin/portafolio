"use client";

import { motion } from "framer-motion";
import type { Experience as ExperienceType } from "@/lib/supabase";
import { FiBriefcase, FiCalendar } from "react-icons/fi";

interface ExperienceProps { experiences: ExperienceType[] }

const defaults: ExperienceType[] = [
  { id: "1", title: "Desarrollador Full Stack", company: "Tu Empresa", description: "Agrega tu experiencia desde el panel de Admin.", start_date: "2023", end_date: "", current: true, side: "left", order_index: 0 },
  { id: "2", title: "Ingeniería de Sistemas", company: "Tu Universidad", description: "Agrega tu educación desde el panel de Admin.", start_date: "2019", end_date: "2023", current: false, side: "right", order_index: 1 },
];

function ExperienceCard({ exp, side, index }: { exp: ExperienceType; side: "left" | "right"; index: number }) {
  const dateLabel = exp.current
    ? `${exp.start_date} — Actualidad`
    : exp.end_date
    ? `${exp.start_date} — ${exp.end_date}`
    : exp.start_date;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group ${
        side === "right" ? "md:text-right" : ""
      }`}
    >
      {/* Glow hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {exp.current && (
        <span className={`inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-3 ${side === "right" ? "md:ml-auto" : ""}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Actual
        </span>
      )}

      <div className={`flex items-center gap-2 mb-1 ${side === "right" ? "md:justify-end" : ""}`}>
        <FiCalendar size={12} className="text-slate-400" />
        <span className="text-xs text-slate-400 font-medium">{dateLabel}</span>
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-0.5">{exp.title}</h3>
      <h4 className="text-sm font-semibold text-primary mb-3">{exp.company}</h4>
      {exp.description && <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>}
    </motion.div>
  );
}

export default function Experience({ experiences }: ExperienceProps) {
  const items = experiences.length > 0 ? experiences : defaults;
  const left = items.filter((e) => e.side === "left");
  const right = items.filter((e) => e.side === "right");
  const maxLen = Math.max(left.length, right.length);

  return (
    <section id="experiencia" className="py-24 relative bg-white/50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-tag"><FiBriefcase size={12} /> Trayectoria</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 leading-tight">
            Mi <span className="gradient-text">Experiencia</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">Mi recorrido profesional y formación académica</p>
        </motion.div>

        {/* Timeline desktop */}
        <div className="w-full relative">
          {/* Línea central (solo desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-secondary/30 to-transparent" />

          {Array.from({ length: maxLen }).map((_, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_60px_1fr] gap-4 mb-8 items-center">
              {/* Izquierda */}
              {left[i] ? (
                <ExperienceCard exp={left[i]} side="left" index={i} />
              ) : (
                <div className="hidden md:block" />
              )}

              {/* Punto central */}
              <div className="hidden md:flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary shadow-md ring-4 ring-white"
                />
              </div>

              {/* Derecha */}
              {right[i] ? (
                <ExperienceCard exp={right[i]} side="right" index={i} />
              ) : (
                <div className="hidden md:block" />
              )}
            </div>
          ))}

          {/* Mobile: lista simple */}
          <div className="md:hidden space-y-4 mt-4">
            {items.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} side="left" index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
