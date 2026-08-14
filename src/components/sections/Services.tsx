"use client";

import { motion } from "framer-motion";
import type { Service } from "@/lib/supabase";
import {
  Code2, Cpu, Globe, Database, Layers, Wifi, Settings, BarChart3,
  Smartphone, Server, Shield, Zap, ArrowRight
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Code: Code2, Code2, Cpu, Globe, Database, Layers, Wifi, Settings,
  BarChart3, Smartphone, Server, Shield, Zap,
};

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] ?? Code2;
}

const COLORS = [
  "from-blue-700 to-sky-500",
  "from-red-600 to-red-400",
  "from-sky-600 to-blue-500",
  "from-blue-800 to-blue-600",
  "from-red-500 to-rose-400",
  "from-cyan-600 to-sky-500",
];

export default function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-28 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50/30 to-white pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <span className="section-tag"><Zap size={12} /> Servicios</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-3 tracking-tight">
            ¿En qué puedo <span className="gradient-text">ayudarte?</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-700 to-sky-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Ofrezco soluciones tecnológicas a medida para empresas y emprendedores que quieren escalar.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = getIcon(svc.icon);
            const color = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white border border-black/8 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-bold text-black mb-2 group-hover:text-blue-700 transition-colors">{svc.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{svc.short_desc}</p>

                {svc.price_label && (
                  <span className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                    {svc.price_label}
                  </span>
                )}

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-4 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                  Contactar <ArrowRight size={13} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
