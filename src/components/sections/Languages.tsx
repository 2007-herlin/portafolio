"use client";

import { motion } from "framer-motion";

const languages = [
  { code: "ES", name: "Español", percentage: 100, color: "#6366f1" },
  { code: "EN", name: "Inglés", percentage: 85, color: "#ec4899" },
  { code: "FR", name: "Francés", percentage: 30, color: "#14b8a6" },
];

const skills = [
  { name: "Frontend", percentage: 90, color: "#6366f1" },
  { name: "Backend", percentage: 80, color: "#ec4899" },
  { name: "Base de Datos", percentage: 75, color: "#14b8a6" },
  { name: "DevOps / Cloud", percentage: 60, color: "#f59e0b" },
];

function CircleProgress({ code, name, percentage, color }: { code: string; name: string; percentage: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-sm">
        <svg className="absolute w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={r} stroke="#f1f5f9" strokeWidth="8" fill="none" />
          <motion.circle
            cx="64" cy="64" r={r} stroke={color} strokeWidth="8" fill="none"
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - (circ * percentage) / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
        </svg>
        <div className="text-center z-10">
          <span className="text-xl font-extrabold text-slate-700 leading-none">{code}</span>
          <span className="block text-xs font-semibold mt-0.5" style={{ color }}>{percentage}%</span>
        </div>
      </div>
      <span className="text-slate-600 font-semibold text-sm mt-3">{name}</span>
    </motion.div>
  );
}

function SkillBar({ name, percentage, color }: { name: string; percentage: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">{name}</span>
        <span className="text-sm font-bold" style={{ color }}>{percentage}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function Languages() {
  return (
    <section id="habilidades" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-tag">💡 Habilidades</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2">
            Mis <span className="gradient-text">Capacidades</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">Idiomas y áreas de especialización</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 w-full items-start">
          {/* Idiomas */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-8 text-center md:text-left">🌐 Idiomas</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              {languages.map((l) => <CircleProgress key={l.code} {...l} />)}
            </div>
          </div>

          {/* Habilidades técnicas */}
          <div>
            <h3 className="text-lg font-bold text-slate-700 mb-8">⚡ Áreas Técnicas</h3>
            <div className="flex flex-col gap-5">
              {skills.map((s) => <SkillBar key={s.name} {...s} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
