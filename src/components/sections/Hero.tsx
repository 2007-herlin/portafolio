"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiTerminal, FiCpu, FiCompass } from "react-icons/fi";
import Link from "next/link";

const titles = [
  "Ingeniero de Sistemas.",
  "Ingeniero de Electrónica.",
  "Desarrollador Full Stack.",
  "Especialista en IoT & Firmware.",
];

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Terminal logs state
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "danycode@systems:~$ boot --system --electronics",
    "Initializing hardware drivers...",
    "CPU: ARM Cortex-M4 @ 168MHz... OK",
    "RAM: System Memory Mapping... OK",
    "I2C Bus: 0x27 (LCD) 0x68 (RTC)... OK",
    "Network: Wi-Fi ESP32-WROOM... CONNECTED",
    "Firestore DB: Syncing channel... ESTABLISHED",
    "danycode@systems:~$ _"
  ]);

  // Terminal log simulation loop
  useEffect(() => {
    const logs = [
      "danycode@systems:~$ read --sensor A0",
      "Sensor values: ADC=3102 (4.98V) | Temp=25.4°C",
      "danycode@systems:~$ npm run dev",
      "Next.js 16.2.0 - Started development server...",
      "Ready in 120ms. Port 3000 online.",
      "danycode@systems:~$ git push origin master",
      "Uploading codebase to GitHub... 100% OK",
      "danycode@systems:~$ ./execute_robotics_arm",
      "Servo motors calibrating... Axis X: 90° | Axis Y: 45°",
      "danycode@systems:~$ clear",
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
      setTerminalLines((prev) => {
        // Remove cursor line
        const temp = prev.filter(line => !line.endsWith("_"));
        
        let nextLine = logs[logIdx];
        if (nextLine === "danycode@systems:~$ clear") {
          logIdx = (logIdx + 1) % logs.length;
          return ["danycode@systems:~$ clear", "danycode@systems:~$ _"];
        }
        
        const newLines = [...temp, nextLine, "danycode@systems:~$ _"];
        if (newLines.length > 9) {
          newLines.shift(); // keep it clean
        }
        
        logIdx = (logIdx + 1) % logs.length;
        return newLines;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Text typing effect
  useEffect(() => {
    const handleType = () => {
      const fullText = titles[titleIndex];

      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText.length === fullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    };

    const typeSpeed = isDeleting ? 30 : 70;
    const timer = setTimeout(
      handleType,
      currentText.length === titles[titleIndex].length && !isDeleting ? 2000 : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex]);

  // Interactive Circuit Grid Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particles (nodes of the circuit)
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulseSpeed: number;
      angle: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.5,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Mouse movement influence
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections (circuit traces)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move particles
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce on borders
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Pulse angle
        p1.angle += p1.pulseSpeed;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 130) {
            // Draw angular circuit lines (electronics look: 45 or 90 deg traces)
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            
            // Electronic circuit route (simulate 45-degree angle trace)
            const midX = p1.x + (p2.x - p1.x) * 0.5;
            ctx.lineTo(midX, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            const alpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.stroke();
          }
        }

        // Draw node (microchip pad or junction)
        const sizePulse = p1.radius + Math.sin(p1.angle) * 0.8;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, sizePulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6, 182, 212, 0.4)";
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee";
        ctx.fill();

        // Interact with mouse (hover connection)
        const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
        if (distToMouse < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - distToMouse / 150) * 0.25})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center pt-24 relative overflow-hidden bg-cyber-bg cyber-grid">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -right-1/4 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -left-1/4 w-[40rem] h-[40rem] bg-secondary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "-3s" }} />

      {/* Interactive Circuit Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Scanline overlay for retro CRT monitor feel */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-30 z-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Professional pitch */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary-light font-mono text-sm mb-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <FiCpu className="animate-spin-slow text-primary" />
            <span>Sistemas & Electrónica Integrados</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Diseñando el <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary glow-text-primary">
              Hardware y Software
            </span> <br />
            del futuro.
          </h1>

          <div className="h-10 md:h-12 text-xl md:text-2xl font-mono text-foreground/80 mb-6">
            Especializado en:{" "}
            <span className="text-primary-light font-semibold relative">
              {currentText}
              <span className="terminal-cursor"></span>
            </span>
          </div>

          <p className="text-foreground/75 text-lg mb-8 max-w-xl leading-relaxed">
            Hola, soy un desarrollador y futuro ingeniero apasionado por fusionar la potencia del desarrollo web full-stack, cloud computing y arquitecturas distribuidas con el control físico de la electrónica analógica/digital, microcontroladores y sistemas de IoT.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#projects"
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-mono font-medium hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:gap-4"
            >
              Proyectos <FiArrowRight />
            </Link>
            
            <Link
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-transparent border border-white/20 hover:border-primary text-white font-mono font-medium hover:bg-primary/10 transition-all"
            >
              Contáctame
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Command terminal simulating active system */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 hidden lg:block"
        >
          <div className="w-full rounded-xl border border-primary/20 bg-black/75 shadow-[0_15px_40px_rgba(3,7,18,0.9)] overflow-hidden glow-primary backdrop-blur-md">
            
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-foreground/40">
                <FiTerminal className="text-primary-light" />
                <span>danycode_sys.sh</span>
              </div>
              <div className="w-8"></div>
            </div>

            {/* Terminal Screen Area */}
            <div className="p-6 font-mono text-sm text-foreground/80 min-h-[300px] flex flex-col justify-end space-y-2 select-text leading-relaxed">
              <AnimatePresence>
                {terminalLines.map((line, idx) => {
                  let isCmd = line.startsWith("danycode@systems:");
                  let isSuccess = line.includes("OK") || line.includes("CONNECTED") || line.includes("ESTABLISHED");
                  
                  return (
                    <motion.div
                      key={idx + line}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`break-all ${
                        isCmd 
                          ? "text-primary" 
                          : isSuccess 
                          ? "text-accent" 
                          : line.includes("Temp") 
                          ? "text-yellow-400"
                          : "text-foreground/70"
                      }`}
                    >
                      {isCmd ? (
                        <>
                          <span className="text-secondary font-bold">danycode@systems</span>
                          <span className="text-foreground/50">:</span>
                          <span className="text-primary-light">~$</span>{" "}
                          {line.replace("danycode@systems:~$ ", "").replace("_", "")}
                          {line.endsWith("_") && <span className="terminal-cursor"></span>}
                        </>
                      ) : (
                        line.replace("_", "") + (line.endsWith("_") ? "_" : "")
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
