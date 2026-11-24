
"use client";

import { useState } from "react";
import Link from "next/link";
import { apiLogin, apiForgotPassword } from "@/lib/userApi";
import { saveToken } from "@/lib/endpointRoute";
import { Eye, EyeOff, Lock, Mail, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

// ── Color Palette Reference ────────────────────────────────────────────────
const COLORS = {
  bg: "#F8F5F0",
  cardBg: "#FFFFFF",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
  accentHover: "#B0873B",
  border: "rgba(197, 154, 70, 0.2)",
};

// Reusable Input Style Matching Register Page
const inputCls =
  "w-full bg-[#F8F5F0] border border-[rgba(197,154,70,0.3)] text-[#1F1F1F] placeholder:text-[#9A9A9A] pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C59A46] focus:ring-1 focus:ring-[#C59A46] focus:bg-white transition-all";

// Forgot Password Modal Component
function ForgotPasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await apiForgotPassword({ email });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 bg-white border rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        style={{ borderColor: COLORS.border }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A7A7A] hover:text-[#1F1F1F] transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3
              className="text-xl font-bold mb-2"
              style={{ color: COLORS.primaryText }}
            >
              Password Reset Link Sent
            </h3>

            <p
              className="text-sm mb-6"
              style={{ color: COLORS.secondaryText }}
            >
              We&apos;ve sent a password reset link to{" "}
              <span
                className="font-semibold"
                style={{ color: COLORS.primaryText }}
              >
                {email}
              </span>
              . Check your inbox and follow the link to reset your password.
            </p>

            <button
              onClick={onClose}
              className="w-full text-white font-semibold py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] text-sm"
              style={{ backgroundColor: COLORS.accent }}
            >
              Got it
            </button>
          </div>
        ) : (
          /* Form State */
          <div className="p-8">
            <h3
              className="font-display text-xl font-bold mb-1"
              style={{ color: COLORS.primaryText }}
            >
              Forgot Password?
            </h3>

            <p
              className="text-sm mb-6"
              style={{ color: COLORS.secondaryText }}
            >
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold"
                  style={{ color: COLORS.primaryText }}
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: COLORS.secondaryText }}
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50 text-sm"
                style={{ backgroundColor: COLORS.accent }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={15} />
                )}

                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={onClose}
                className="text-center text-sm transition-colors hover:underline"
                style={{ color: COLORS.secondaryText }}
              >
                Back to login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiLogin(form);
      saveToken(data.token);

      if (data?.user?.role === "admin") {
        router.push("/dashboard");
      } else if (data?.user?.role === "painter") {
        router.push("/painter-dashboard");
      } else {
        const redirectTo = new URLSearchParams(
          window.location.search
        ).get("redirect");

        if (redirectTo === "/tools" || redirectTo === "/shop") {
          router.push(redirectTo);
        } else {
          router.push("/user-dashboard");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `linear-gradient(rgba(197, 154, 70, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197, 154, 70, 0.05) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    >
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex flex-col items-center gap-1 group"
          >
            <span
              className="font-display text-3xl font-bold transition-colors"
              style={{ color: COLORS.primaryText }}
            >
              Paint Domain
            </span>
          </Link>
        </div>

        {/* Card Container */}
        <div
          className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm"
          style={{ borderColor: COLORS.border }}
        >
          <h2
            className="font-display text-2xl font-bold mb-1"
            style={{ color: COLORS.primaryText }}
          >
            Welcome back
          </h2>

          <p className="text-sm mb-7" style={{ color: COLORS.secondaryText }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-semibold"
                style={{ color: COLORS.primaryText }}
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.secondaryText }}
                />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  className="text-xs font-semibold"
                  style={{ color: COLORS.primaryText }}
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-medium transition-colors hover:underline"
                  style={{ color: COLORS.accent }}
                >
                  Forgot?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.secondaryText }}
                />

                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: COLORS.secondaryText }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50 mt-2 text-sm"
              style={{ backgroundColor: COLORS.accent }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight size={15} />
              )}

              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6 font-medium"
            style={{ color: COLORS.secondaryText }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold underline underline-offset-4 transition-colors hover:opacity-80"
              style={{ color: COLORS.accent }}
            >
              Create a customer account
            </Link>
          </p>

          <p
            className="text-center flex items-center gap-2 flex-wrap justify-center text-sm mt-6 font-medium"
            style={{ color: COLORS.secondaryText }}
          >
            Or
            <Link
              href="/painter-account"
              className="font-semibold underline underline-offset-4 transition-colors hover:opacity-80"
              style={{ color: COLORS.accent }}
            >
              Create a painter account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6">
          <Link
            href="/"
            className="transition-colors hover:underline"
            style={{ color: COLORS.secondaryText }}
          >
            ← Back to homepage
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </main>
  );
}
