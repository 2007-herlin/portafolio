"use client";

import { motion } from "framer-motion";

interface TechStackItem {
  id: string;
  name: string;
  order_index: number;
}

interface TechStackBannerProps {
  techs: TechStackItem[];
}

const defaultTechs = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Firebase", "Supabase", "PostgreSQL", "Docker", "Git",
];

export default function TechStackBanner({ techs }: TechStackBannerProps) {
  const items = techs.length > 0 ? techs.map((t) => t.name) : defaultTechs;
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden py-6 border-y border-slate-100 bg-white/60 backdrop-blur-sm">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-4 w-max"
      >
        {doubled.map((tech, idx) => (
          <span
            key={idx}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap cursor-default"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
