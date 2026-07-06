"use client";

import { useState, FormEvent } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div ref={ref} className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-xl p-6 md:p-8"
      >
        {/* Form header styled as PR template */}
        <div className="mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-3">
            <span className="text-cyan-400">$</span>
            <span>contact/submit --name &quot;...&quot; --email &quot;...&quot; --message &quot;...&quot;</span>
          </div>
          <h3 className="text-lg font-bold text-slate-50">Send a Message</h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            All fields are <span className="text-red-400">*required</span>
          </p>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <p className="text-lg font-semibold text-slate-50">Message sent!</p>
            <p className="text-sm text-slate-400 mt-1">
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-white/10 text-slate-400 hover:text-cyan-400"
              onClick={() => setStatus("idle")}
            >
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm text-slate-400 font-mono">
                name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`mt-1.5 bg-white/[0.03] border-white/10 text-slate-50 placeholder:text-slate-600
                  focus:border-cyan-500/50 focus:ring-cyan-500/20 ${
                    errors.name ? "border-red-500/50" : ""
                  }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm text-slate-400 font-mono">
                email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`mt-1.5 bg-white/[0.03] border-white/10 text-slate-50 placeholder:text-slate-600
                  focus:border-cyan-500/50 focus:ring-cyan-500/20 ${
                    errors.email ? "border-red-500/50" : ""
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="text-sm text-slate-400 font-mono">
                message
              </Label>
              <Textarea
                id="message"
                placeholder="What's on your mind?"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`mt-1.5 bg-white/[0.03] border-white/10 text-slate-50 placeholder:text-slate-600
                  focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none ${
                    errors.message ? "border-red-500/50" : ""
                  }`}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500
                text-white font-semibold py-2.5 rounded-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
            >
              {status === "sending" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit PR
                </span>
              )}
            </Button>

            {status === "error" && (
              <p className="text-xs text-red-400 text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Something went wrong. Please try again or email me directly.
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
}
