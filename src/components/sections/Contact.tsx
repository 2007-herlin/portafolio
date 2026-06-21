"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, FiAlertTriangle, FiLoader } from "react-icons/fi";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const addTerminalLine = (line: string, delay = 0) => {
    setTimeout(() => {
      setTerminalLog((prev) => [...prev, line]);
    }, delay);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus("error");
      setErrorMessage("Por favor, completa todos los campos del formulario.");
      return;
    }

    setStatus("loading");
    setTerminalLog([]);
    
    // Simulate terminal connection logging for engineer feel
    addTerminalLine("SYS: Initializing secure socket to Firebase Firestore...", 100);
    addTerminalLine("SYS: Resolving collections/contact_messages... OK", 400);
    addTerminalLine("SYS: Packing payload parameters into JSON string...", 700);
    addTerminalLine("SYS: Pushing packet to Firestore database. Waiting response...", 1000);

    try {
      // Save data to Firestore
      const docRef = await addDoc(collection(db, "contact_messages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      setTimeout(() => {
        addTerminalLine(`SYS: [SUCCESS] Document stored with ID: ${docRef.id.substring(0, 8)}...`, 200);
        addTerminalLine("SYS: Connection terminated gracefully. Status: 200 OK.", 500);
        setTimeout(() => {
          setStatus("success");
          setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1200);
      }, 1200);

    } catch (error: any) {
      console.error("Firestore error:", error);
      setTimeout(() => {
        addTerminalLine("SYS: [FATAL ERROR] Failed to connect to Firebase. Network timeout.", 200);
        addTerminalLine("SYS: Aborting packet transmission. Connection closed.", 500);
        setTimeout(() => {
          setStatus("error");
          setErrorMessage(error?.message || "Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.");
        }, 1200);
      }, 1200);
    }
  };

  return (
    <section id="contact" className="py-32 relative bg-black/40">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[40rem] h-[30rem] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4">
            Ponte en <span className="text-primary glow-text-primary">Contacto</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
          <p className="mt-6 text-foreground/60 max-w-2xl mx-auto text-lg font-mono">
            ¿Tienes un proyecto en mente o una propuesta? Escríbeme y hagamos ideas realidad.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Info cards (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6 h-full"
          >
            {/* Mail Card */}
            <div className="group flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <FiMail />
              </div>
              <div>
                <h4 className="text-sm font-mono text-foreground/40 uppercase tracking-wider mb-1">Email</h4>
                <a href="mailto:contacto@danycode.com" className="text-white hover:text-primary transition-colors text-lg font-semibold font-mono">
                  contacto@danycode.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <FiPhone />
              </div>
              <div>
                <h4 className="text-sm font-mono text-foreground/40 uppercase tracking-wider mb-1">Teléfono</h4>
                <a href="tel:+1234567890" className="text-white hover:text-primary transition-colors text-lg font-semibold font-mono">
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="group flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <FiMapPin />
              </div>
              <div>
                <h4 className="text-sm font-mono text-foreground/40 uppercase tracking-wider mb-1">Ubicación</h4>
                <p className="text-white text-lg font-semibold font-mono">
                  Remoto / Disponible globalmente
                </p>
              </div>
            </div>

            {/* Mini Circuit Decorative Panel */}
            <div className="hidden lg:block p-6 rounded-2xl border border-white/5 bg-black/20 flex-grow font-mono text-xs text-foreground/30 relative overflow-hidden">
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-ping"></div>
              <div>SYS_STATUS: ONLINE</div>
              <div>TRANSCEIVER: ESP32-WROOM-32E</div>
              <div>COMM_BUS: MQTT_OVER_WEBSOCKETS</div>
              <div>DB_CLIENT: FIREBASE_SDK_V11</div>
              <div className="mt-4 border-t border-white/5 pt-4 text-center">
                &lt;-- CIRCUITRY INTEGRITY 100% --&gt;
              </div>
            </div>
          </motion.div>

          {/* Form / Terminal area (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-7 flex flex-col h-full justify-between"
          >
            <AnimatePresence mode="wait">
              
              {/* STATUS: LOADING / EXECUTING COMMAND */}
              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black/85 border border-primary/30 p-8 rounded-2xl flex flex-col justify-between flex-grow min-h-[400px] shadow-[0_15px_30px_rgba(3,7,18,0.7)] font-mono text-sm"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                      <span className="text-primary-light flex items-center gap-2">
                        <FiLoader className="animate-spin" /> Transmitiendo paquete de datos...
                      </span>
                      <span className="text-xs text-foreground/40">contact_form_push.bin</span>
                    </div>
                    <div className="space-y-2 text-foreground/70">
                      {terminalLog.map((line, idx) => (
                        <div key={idx} className={line.includes("ERROR") ? "text-red-400 font-bold" : line.includes("SUCCESS") ? "text-accent font-bold" : "text-foreground/75"}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-foreground/30 mt-6 pt-4 border-t border-white/5 text-center">
                    No cierres esta pestaña hasta completar la transferencia.
                  </div>
                </motion.div>
              )}

              {/* STATUS: SUCCESS */}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black/60 border border-accent/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-grow min-h-[400px] shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-accent/20 border border-accent/40 text-accent rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  >
                    <FiCheckCircle />
                  </motion.div>
                  <h3 className="text-3xl font-mono font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-foreground/60 max-w-sm mb-8 font-mono text-sm leading-relaxed">
                    Tu mensaje se ha guardado correctamente en Firebase Firestore. Te responderé lo antes posible.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 rounded-lg border border-accent text-accent font-mono text-sm font-semibold hover:bg-accent/10 transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              )}

              {/* STATUS: IDLE / FORM */}
              {status === "idle" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-6 backdrop-blur-sm flex-grow"
                >
                  <h3 className="text-2xl font-mono font-bold text-white mb-2">
                    &lt;EnviarMensaje/&gt;
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">Tu Nombre</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">Tu Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">Asunto</label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Propuesta de proyecto IoT"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono text-foreground/60 uppercase tracking-wider mb-2">Mensaje</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none leading-relaxed"
                      placeholder="Escribe tu propuesta o mensaje aquí..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-mono font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg transition-all"
                  >
                    Transmitir Paquete <FiSend />
                  </button>
                </motion.form>
              )}

              {/* STATUS: ERROR */}
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black/60 border border-red-500/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-grow min-h-[400px] shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-20 h-20 bg-red-500/20 border border-red-500/40 text-red-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                    <FiAlertTriangle />
                  </div>
                  <h3 className="text-3xl font-mono font-bold text-white mb-2">Error de Envío</h3>
                  <p className="text-red-400 max-w-sm mb-8 font-mono text-sm leading-relaxed">
                    {errorMessage}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 rounded-lg border border-red-500 text-red-500 font-mono text-sm font-semibold hover:bg-red-500/10 transition-colors"
                  >
                    Volver al formulario
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
