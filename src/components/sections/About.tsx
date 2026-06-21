"use client";

import { motion } from "framer-motion";
import { FiCpu, FiServer, FiLayers, FiDatabase, FiCpu as HardwareIcon, FiFolder, FiActivity } from "react-icons/fi";

const stats = [
  { icon: FiFolder, label: "Proyectos Integrados", value: "18+" },
  { icon: FiCpu, label: "Chips Programados", value: "30+" },
  { icon: FiLayers, label: "Tecnologías Domadas", value: "15+" },
  { icon: FiActivity, label: "Servidores & API", value: "∞" },
];

export default function About() {
  return (
    <section id="about" className="py-32 relative bg-cyber-bg">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

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
            Sobre <span className="text-primary glow-text-primary">Mí</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg font-mono">
            Unificando el mundo digital del software con el mundo analógico del hardware.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-mono font-bold text-white leading-snug">
              Ingeniero en la intersección del <br />
              <span className="text-secondary">Código</span> y los <span className="text-accent">Circuitos</span>.
            </h3>
            
            <p className="text-foreground/75 text-lg leading-relaxed">
              Como estudiante avanzado de Ingeniería de Sistemas e Ingeniería Electrónica, he descubierto que el verdadero potencial tecnológico radica en integrar ambas disciplinas. No solo escribo software de alto rendimiento; entiendo la corriente eléctrica que lo ejecuta.
            </p>
            
            <p className="text-foreground/75 text-lg leading-relaxed">
              En el ámbito de **Sistemas**, diseño arquitecturas web escalables, bases de datos optimizadas y APIs robustas. En el de **Electrónica**, desarrollo firmware embebido para microcontroladores (ESP32, STM32, Arduino), diseño esquemáticos y placas PCB, e implemento redes de sensores IoT para automatización.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 font-mono text-sm">
                <div className="text-primary-light font-bold mb-1">&lt;SOFTWARE/&gt;</div>
                <div className="text-foreground/70">Next.js, Python, TypeScript, Node.js, SQL/NoSQL</div>
              </div>
              <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 font-mono text-sm">
                <div className="text-accent-light font-bold mb-1">&lt;HARDWARE/&gt;</div>
                <div className="text-foreground/70">C/C++, ESP32/STM32, IoT (MQTT/SPI/I2C), PCB Design</div>
              </div>
            </div>
          </motion.div>

          {/* Right Cards/Stats Column */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                {/* Glow border hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <stat.icon size={28} />
                </div>
                
                <h4 className="text-4xl font-extrabold text-white mb-2 font-mono group-hover:text-primary transition-colors">
                  {stat.value}
                </h4>
                
                <p className="text-foreground/60 text-xs font-semibold uppercase tracking-wider font-mono">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
