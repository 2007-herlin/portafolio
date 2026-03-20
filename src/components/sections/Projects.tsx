"use client";

import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import Image from "next/image";

const projects = [
  {
    title: "EcoStore Platform",
    description: "Plataforma de comercio electrónico con carrito de compras, autenticación de usuarios y pasarela de pago integrada.",
    image: "https://i.pinimg.com/736x/19/98/63/199863be3b12630c791cb5b11850b36a.jpg",
    tags: ["React", "Next.js", "Tailwind CSS", "Stripe"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "TaskFlow Manager",
    description: "Aplicación de gestión de tareas estilo Kanban con capacidades drag-and-drop y sincronización en tiempo real.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=800",
    tags: ["TypeScript", "React", "Node.js", "MongoDB"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    title: "DataViz Dashboard",
    description: "Panel administrativo para visualizar datos empresariales con gráficos dinámicos exportables a PDF/Excel.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "FastAPI", "React", "Recharts"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Proyectos <span className="text-primary">Destacados</span></h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full group"
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10 mix-blend-overlay"></div>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-foreground/70 mb-6 flex-grow">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-semibold bg-white/10 text-primary-light px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
                  >
                    <FiGithub /> Código
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground hover:text-primary-light transition-colors font-medium"
                  >
                    <FiExternalLink /> Ver Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="https://github.com/DanyCode"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-primary text-white font-medium hover:bg-primary/10 transition-all font-medium"
          >
            Ver más en GitHub <FiGithub size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
