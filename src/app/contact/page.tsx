"use client";
import { useState,useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { apiSubmitContact } from "@/lib/userApi";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ArrowRight } from "lucide-react";
import { useSettingsStore } from "../store/settingStore";


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
const {
    settings, 
    fetchSettings,
  } = useSettingsStore();
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const contactInfo = [
  { icon: Phone,  label: "Phone",   value: settings.phone,           accent: "text-brand-accent" },
  { icon: Mail,   label: "Email",   value: settings.email,       accent: "text-brand-accent" },
  { icon: MapPin, label: "Address", value: settings?.address,      accent: "text-brand-accent" },
  { icon: Clock,  label: "Hours",   value: settings.workingHours,   accent: "text-brand-accent" },
];
const COLORS = {
  bg: "#F8F5F0",
  cardBg: "#FFFFFF",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
  accentHover: "#B0873B",
  border: "rgba(197, 154, 70, 0.2)",
};
  return (
  <main className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />

      {/* Hero Header */}
      <section
        className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b"
        style={{
          borderColor: COLORS.border,
          backgroundImage: `linear-gradient(rgba(197, 154, 70, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197, 154, 70, 0.05) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: COLORS.accent }}
          >
            Contact Us
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: COLORS.primaryText }}
          >
            Get in Touch
          </h1>
          <p
            className="text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: COLORS.secondaryText }}
          >
            Have a question, project idea, or partnership inquiry? Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

          {/* Left Info Panel */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div>
              <h2
                className="font-display text-2xl font-bold mb-2"
                style={{ color: COLORS.primaryText }}
              >
                Let&apos;s Talk
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: COLORS.secondaryText }}
              >
                Whether you&apos;re planning a repaint, need a site estimate, or want colour advice
                — we&apos;re always happy to chat.
              </p>
            </div>

            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 bg-white border rounded-xl p-4 shadow-sm transition-all hover:border-[#C59A46]"
                  style={{ borderColor: COLORS.border }}
                >
                  <div
                    className="w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "rgba(197, 154, 70, 0.08)",
                      borderColor: COLORS.border,
                    }}
                  >
                    <Icon size={16} style={{ color: COLORS.accent }} />
                  </div>
                  <div>
                    <p
                      className="text-xs mb-0.5 uppercase tracking-wide font-semibold"
                      style={{ color: COLORS.secondaryText }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: COLORS.primaryText }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Map / Location Box */}
            <div
              className="bg-white border rounded-xl h-44 flex flex-col items-center justify-center gap-2 mt-1 shadow-sm"
              style={{ borderColor: COLORS.border }}
            >
              <MapPin size={26} style={{ color: COLORS.accent }} />
              <p
                className="text-sm font-medium px-4 text-center"
                style={{ color: COLORS.primaryText }}
              >
                {settings?.address}
              </p>
              <p
                className="text-xs"
                style={{ color: COLORS.secondaryText }}
              >
                6°4&apos;31&quot;N 3°24&apos;45&quot;E
              </p>
            </div>
          </div>

          {/* Right Form Container */}
          <div
            className="lg:col-span-3 bg-white border rounded-2xl p-8 shadow-sm"
            style={{ borderColor: COLORS.border }}
          >
            {success ? (
              <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <div>
                  <h3
                    className="font-display text-2xl font-bold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    className="mt-2 max-w-xs text-sm"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
                  style={{ color: COLORS.accent }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <h3
                    className="font-display text-xl font-bold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Send a Message
                  </h3>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.secondaryText }}
                  >
                    We respond within 24 business hours
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ["fullName", "Full Name", "Your full name"],
                    ["phoneNumber", "Phone Number", "+234..."],
                  ].map(([name, label, ph]) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold"
                        style={{ color: COLORS.primaryText }}
                      >
                        {label}
                      </label>
                      <input
                        name={name}
                        value={(form as Record<string, string>)[name]}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [name]: e.target.value }))
                        }
                        placeholder={ph}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-semibold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-semibold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Subject
                  </label>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, subject: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">Select a subject</option>
                    {[
                      "Product Inquiry",
                      "Order Support",
                      "Painter Request",
                      "Site Estimator",
                      "Partnership",
                      "Other",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-semibold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Describe your inquiry in detail..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50 text-sm mt-2"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
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
