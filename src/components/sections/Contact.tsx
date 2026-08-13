"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend, FiCheckCircle, FiAlertTriangle,
  FiLoader, FiMail, FiUser, FiMessageSquare, FiTag
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";

// ─── Seguridad: rate limiting simple en cliente ──────────────────
const RATE_LIMIT_MS = 30_000;
let lastSubmitTime = 0;

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

type Status = "idle" | "loading" | "success";

const infoCards = [
  { icon: "💬", title: "Respuesta rápida", desc: "Respondo en menos de 24 horas." },
  { icon: "🤝", title: "Disponible", desc: "Abierto a proyectos freelance y trabajo remoto." },
  { icon: "🔒", title: "Confidencialidad", desc: "Tus datos están seguros y protegidos." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    // Limpia error al escribir
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Anti-spam: honeypot
      if (honeypotRef.current?.value) return;

      // Rate limiting
      const now = Date.now();
      if (now - lastSubmitTime < RATE_LIMIT_MS) {
        setErrorMsg(
          `Por favor espera ${Math.ceil(
            (RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000
          )} segundos antes de volver a enviar.`
        );
        return;
      }

      // Validaciones
      if (!form.name.trim()) {
        setErrorMsg("El nombre es obligatorio.");
        return;
      }
      if (!form.email.trim()) {
        setErrorMsg("El correo electrónico es obligatorio.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setErrorMsg("Ingresa un correo electrónico válido.");
        return;
      }
      if (!form.message.trim()) {
        setErrorMsg("El mensaje es obligatorio.");
        return;
      }
      if (form.message.trim().length < 10) {
        setErrorMsg("El mensaje debe tener al menos 10 caracteres.");
        return;
      }

      setErrorMsg("");
      setStatus("loading");

      try {
        const { error } = await supabase.from("contact_messages").insert({
          name: sanitize(form.name),
          email: sanitize(form.email),
          subject: sanitize(form.subject) || "Sin asunto",
          message: sanitize(form.message),
          read: false,
        });

        if (error) throw error;

        lastSubmitTime = Date.now();
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } catch {
        setStatus("idle");
        setErrorMsg("No se pudo enviar el mensaje. Intenta de nuevo más tarde.");
      }
    },
    [form, errorMsg]
  );

  return (
    <section id="contacto" className="py-24 relative">
      {/* Blobs de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-tag">
            <FiMail size={12} /> Contacto
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2">
            Hablemos de tu{" "}
            <span className="gradient-text">proyecto</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            ¿Tienes una idea? Cuéntame y lo hacemos realidad.
          </p>
        </motion.div>

        <div className="w-full grid md:grid-cols-5 gap-10 items-start">
          {/* Tarjetas de info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 flex flex-col gap-5"
          >
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-3xl flex-shrink-0">{card.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-700 text-sm">{card.title}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Formulario / estados */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-3"
          >
            <AnimatePresence mode="wait">
              {/* ── Estado: cargando ── */}
              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-16 flex flex-col items-center justify-center gap-4 shadow-sm"
                >
                  <FiLoader className="animate-spin text-4xl text-primary" />
                  <p className="text-slate-500 font-medium">
                    Enviando tu mensaje...
                  </p>
                </motion.div>
              )}

              {/* ── Estado: éxito ── */}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 shadow-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center"
                  >
                    <FiCheckCircle className="text-4xl text-emerald-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
                      ¡Mensaje enviado! 🎉
                    </h3>
                    <p className="text-slate-500">
                      Te responderé lo antes posible.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 px-6 py-2.5 rounded-full border-2 border-slate-200 text-slate-600 font-semibold hover:border-primary hover:text-primary transition-all text-sm"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              )}

              {/* ── Estado: formulario (idle) ── */}
              {status === "idle" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="glass-card rounded-2xl p-7 flex flex-col gap-4 shadow-sm"
                  noValidate
                >
                  {/* Honeypot anti-spam (oculto) */}
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website_url"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden"
                    autoComplete="off"
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
                      >
                        <FiUser size={11} className="inline mr-1" />
                        Nombre *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Tu nombre completo"
                        autoComplete="name"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
                      >
                        <FiMail size={11} className="inline mr-1" />
                        Correo *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Asunto */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
                    >
                      <FiTag size={11} className="inline mr-1" />
                      Asunto
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="¿De qué se trata?"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
                    >
                      <FiMessageSquare size={11} className="inline mr-1" />
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Cuéntame sobre tu proyecto, idea o consulta..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-none"
                    />
                  </div>

                  {/* Error inline */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                          <FiAlertTriangle className="flex-shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center mt-1"
                  >
                    <FiSend /> Enviar mensaje
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-1">
                    * Campos obligatorios. Tu información es tratada con total
                    privacidad.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
