"use client";

import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative bg-black/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ponte en <span className="text-primary-light">Contacto</span></h2>
          <div className="w-20 h-1 bg-primary-light mx-auto rounded-full"></div>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg leading-relaxed">
            ¿Tienes un proyecto en mente o una oportunidad de trabajo? No dudes en escribirme, estaré encantado de conversar contigo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl shrink-0">
                <FiMail />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Email</h4>
                <a href="mailto:contacto@danycode.com" className="text-primary hover:text-primary-light transition-colors text-lg">
                  contacto@danycode.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl shrink-0">
                <FiPhone />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Teléfono</h4>
                <a href="tel:+51 976268558" className="text-primary hover:text-primary-light transition-colors text-lg">
                  +51 (976) 268-558
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl shrink-0">
                <FiMapPin />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Ubicación</h4>
                <p className="text-foreground/80 text-lg">
                  Remoto / Disponible en todo el mundo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <h3 className="text-2xl font-bold text-white mb-2">Envíame un mensaje</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">Tu Nombre</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">Tu Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground/80 mb-2">Asunto</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Propuesta de proyecto"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">Mensaje</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg"
              >
                Enviar Mensaje <FiSend />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
