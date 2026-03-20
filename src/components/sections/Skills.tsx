"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML & CSS", level: 95 },
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "React / Next.js", level: 85 },
      { name: "Tailwind CSS", level: 95 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Java", level: 80 },
      { name: "Python", level: 75 },
      { name: "Node.js (APIs)", level: 85 },
      { name: "Bases de Datos (SQL/NoSQL)", level: 80 },
    ],
  },
  {
    title: "Herramientas & Otros",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "WordPress & Webflow", level: 85 },
      { name: "Análisis de Datos (Excel, Power BI)", level: 70 },
      { name: "Arduino & Electrónica", level: 65 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative bg-black/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Mis <span className="text-primary-light">Habilidades</span></h2>
          <div className="w-20 h-1 bg-primary-light mx-auto rounded-full"></div>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg hover:text-white transition-colors">
            Un vistazo a las tecnologías, herramientas y lenguajes con los que trabajo para dar vida a los proyectos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: catIndex * 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                {category.title}
              </h3>
              
              <div className="space-y-6">
                {category.skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-foreground/90">{skill.name}</span>
                      <span className="text-primary-light font-bold text-sm bg-primary/10 px-2 py-0.5 rounded">{skill.level}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                      >
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 blur-[2px] animate-pulse"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
