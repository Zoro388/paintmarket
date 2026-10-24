"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { apiSubmitContact } from "@/lib/userApi";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useSettingsStore } from "../store/settingStore";

const inputCls =
  "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

const GOOGLE_MAPS_LINK =
  "https://maps.app.goo.gl/zWS62ZU1jAY2DMT6A";

const GOOGLE_MAPS_EMBED =
  "https://maps.google.com/maps?q=6.075278,3.4125&z=15&output=embed";

const WHATSAPP_LINK =
  "https://wa.me/2348105757406?text=Hello%20Paintdomain%2C%20I%20would%20like%20to%20make%20an%20inquiry.";

const COLORS = {
  bg: "#F8F5F0",
  cardBg: "#FFFFFF",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
  accentHover: "#B0873B",
  border: "rgba(197, 154, 70, 0.2)",
};

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiSubmitContact(form);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: settings.phone,
      accent: "text-brand-accent",
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email,
      accent: "text-brand-accent",
    },
    {
      icon: MapPin,
      label: "Address",
      value: settings?.address,
      accent: "text-brand-accent",
    },
    {
      icon: Clock,
      label: "Hours",
      value: settings.workingHours,
      accent: "text-brand-accent",
    },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: COLORS.bg }}
    >
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
            Have a question, project idea, or partnership inquiry? Our team
            is ready to help.
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
                Whether you&apos;re planning a repaint, need a site estimate,
                or want colour advice — we&apos;re always happy to chat.
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

            {/* Location and Google Map */}
            <div
              className="bg-white border rounded-xl overflow-hidden mt-1 shadow-sm"
              style={{ borderColor: COLORS.border }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin
                    size={22}
                    style={{ color: COLORS.accent }}
                  />

                  <h3
                    className="font-display text-lg font-bold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Visit Our Location
                  </h3>
                </div>

                {/* Existing address preserved */}
                <p
                  className="text-sm font-medium leading-relaxed"
                  style={{ color: COLORS.primaryText }}
                >
                  {settings?.address}
                </p>

                <p
                  className="text-xs mt-2"
                  style={{ color: COLORS.secondaryText }}
                >
                  6°4&apos;31&quot;N 3°24&apos;45&quot;E
                </p>

                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold hover:underline underline-offset-4"
                  style={{ color: COLORS.accent }}
                >
                  Get Directions on Google Maps
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Map displayed below the address */}
              <div className="w-full h-64">
                <iframe
                  title="Paintdomain location on Google Maps"
                  src={GOOGLE_MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
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
                    Thank you for reaching out. We&apos;ll get back to you
                    within 24 hours.
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
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
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
                  {(
                    [
                      ["fullName", "Full Name", "Your full name"],
                      ["phoneNumber", "Phone Number", "+234..."],
                    ] as const
                  ).map(([name, label, ph]) => (
                    <div
                      key={name}
                      className="flex flex-col gap-1.5"
                    >
                      <label
                        htmlFor={name}
                        className="text-xs font-semibold"
                        style={{ color: COLORS.primaryText }}
                      >
                        {label}
                      </label>

                      <input
                        id={name}
                        name={name}
                        value={form[name]}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            [name]: e.target.value,
                          }))
                        }
                        placeholder={ph}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="subject"
                    className="text-xs font-semibold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        subject: e.target.value,
                      }))
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
                    htmlFor="message"
                    className="text-xs font-semibold"
                    style={{ color: COLORS.primaryText }}
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        message: e.target.value,
                      }))
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

      {/* Floating WhatsApp button: fixed to the right while scrolling */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Paintdomain on WhatsApp"
        className="whatsapp-float"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="whatsapp-icon"
          fill="currentColor"
        >
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12.13 0C5.6 0 .29 5.3.29 11.83c0 2.09.55 4.13 1.6 5.93L.2 24l6.4-1.68a11.85 11.85 0 0 0 5.53 1.37h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.46-8.37ZM12.14 21.7a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.82 9.82 0 0 1-1.5-5.21c0-5.44 4.43-9.87 9.88-9.87a9.8 9.8 0 0 1 6.99 2.9 9.8 9.8 0 0 1 2.89 6.99c0 5.44-4.43 9.87-9.87 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>

        <span>Chat with us</span>
      </a>

      <style jsx>{`
        .whatsapp-float {
          position: fixed;
          right: 24px;
          bottom: 28px;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 22px;
          border: 3px solid #ffffff;
          border-radius: 9999px;
          background: #00c853;
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          box-shadow:
            0 0 0 0 rgba(0, 200, 83, 0.9),
            0 0 24px rgba(0, 200, 83, 0.9);
          animation: whatsapp-pulse 0.9s infinite;
          will-change: transform, box-shadow;
        }

        .whatsapp-float:hover {
          background: #00a844;
          color: #ffffff;
          animation-play-state: paused;
          transform: scale(1.12);
        }

        .whatsapp-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        @keyframes whatsapp-pulse {
          0% {
            transform: scale(1);
            box-shadow:
              0 0 0 0 rgba(0, 200, 83, 0.95),
              0 0 18px rgba(0, 200, 83, 0.8);
          }

          50% {
            transform: scale(1.12);
            box-shadow:
              0 0 0 14px rgba(0, 200, 83, 0.32),
              0 0 38px 12px rgba(0, 200, 83, 1);
          }

          100% {
            transform: scale(1);
            box-shadow:
              0 0 0 28px rgba(0, 200, 83, 0),
              0 0 18px rgba(0, 200, 83, 0.8);
          }
        }

        @media (max-width: 640px) {
          .whatsapp-float {
            right: 16px;
            bottom: 20px;
            padding: 15px;
            gap: 0;
          }

          .whatsapp-float span {
            display: none;
          }

          .whatsapp-icon {
            width: 30px;
            height: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .whatsapp-float {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
