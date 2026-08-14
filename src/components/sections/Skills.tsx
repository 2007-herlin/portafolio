"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Skill } from "@/lib/supabase";
import { Code2, Cpu, Globe, GitBranch, Loader2, TrendingUp } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Software & Full-Stack": Code2,
  "Electronica & Hardware": Cpu,
  "Redes & IoT": Globe,
  default: GitBranch,
};

function AnimatedBar({ percentage, color }: { percentage: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden border border-black/8 relative">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${percentage}%` } : { width: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-100%] animate-[shimmer_2.5s_ease_infinite]" />
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("skills")
      .select("*")
      .eq("visible", true)
      .order("order_index")
      .then(({ data }) => {
        if (data) setSkills(data);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-28 relative bg-white">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <span className="section-tag"><TrendingUp size={12} /> Habilidades</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-3 tracking-tight">
            Stack <span className="gradient-text">Técnico</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-700 to-sky-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Mi stack abarca el ciclo completo — desde el firmware de un microcontrolador hasta la infraestructura en la nube.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-700" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {categories.map((cat, catIdx) => {
              const catSkills = skills.filter((s) => s.category === cat);
              const Icon = CATEGORY_ICONS[cat] ?? CATEGORY_ICONS.default;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: catIdx * 0.12 }}
                  className="bg-white border border-black/8 rounded-2xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-sm">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-black">{cat}</h3>
                  </div>

                  <div className="space-y-5 flex-grow">
                    {catSkills.map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIdx * 0.1 + i * 0.07 }}
                      >
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            {skill.percentage}%
                          </span>
                        </div>
                        <AnimatedBar percentage={skill.percentage} color={skill.color} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
