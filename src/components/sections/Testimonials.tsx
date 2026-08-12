"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import type { Testimonial } from "@/lib/supabase";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative bg-white/50">
      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            What Clients <span className="text-primary">Say</span>
          </h2>
        </motion.div>

        <div className="relative w-full flex items-center justify-center">
          {testimonials.length > 1 && (
            <button onClick={prev} className="absolute left-0 z-10 p-2 text-slate-400 hover:text-primary transition-colors bg-white rounded-full shadow-sm hover:shadow-md hidden md:block">
              <FiChevronLeft size={24} />
            </button>
          )}

          <div className="w-full max-w-2xl overflow-hidden px-4 md:px-12">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-card bg-white p-8 md:p-12 rounded-3xl shadow-sm relative"
            >
              <div className="text-6xl text-primary/20 font-serif absolute top-6 left-6 leading-none">"</div>
              <div className="relative z-10">
                <p className="text-slate-600 text-lg italic leading-relaxed mb-8">
                  "{current.text}"
                </p>

                <div className="flex items-center gap-4">
                  {current.author_image_url ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                      <Image src={current.author_image_url} alt={current.author_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {current.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm">{current.author_name}</h4>
                    {current.author_role && <p className="text-slate-400 text-xs">{current.author_role}</p>}
                    <div className="flex gap-0.5 text-yellow-400 text-xs mt-1">
                      {[...Array(current.rating)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {testimonials.length > 1 && (
            <button onClick={next} className="absolute right-0 z-10 p-2 text-slate-400 hover:text-primary transition-colors bg-white rounded-full shadow-sm hover:shadow-md hidden md:block">
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "w-6 bg-primary" : "bg-slate-300"}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
