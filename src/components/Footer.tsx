import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/50 border-t border-white/5 py-12 text-center mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        <Link href="#hero" className="text-3xl font-bold tracking-tighter mb-6">
          Dany<span className="text-primary">Code</span>
        </Link>
        
        <div className="flex items-center gap-6 mb-8 text-2xl">
          <a
            href="https://github.com/DanyCode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-white hover:scale-110 transition-all"
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
          <a
            href="https://linkedin.com/in/danycode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-primary hover:scale-110 transition-all"
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
          <a
            href="mailto:danycode@example.com"
            className="text-foreground/60 hover:text-primary-light hover:scale-110 transition-all"
            aria-label="Email"
          >
            <FiMail />
          </a>
        </div>

        <p className="text-foreground/40 text-sm">
          &copy; {currentYear} DanyCode. Todos los derechos reservados. <br/> Construido con Next.js y Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
