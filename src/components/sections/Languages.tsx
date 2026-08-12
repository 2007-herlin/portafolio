"use client";

import { motion } from "framer-motion";

const languages = [
  { code: "EN", name: "English", percentage: 95, color: "#38bdf8" },
  { code: "ES", name: "Spanish", percentage: 100, color: "#818cf8" },
  { code: "FR", name: "French", percentage: 30, color: "#34d399" },
  { code: "DE", name: "German", percentage: 15, color: "#fbbf24" }
];

export default function Languages() {
  return (
    <section id="languages" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 w-full flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            Languages I <span className="text-primary">Speak</span>
          </h2>
          <p className="text-slate-500">Communicating with the world in multiple languages</p>
        </motion.div>

        {/* Circular Progress Rings */}
        <div className="flex flex-wrap justify-center gap-12 w-full">
          {languages.map((lang, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-sm mb-4">
                {/* SVG Ring Background */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* SVG Ring Foreground */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={lang.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="351.8"
                    initial={{ strokeDashoffset: 351.8 }}
                    whileInView={{ strokeDashoffset: 351.8 - (351.8 * lang.percentage) / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-slate-700 leading-none">{lang.code}</span>
                  <span className="text-xs font-semibold text-slate-400 mt-1">{lang.percentage}%</span>
                </div>
              </div>
              <span className="text-slate-600 font-medium">{lang.name}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
