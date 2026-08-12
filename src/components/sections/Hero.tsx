"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiDownload, FiMail } from "react-icons/fi";
import { FiGithub, FiLinkedin, FiTwitter, FiGlobe, FiInstagram } from "react-icons/fi";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiTailwindcss, SiNodedotjs, SiPython
} from "react-icons/si";
import type { Profile, SocialLink } from "@/lib/supabase";

const iconMap: Record<string, React.ReactNode> = {
  github: <FiGithub />,
  linkedin: <FiLinkedin />,
  twitter: <FiTwitter />,
  instagram: <FiInstagram />,
  website: <FiGlobe />,
};

interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
}

export default function Hero({ profile, socials }: HeroProps) {
  return (
    <section id="hero" className="min-h-screen pt-32 pb-16 relative flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Side: Text and Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start"
        >
          <p className="text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            👋 Welcome to my portfolio
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 mb-4 leading-tight">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {profile.name || "DanyCode"}
            </span>
          </h1>
          <h2 className="text-xl text-slate-500 font-medium mb-4">{profile.title || "Full Stack Developer"}</h2>

          <p className="text-slate-600 text-base mb-8 max-w-lg leading-relaxed">
            {profile.bio || "Passionate about building scalable, user-centric web applications and delivering exceptional digital experiences."}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {profile.resume_url && profile.resume_url !== "#" && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all"
              >
                <FiDownload /> Resume
              </a>
            )}
            <Link
              href="#contact"
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              <FiMail /> Contact Me
            </Link>
          </div>

          {/* Social Links */}
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:shadow-md border border-slate-100 transition-all hover:-translate-y-0.5"
                  title={social.platform}
                >
                  {iconMap[social.platform] || <FiGlobe />}
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Side: Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center h-[400px] md:h-[500px]"
        >
          {/* Main Avatar Circle */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-primary-light/40 to-white shadow-2xl border-[8px] border-white flex justify-center items-end overflow-hidden z-10">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex flex-col justify-end items-center pb-4 text-slate-400">
                <span className="text-sm font-medium">Agrega tu foto en el Admin</span>
              </div>
            )}
          </div>

          {/* Floating Tech Icons */}
          <motion.div className="absolute top-10 left-10 text-5xl text-[#61DAFB] bg-white rounded-full p-2 shadow-lg animate-float" style={{ animationDelay: "0s" }}>
            <SiReact />
          </motion.div>
          <motion.div className="absolute bottom-20 left-4 text-4xl text-[#F7DF1E] bg-white rounded-full p-2 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
            <SiJavascript />
          </motion.div>
          <motion.div className="absolute top-1/2 -right-4 text-4xl text-[#3178C6] bg-white rounded-full p-2 shadow-lg animate-float" style={{ animationDelay: "2s" }}>
            <SiTypescript />
          </motion.div>
          <motion.div className="absolute -top-4 right-20 text-3xl text-emerald-500 bg-white rounded-full p-2 shadow-lg animate-float" style={{ animationDelay: "1.5s" }}>
            <SiNodedotjs />
          </motion.div>
          <motion.div className="absolute bottom-4 right-16 text-4xl text-slate-800 bg-white rounded-full p-2 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
            <SiNextdotjs />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
