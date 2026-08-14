"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Resource } from "@/lib/supabase";
import {
  FileText, Image as ImageIcon, FileArchive, Download, ExternalLink,
  Filter, FolderOpen, File
} from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  certificado: "Certificado",
  cv: "CV / Hoja de Vida",
  portafolio: "Portafolio",
  otro: "Otro",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  png: ImageIcon,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  webp: ImageIcon,
  csv: FileArchive,
  default: File,
};

function getTypeIcon(fileType: string): React.ElementType {
  return TYPE_ICONS[fileType.toLowerCase()] ?? TYPE_ICONS.default;
}

const TYPE_COLORS: Record<string, string> = {
  pdf: "bg-red-50 text-red-600 border-red-100",
  png: "bg-blue-50 text-blue-600 border-blue-100",
  jpg: "bg-blue-50 text-blue-600 border-blue-100",
  jpeg: "bg-blue-50 text-blue-600 border-blue-100",
  webp: "bg-sky-50 text-sky-600 border-sky-100",
  csv: "bg-gray-50 text-gray-600 border-gray-200",
  default: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function Resources({ resources }: { resources: Resource[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  if (resources.length === 0) return null;

  const categories = ["all", ...Array.from(new Set(resources.map((r) => r.category)))];
  const filtered = activeCategory === "all"
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  return (
    <section id="resources" className="py-28 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-red-50/20 to-white pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <span className="section-tag"><FolderOpen size={12} /> Recursos</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-3 tracking-tight">
            Documentos & <span className="gradient-text">Archivos</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-700 to-sky-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            CV, certificados, portafolios y más recursos disponibles para descargar.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {cat === "all" ? (
                <><Filter size={12} /> Todos</>
              ) : (
                CATEGORY_LABELS[cat] ?? cat
              )}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((res, i) => {
              const Icon = getTypeIcon(res.file_type);
              const colorClass = TYPE_COLORS[res.file_type.toLowerCase()] ?? TYPE_COLORS.default;
              const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(res.file_type.toLowerCase());

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="group bg-white border border-black/8 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-black text-sm leading-snug mb-1 truncate">{res.title}</h3>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {res.file_type.toUpperCase()} · {CATEGORY_LABELS[res.category] ?? res.category}
                      </span>
                    </div>
                  </div>

                  {res.description && (
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{res.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-black/5">
                    <a
                      href={res.file_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all"
                    >
                      <Download size={13} /> Descargar
                    </a>
                    {isImage && (
                      <a
                        href={res.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 border border-black/10 text-gray-600 hover:border-blue-400 hover:text-blue-600 rounded-xl transition-all"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
