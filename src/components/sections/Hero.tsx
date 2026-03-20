"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import Link from "next/link";

const titles = [
  "Full Stack Developer.",
  "Estudiante de Programación.",
  "Entusiasta de la Tecnología.",
];

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleType = () => {
      const fullText = titles[titleIndex];

      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText.length === fullText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    };

    const typeSpeed = isDeleting ? 40 : 100;
    const timer = setTimeout(handleType, currentText.length === titles[titleIndex].length && !isDeleting ? 1500 : typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex]);

  return (
    <section id="hero" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-light font-medium text-sm mb-6">
            Bienvenido a mi portafolio
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            Hola, soy <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              DanyCode
            </span>
          </h1>
          <div className="h-12 md:h-16 text-2xl md:text-3xl text-foreground/80 font-medium mb-8">
            Soy <span className="text-white relative">
              {currentText}
              <span className="absolute -right-2 top-0 !text-primary animate-pulse">|</span>
            </span>
          </div>

          <p className="text-foreground/60 text-lg mb-10 max-w-lg leading-relaxed">
            Me especializo en crear aplicaciones web modernas, robustas y visualmente atractivas. Construyendo soluciones desde el frontend hasta el backend.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#projects"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary-light focus:ring-4 focus:ring-primary/30 transition-all hover:gap-4 shadow-lg shadow-primary/25"
            >
              Ver mis proyectos <FiArrowRight />
            </Link>
            <a
              href="#"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all"
            >
              Descargar CV <FiDownload />
            </a>
          </div>
        </motion.div>

        {/* Decorative Graphic / Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-square rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden">
             {/* Abstract Code graphic placeholder */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800')] opacity-30 bg-cover bg-center mix-blend-overlay"></div>
             <div className="z-10 text-center">
                 <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">{'</>'}</div>
             </div>
             
             {/* Orbiting element */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border border-dashed border-primary/30 rounded-full"
             >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary shadow-[0_0_15px_rgba(37,99,235,1)] rounded-full"></div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
