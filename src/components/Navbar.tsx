"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import type { Profile, SocialLink } from "@/lib/supabase";

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "Sobre mí", href: "#sobre-mi" },
  { name: "Experiencia", href: "#experiencia" },
  { name: "Proyectos", href: "#proyectos" },
  { name: "Contacto", href: "#contacto" },
];

interface NavbarProps { profile: Profile; socials: SocialLink[] }

export default function Navbar({ profile }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-3 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className={`w-full max-w-5xl rounded-2xl transition-all duration-300 flex items-center justify-between px-6 py-3.5 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg border border-white/80"
          : "bg-white/80 backdrop-blur-md shadow-sm border border-white/60"
      }`}>
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-0.5">
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            {profile.name || "DanyCode"}
          </span>
          <span className="text-primary text-xl font-extrabold">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <Link key={link.name} href={link.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive ? "text-primary" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <Link href="#contacto"
          className="hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Contrátame <FiArrowRight size={13} />
        </Link>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Menú"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-3 gap-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:text-primary transition-all"
                >
                  {link.name}
                  <FiArrowRight size={14} className="text-slate-300" />
                </Link>
              ))}
              <Link href="#contacto" onClick={() => setIsOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm"
              >
                Contrátame <FiArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
