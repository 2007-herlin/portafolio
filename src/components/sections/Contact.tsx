"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCheckCircle, FiAlertTriangle, FiLoader } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage("Please fill in all fields.");
      return;
    }
    setStatus("loading");
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        read: false,
      });
      if (error) throw error;
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
            Contact <span className="text-primary">Me</span>
          </h2>
          <p className="text-slate-500">Have a project in mind? Let's talk.</p>
        </motion.div>

        <div className="w-full grid md:grid-cols-2 gap-16 items-center">

          {/* Left: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 rounded-[3rem] bg-gradient-to-tr from-primary/10 to-secondary/10 shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-7xl mb-4">💬</div>
                <p className="text-slate-600 font-semibold text-lg">Let's work together!</p>
                <p className="text-slate-400 text-sm mt-2">I respond within 24 hours</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md mx-auto md:mx-0"
          >
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none shadow-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:-translate-y-1 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all"
                  >
                    Send Message <FiSend />
                  </button>
                </motion.form>
              )}

              {status === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm"
                >
                  <FiLoader className="animate-spin text-4xl text-primary mb-4" />
                  <p className="text-slate-500 font-medium">Sending...</p>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm px-6 text-center"
                >
                  <FiCheckCircle className="text-5xl text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 mb-6">I'll get back to you soon.</p>
                  <button onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm px-6 text-center"
                >
                  <FiAlertTriangle className="text-5xl text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h3>
                  <p className="text-slate-500 mb-6">{errorMessage}</p>
                  <button onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 rounded-full border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                  >
                    Try Again
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
