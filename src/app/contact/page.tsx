"use client";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { apiSubmitContact } from "@/lib/userApi";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight } from "lucide-react";

const contactInfo = [
  { icon: Phone,  label: "Phone",   value: "+234 800 000 0000",           accent: "text-brand-accent" },
  { icon: Mail,   label: "Email",   value: "paintmarket7@gmail.com",       accent: "text-brand-accent" },
  { icon: MapPin, label: "Address", value: "Victoria Island, Lagos",      accent: "text-brand-accent" },
  { icon: Clock,  label: "Hours",   value: "Mon – Sat: 8am – 6pm WAT",   accent: "text-brand-accent" },
];

const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

export default function ContactPage() {
  const [form, setForm] = useState({ fullName:"", email:"", phoneNumber:"", subject:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await apiSubmitContact(form); setSuccess(true); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40"
        style={{
          backgroundImage:`linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize:"52px 52px",
        }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Contact Us
          </p>
          <h1 className="font-display text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-brand-mid text-lg max-w-lg mx-auto">
            Have a question, project idea, or partnership inquiry? Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

          {/* Left info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Let&apos;s Talk</h2>
              <p className="text-brand-mid text-sm leading-relaxed">
                Whether you&apos;re planning a repaint, need a site estimate, or want colour advice
                — we&apos;re always happy to chat.
              </p>
            </div>

            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}
                  className="flex items-start gap-4 bg-brand-card border border-brand-border
                    rounded-xl p-4 hover:border-brand-accent/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-brand-raised border border-brand-border
                    flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className={item.accent} />
                  </div>
                  <div>
                    <p className="text-brand-subtle text-xs mb-0.5 uppercase tracking-wide">{item.label}</p>
                    <p className="text-brand-lt-gray text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              );
            })}

            {/* Map placeholder */}
            <div className="bg-brand-card border border-brand-border rounded-xl h-44
              flex flex-col items-center justify-center gap-2 mt-1">
              <MapPin size={26} className="text-brand-accent" />
              <p className="text-brand-mid text-sm">Victoria Island, Lagos</p>
              <p className="text-brand-subtle text-xs">6°4&apos;31&quot;N 3°24&apos;45&quot;E</p>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3 bg-brand-card border border-brand-border rounded-2xl p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full gap-5 py-16">
                <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/50
                  flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-brand-mid mt-2 max-w-xs text-sm">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button onClick={() => setSuccess(false)}
                  className="text-brand-accent text-sm underline underline-offset-4 hover:text-brand-accent-lt transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Send a Message</h3>
                  <p className="text-brand-mid text-xs mt-1">We respond within 24 business hours</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[["fullName","Full Name","Your full name"],["phoneNumber","Phone Number","+234..."]].map(([name,label,ph]) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
                      <input name={name} value={(form as Record<string,string>)[name]}
                        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                        placeholder={ph} className={inputCls} />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Email Address</label>
                  <input name="email" type="email" required value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com" className={inputCls} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Subject</label>
                  <select name="subject" required value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    className={inputCls}>
                    <option value="">Select a subject</option>
                    {["Product Inquiry","Order Support","Painter Request","Site Estimator","Partnership","Other"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Message</label>
                  <textarea name="message" required rows={5} value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Describe your inquiry in detail..."
                    className={`${inputCls} resize-none`} />
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                    font-semibold px-6 py-3.5 rounded-lg hover:bg-brand-accent-lt transition-all
                    disabled:opacity-50 text-sm">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                    : <Send size={15} />}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
