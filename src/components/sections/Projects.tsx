"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/supabase";
import Image from "next/image";
import { FiGithub, FiExternalLink, FiCode, FiFilter } from "react-icons/fi";

interface ProjectsProps { projects: Project[] }

export default function Projects({ projects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [filtered, setFiltered] = useState<Project[]>(projects);

  const categories = ["Todos", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  useEffect(() => {
    setFiltered(activeFilter === "Todos" ? projects : projects.filter((p) => p.category === activeFilter));
  }, [activeFilter, projects]);

  return (
    <section id="proyectos" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="section-tag"><FiCode size={12} /> Mis proyectos</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 leading-tight">
            Trabajo <span className="gradient-text">Reciente</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">Una selección de proyectos en los que he trabajado</p>
        </motion.div>

        {/* Filtros por categoría */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <FiFilter size={14} className="text-slate-400 self-center mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-100 w-full">
            <FiCode size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No hay proyectos aún.</p>
            <p className="text-sm mt-1">Agrega tus proyectos desde el Panel de Admin.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filtered.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-400 group flex flex-col"
              >
                {/* Imagen */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-4xl font-extrabold text-primary/25">
                      {project.title.charAt(0)}
                    </div>
                  )}
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-3">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="bg-white/20 backdrop-blur-sm text-white rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 hover:bg-white/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiGithub size={13} /> Código
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                        className="bg-white/20 backdrop-blur-sm text-white rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 hover:bg-white/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiExternalLink size={13} /> Demo
                      </a>
                    )}
                  </div>
                  {project.year && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      {project.year}
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5 flex flex-col flex-1">
                  {project.category && (
                    <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2">{project.category}</span>
                  )}
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">{project.description}</p>
                  )}
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="bg-primary/8 text-primary text-xs font-semibold px-2.5 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
