"use client";

import { motion } from "framer-motion";
import { FiCode, FiCoffee, FiFolder, FiStar } from "react-icons/fi";

const stats = [
  { icon: FiCode, label: "Años de Experiencia", value: "2+" },
  { icon: FiFolder, label: "Proyectos Realizados", value: "15+" },
  { icon: FiStar, label: "Clientes Satisfechos", value: "5+" },
  { icon: FiCoffee, label: "Tazas de Café", value: "∞" },
];

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Sobre <span className="text-primary">Mí</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Full Stack Developer & Futuro Ingeniero</h3>
            <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
              Soy un desarrollador apasionado por crear soluciones tecnológicas que marquen la diferencia. Mi viaje en la programación comenzó con la curiosidad de entender cómo funcionan las cosas, y desde entonces no he parado de aprender.
            </p>
            <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
              Disfruto trabajar tanto en el Frontend creando interfaces atractivas y fluidas, como en el Backend estructurando lógica sólida y bases de datos eficientes. Siempre busco aplicar buenas prácticas, código limpio y mantenible en cada proyecto.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="inline-flex items-center justify-center p-4 bg-primary/20 text-primary rounded-xl mb-4">
                  <stat.icon size={32} />
                </div>
                <h4 className="text-4xl font-black text-white mb-2">{stat.value}</h4>
                <p className="text-foreground/60 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
