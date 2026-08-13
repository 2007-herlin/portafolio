"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from "react-icons/fi";
import type { Testimonial } from "@/lib/supabase";

interface TestimonialsProps { testimonials: Testimonial[] }

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  if (!testimonials.length) return null;

  const go = (delta: number) => {
    setDir(delta);
    setIndex((prev) => (prev + delta + testimonials.length) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <section id="testimonios" className="py-24 relative bg-white/60">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-tag"><FiMessageSquare size={12} /> Opiniones</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2">
            Lo que dicen <span className="gradient-text">mis clientes</span>
          </h2>
        </motion.div>

        <div className="relative w-full max-w-3xl">
          {/* Arrows */}
          {testimonials.length > 1 && (
            <>
              <button onClick={() => go(-1)}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:shadow-md transition-all z-10"
              ><FiChevronLeft /></button>
              <button onClick={() => go(1)}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:shadow-md transition-all z-10"
              ><FiChevronRight /></button>
            </>
          )}

          {/* Card */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -80 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="glass-card rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden"
            >
              {/* Comillas decorativas */}
              <div className="absolute top-6 left-6 text-8xl font-serif text-primary/10 leading-none select-none">"</div>
              <div className="relative z-10">
                {/* Estrellas */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < t.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-lg leading-relaxed italic mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  {t.author_image_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                      <Image src={t.author_image_url} alt={t.author_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {t.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-800">{t.author_name}</h4>
                    {t.author_role && <p className="text-sm text-slate-400">{t.author_role}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile arrows */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-3 mt-6 md:hidden">
              <button onClick={() => go(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"><FiChevronLeft /></button>
              <button onClick={() => go(1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all"><FiChevronRight /></button>
            </div>
          )}

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-primary" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
