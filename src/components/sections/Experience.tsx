"use client";

import { motion } from "framer-motion";
import type { Experience as ExperienceType } from "@/lib/supabase";

interface ExperienceProps {
  experiences: ExperienceType[];
}

const defaultExperiences: ExperienceType[] = [
  { id: "1", title: "Full Stack Developer", company: "Your Company", description: "Add your experience from the Admin panel.", side: "left", order_index: 0 },
  { id: "2", title: "Computer Science Degree", company: "Your University", description: "Add your education from the Admin panel.", side: "right", order_index: 1 },
];

export default function Experience({ experiences }: ExperienceProps) {
  const items = experiences.length > 0 ? experiences : defaultExperiences;

  const left = items.filter((e) => e.side === "left");
  const right = items.filter((e) => e.side === "right");
  const maxLen = Math.max(left.length, right.length);

  return (
    <section id="experience" className="py-24 relative bg-white/50">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            My <span className="text-primary">Experience</span>
          </h2>
          <p className="text-slate-500">My professional journey and background</p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="w-full">
          {Array.from({ length: maxLen }).map((_, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_80px_1fr] gap-4 mb-8 items-start">
              {/* Left card */}
              {left[i] ? (
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow md:text-right"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{left[i].title}</h3>
                  <h4 className="text-primary font-medium text-sm mb-2">{left[i].company}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{left[i].description}</p>
                </motion.div>
              ) : (
                <div />
              )}

              {/* Center dot */}
              <div className="hidden md:flex justify-center pt-6">
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md ring-2 ring-primary/30" />
              </div>

              {/* Right card */}
              {right[i] ? (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{right[i].title}</h3>
                  <h4 className="text-primary font-medium text-sm mb-2">{right[i].company}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{right[i].description}</p>
                </motion.div>
              ) : (
                <div />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
