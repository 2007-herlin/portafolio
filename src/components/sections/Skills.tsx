"use client";

import { motion } from "framer-motion";
import { FiCode, FiCpu, FiGlobe, FiGitBranch, FiTrendingUp } from "react-icons/fi";

const skillCategories = [
  {
    title: "Software & Full-Stack",
    icon: FiCode,
    color: "from-cyan-500 to-blue-500",
    glow: "rgba(6, 182, 212, 0.4)",
    skills: [
      { name: "React / Next.js", level: 90 },
      { name: "TypeScript / JavaScript", level: 88 },
      { name: "Python (APIs / FastAPI)", level: 82 },
      { name: "Bases de Datos (SQL, NoSQL, Firestore)", level: 85 },
      { name: "Node.js (Express / NestJS)", level: 80 },
    ],
  },
  {
    title: "Electrónica & Hardware",
    icon: FiCpu,
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(16, 185, 129, 0.4)",
    skills: [
      { name: "C/C++ (Arduino, ESP32, STM32)", level: 88 },
      { name: "Diseño de PCB (KiCAD / Altium)", level: 75 },
      { name: "Circuitos Analógicos & Digitales", level: 80 },
      { name: "Sistemas Embebidos & ARM Cortex", level: 72 },
      { name: "Robótica & Control Real-Time", level: 78 },
    ],
  },
  {
    title: "Redes, IoT & Protocolos",
    icon: FiGlobe,
    color: "from-blue-500 to-purple-500",
    glow: "rgba(59, 130, 246, 0.4)",
    skills: [
      { name: "Protocolos IoT (MQTT, HTTP, WebSockets)", level: 85 },
      { name: "Buses Industriales (I2C, SPI, UART, RS485)", level: 80 },
      { name: "Linux / Bash Scripting", level: 78 },
      { name: "Git / GitHub / CI-CD", level: 85 },
      { name: "Docker & Cloud Services", level: 70 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 relative bg-black/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4">
            Habilidades <span className="text-primary glow-text-primary">Técnicas</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg font-mono leading-relaxed">
            Mi stack de desarrollo abarca el ciclo completo, desde el silicio de un microcontrolador hasta los contenedores en la nube.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          {skillCategories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: catIndex * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex flex-col h-full group"
              >
                {/* Title and Icon */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`} style={{ boxShadow: `0 0 15px ${category.glow}` }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-white group-hover:text-primary-light transition-colors">
                    {category.title}
                  </h3>
                </div>

                {/* Progress bars list */}
                <div className="space-y-6 flex-grow">
                  {category.skills.map((skill, index) => (
                    <div key={skill.name} className="group/bar">
                      <div className="flex justify-between mb-2">
                        <span className="font-mono text-sm font-medium text-foreground/90 group-hover/bar:text-white transition-colors">
                          {skill.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-primary-light bg-primary/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                          {skill.level}%
                        </span>
                      </div>
                      
                      {/* Outer track */}
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                        {/* Dynamic glow overlay on hover */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300"></div>

                        {/* Fill */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full relative`}
                        >
                          {/* Inner shimmer animation */}
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Shimmer animation CSS (inlined here via styling if needed or rely on custom keyframe) */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
