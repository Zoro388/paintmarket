"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiSetNewPassword } from "@/lib/userApi";
import { Eye, EyeOff, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

// ── Inner form — must be wrapped in Suspense because it calls useSearchParams ──
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await apiSetNewPassword({ token, password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-brand-black flex items-center justify-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(212,175,120,0.06) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <span className="font-display text-3xl font-bold text-white group-hover:text-brand-accent transition-colors">
              Paint Domain
            </span>
            <span className="text-brand-accent text-[10px] tracking-[0.18em] uppercase">
              &amp; Primary Interior Builders
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl">
          {!tokenValid ? (
            /* Invalid / missing token */
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
              <p className="text-brand-mid text-sm mb-6">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-brand-accent text-brand-black
                  font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-colors text-sm"
              >
                Back to Login
              </Link>
            </div>
          ) : success ? (
            /* Success */
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Password Reset Successfully!</h2>
              <p className="text-brand-mid text-sm mb-6">
                Your password has been reset. You will be redirected to login in a few seconds.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-brand-accent text-brand-black
                  font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-accent-lt transition-colors text-sm"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            /* Form */
            <>
              <h2 className="font-display text-2xl font-bold text-white mb-1">Reset Password</h2>
              <p className="text-brand-mid text-sm mb-7">Enter your new password below</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium tracking-wide">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-raised border border-brand-border text-white
                        placeholder-brand-subtle pl-10 pr-10 py-2.5 rounded-lg text-sm
                        focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle
                        hover:text-brand-lt-gray transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-brand-subtle text-xs mt-1">Minimum 8 characters</p>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-raised border border-brand-border text-white
                        placeholder-brand-subtle pl-10 pr-10 py-2.5 rounded-lg text-sm
                        focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle
                        hover:text-brand-lt-gray transition-colors"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                    font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all
                    disabled:opacity-50 mt-1 text-sm"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="text-center text-brand-mid text-sm">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-brand-accent hover:text-brand-accent-lt underline underline-offset-4 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-brand-subtle text-xs mt-6">
          <Link href="/" className="hover:text-brand-mid transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}

// ── Page export — Suspense required by Next.js for useSearchParams ─────────────
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}