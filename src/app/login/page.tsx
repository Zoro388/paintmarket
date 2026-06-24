"use client";
import { useState } from "react";
import Link from "next/link";
import { apiLogin, apiForgotPassword } from "@/lib/userApi";
import { saveToken } from "@/lib/endpointRoute";
import { Eye, EyeOff, Lock, Mail, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Forgot Password Modal Component
function ForgotPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic email validation
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
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative z-10 bg-brand-card border border-brand-border rounded-2xl shadow-2xl w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-mid hover:text-brand-white transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brand-white mb-2">Password Reset Link Sent</h3>
            <p className="text-brand-mid text-sm mb-6">
              We've sent a password reset link to <span className="text-brand-white font-medium">{email}</span>. 
              Check your inbox and follow the link to reset your password.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-brand-accent text-brand-black font-semibold py-2.5 rounded-lg hover:bg-brand-accent-lt transition-colors"
            >
              Got it
            </button>
          </div>
        ) : (
          /* Form State */
          <div className="p-8">
            <h3 className="text-xl font-bold text-brand-white mb-1">Forgot Password?</h3>
            <p className="text-brand-mid text-sm mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-brand-raised border border-brand-border text-white
                      placeholder-brand-subtle pl-10 pr-4 py-2.5 rounded-lg text-sm
                      focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card
                      transition-all"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                  font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-all
                  disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={15} />
                )}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={onClose}
                className="text-center text-brand-mid hover:text-brand-white text-sm transition-colors"
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
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router=useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await apiLogin(form);
      saveToken(data.token);
console.log(data)

data?.user.role=="admin" ? router.push("/dashboard") : router.push("/user-dashboard");
      // window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(212,175,120,0.06) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <span className="font-display text-3xl font-bold text-white
              group-hover:text-brand-accent transition-colors">
              Paint Domain
            </span>
            <span className="text-brand-accent text-[10px] tracking-[0.18em] uppercase">
              &amp; Primary Interior Builders
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl">
          <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-brand-mid text-sm mb-7">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-brand-raised border border-brand-border text-white
                    placeholder-brand-subtle pl-10 pr-4 py-2.5 rounded-lg text-sm
                    focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card
                    transition-all" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-brand-lt-gray text-xs font-medium tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-brand-accent hover:text-brand-accent-lt text-xs font-medium transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-brand-raised border border-brand-border text-white
                    placeholder-brand-subtle pl-10 pr-10 py-2.5 rounded-lg text-sm
                    focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card
                    transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle
                    hover:text-brand-lt-gray transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all
                disabled:opacity-50 mt-1 text-sm">
              {loading
                ? <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                : <ArrowRight size={15} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-brand-mid text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-accent hover:text-brand-accent-lt
              underline underline-offset-4 transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-brand-subtle text-xs mt-6">
          <Link href="/" className="hover:text-brand-mid transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </main>
  );
}
