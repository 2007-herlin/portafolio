"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Profile } from "@/lib/supabase";

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center">

        {/* Left Side: Avatar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center items-center h-[400px]"
        >
          <div className="absolute w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10" />

          <div className="relative w-72 h-72 rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-cyan-100 to-white flex justify-center items-end overflow-hidden">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex flex-col justify-end items-center pb-4 text-slate-400">
                <span className="text-sm font-medium">Agrega tu foto en el Admin</span>
              </div>
            )}
          </div>

          <motion.div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-primary/30 animate-float" />
          <motion.div className="absolute bottom-10 right-10 w-6 h-6 rounded-full bg-primary/20 animate-float" style={{ animationDelay: "1s" }} />
        </motion.div>

        {/* Right Side: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-start"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 mb-6">
            About <span className="text-primary">Me</span>
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {profile.bio || "I'm a passionate developer who loves building great digital experiences."}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 w-full text-sm">
            {profile.email && (
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</span>
                <p className="text-slate-700 font-medium mt-1 truncate">{profile.email}</p>
              </div>
            )}
            {profile.phone && (
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Phone</span>
                <p className="text-slate-700 font-medium mt-1">{profile.phone}</p>
              </div>
            )}
            {profile.location && (
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Location</span>
                <p className="text-slate-700 font-medium mt-1">{profile.location}</p>
              </div>
            )}
          </div>

          <a
            href="#contact"
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/50 transition-all"
          >
            Hire Me
          </a>
        </motion.div>

      </div>
    </section>
  );
}
