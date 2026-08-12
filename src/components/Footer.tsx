import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail, FiTwitter, FiGlobe, FiInstagram } from "react-icons/fi";
import type { Profile, SocialLink } from "@/lib/supabase";

const iconMap: Record<string, React.ReactNode> = {
  github: <FiGithub />,
  linkedin: <FiLinkedin />,
  twitter: <FiTwitter />,
  instagram: <FiInstagram />,
  website: <FiGlobe />,
  email: <FiMail />,
};

interface FooterProps {
  profile: Profile;
  socials: SocialLink[];
}

export default function Footer({ profile, socials }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 py-12 text-center mt-0">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">

        {/* Logo */}
        <Link href="#hero" className="text-2xl font-extrabold text-white mb-3 hover:text-primary transition-colors">
          {profile.name || "DanyCode"}<span className="text-primary">.</span>
        </Link>

        <p className="text-slate-400 text-sm max-w-sm mb-6">
          {profile.title || "Full Stack Developer"}
        </p>

        {/* Social Links from Supabase */}
        {socials.length > 0 && (
          <div className="flex items-center gap-4 mb-8">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.platform}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/20 transition-all"
              >
                {iconMap[social.platform] || <FiGlobe />}
              </a>
            ))}
          </div>
        )}

        <p className="text-slate-500 text-xs">
          &copy; {currentYear} {profile.name || "DanyCode"}. All rights reserved. Built with Next.js & Supabase.
        </p>
      </div>
    </footer>
  );
}



