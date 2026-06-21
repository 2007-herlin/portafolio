import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail, FiCpu } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyber-bg border-t border-primary/20 py-16 text-center mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center relative z-10">
        
        {/* Brand/Logo */}
        <Link href="#hero" className="flex items-center gap-2 group mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-sm font-mono shadow-[0_0_10px_rgba(6,182,212,0.1)] group-hover:bg-primary/20 transition-all duration-300">
            <FiCpu className="group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-mono">
            Dany<span className="text-primary glow-text-primary">.Eng</span>
          </span>
        </Link>
        
        {/* Short bio */}
        <p className="text-foreground/50 text-sm max-w-sm mb-8 font-mono">
          Desarrollando la convergencia del software y hardware con estándares modernos de ingeniería.
        </p>
        
        {/* Social Links */}
        <div className="flex items-center gap-6 mb-10 text-2xl">
          <a
            href="https://github.com/DanyCode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-primary hover:scale-110 transition-all p-2 rounded-lg border border-white/5 bg-white/5"
            aria-label="GitHub"
          >
            <FiGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/danycode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-primary hover:scale-110 transition-all p-2 rounded-lg border border-white/5 bg-white/5"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={20} />
          </a>
          <a
            href="mailto:contacto@danycode.com"
            className="text-foreground/60 hover:text-primary hover:scale-110 transition-all p-2 rounded-lg border border-white/5 bg-white/5"
            aria-label="Email"
          >
            <FiMail size={20} />
          </a>
        </div>

        {/* Footer Base Info */}
        <p className="text-foreground/45 text-xs font-mono leading-relaxed">
          &copy; {currentYear} Dany.Eng. Todos los derechos reservados. <br/> 
          Construido con <span className="text-primary-light">Next.js 16</span>, <span className="text-secondary-light">Tailwind CSS v4</span> y <span className="text-accent-light">Firebase Firestore</span>.
        </p>
      </div>
    </footer>
  );
}
