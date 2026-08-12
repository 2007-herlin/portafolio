"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/lib/supabase";
import { FiGithub, FiExternalLink } from "react-icons/fi";

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="work" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            My Recent <span className="text-primary">Work</span>
          </h2>
          <p className="text-slate-500">Some of the projects I've built recently</p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 w-full">
            <p className="text-lg font-medium">No projects yet.</p>
            <p className="text-sm mt-1">Add your projects from the Admin panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 w-full">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary/30 text-5xl font-bold">
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {project.category && (
                    <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-2">{project.category}</p>
                  )}
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors mb-3">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex gap-3">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
                      >
                        <FiGithub /> Code
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
                      >
                        <FiExternalLink /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
