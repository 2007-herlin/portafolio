"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiMenu, FiX, FiCpu, FiTerminal } from "react-icons/fi";

const navLinks = [
  { name: "Inicio", href: "#hero" },
  { name: "Sobre mí", href: "#about" },
  { name: "Habilidades", href: "#skills" },
  { name: "Proyectos", href: "#projects" },
  { name: "Contacto", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple active section detection
      const sections = ["hero", "about", "skills", "projects", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cyber-bg/75 backdrop-blur-lg border-b border-primary/20 py-4 shadow-[0_4px_30px_rgba(6,182,212,0.1)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-mono shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-300">
              <FiCpu className="text-xl group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-lg border border-white/20 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors font-mono">
              Dany<span className="text-primary glow-text-primary">.Eng</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 px-3 py-1 font-mono ${
                    isActive ? "text-primary font-semibold" : "text-foreground/80 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary shadow-[0_0_8px_rgba(6,182,212,1)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="#contact"
              className="relative overflow-hidden group px-5 py-2.5 rounded-lg bg-transparent border border-primary text-primary font-mono text-sm font-medium transition-all duration-300 hover:text-white"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              <span className="flex items-center gap-2">
                <FiTerminal className="text-xs group-hover:animate-pulse" />
                Contactar
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-foreground hover:text-primary transition-colors p-2 rounded-lg border border-white/5 bg-white/5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-bg/95 border-b border-primary/20 backdrop-blur-lg overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 space-y-4 font-mono">
              {navLinks.map((link) => {
                const sectionId = link.href.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-2 text-lg border-b border-white/5 transition-all ${
                      isActive ? "text-primary font-bold pl-2 border-l-2 border-l-primary" : "text-foreground/80 hover:text-white"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="text-xs opacity-40">&lt;0{navLinks.indexOf(link) + 1}/&gt;</span>
                  </Link>
                );
              })}
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Contactar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
