"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiCpu, FiWifi, FiTrendingUp } from "react-icons/fi";
import Image from "next/image";

const projects = [
  {
    title: "IoT Smart GreenHouse",
    description: "Invernadero inteligente automatizado. Un ESP32 lee sensores de humedad del suelo, temperatura y luz, y transmite datos vía MQTT a un servidor Node.js/Next.js con sincronización en tiempo real y almacenamiento en Firebase.",
    image: "https://images.unsplash.com/photo-1530840097479-919585772ad8?auto=format&fit=crop&q=80&w=800",
    tags: ["ESP32", "Next.js", "MQTT", "Firestore", "React"],
    icon: FiWifi,
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Web SCADA Dashboard",
    description: "Panel SCADA web para supervisar PLCs industriales. Lee registros a través de protocolo Modbus TCP en tiempo real y los expone mediante WebSockets en una interfaz React interactiva con alertas instantáneas.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "WebSockets", "Modbus TCP", "React", "Docker"],
    icon: FiCpu,
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "Smart Power Grid Monitor",
    description: "Analizador de redes eléctricas en tiempo real basado en un microcontrolador STM32 (ARM Cortex-M4). Calcula factor de potencia, armónicos y consumo activo/reactivo, enviando telemetría por redes distribuidas.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    tags: ["STM32", "C/C++", "SPI/I2C", "FastAPI", "Recharts"],
    icon: FiTrendingUp,
    github: "https://github.com",
    demo: "https://example.com",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative bg-cyber-bg">
      <div className="absolute top-1/3 -right-1/4 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

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
            Proyectos <span className="text-primary glow-text-primary">Destacados</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg font-mono">
            Demostración práctica de la integración de sistemas embebidos, IoT y desarrollo web full-stack.
          </p>
        </motion.div>

        {/* Projects Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 flex flex-col h-full backdrop-blur-sm"
              >
                {/* Image and Icon Overlay */}
                <div className="relative h-52 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <div className="absolute top-4 right-4 z-20 p-2.5 rounded-lg bg-black/60 border border-white/10 text-primary-light backdrop-blur-sm group-hover:scale-110 group-hover:text-white transition-all">
                    <Icon size={20} />
                  </div>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-mono font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono bg-white/5 border border-white/10 text-primary-light px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground/80 hover:text-primary font-mono text-sm transition-colors"
                    >
                      <FiGithub size={16} /> Code
                    </a>
                    
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground/80 hover:text-primary-light font-mono text-sm transition-colors"
                    >
                      <FiExternalLink size={16} /> Live Demo
                    </a>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* GitHub redirect button */}
        <div className="text-center mt-16">
          <a
            href="https://github.com/DanyCode"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-white/10 hover:border-primary/50 text-white font-mono font-medium hover:bg-primary/5 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            Explorar más repositorios <FiGithub size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}
