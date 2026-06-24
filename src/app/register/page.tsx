"use client";
import { useState } from "react";
import Link from "next/link";
import { apiSignup } from "@/lib/userApi";
import { saveToken } from "@/lib/endpointRoute";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    try {
      const { confirm: _, ...body } = form;
      const data = await apiSignup(body);
      saveToken(data.token);
      console.log("Registration successful:", data);
      window.location.href = "/login"; // Redirect to login page after successful registration
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card transition-all";

  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}>
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <span className="font-display text-3xl font-bold text-white group-hover:text-brand-accent transition-colors">Paint Domain</span>
            <span className="text-brand-accent text-[10px] tracking-[0.18em] uppercase">&amp; Primary Interior Builders</span>
          </Link>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-2xl">
          <h2 className="font-display text-2xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-brand-mid text-sm mb-7">Join thousands of satisfied customers</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {[["firstName","First Name","John"],["lastName","Last Name","Doe"]].map(([name,label,ph]) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
                  <input type="text" required value={(form as Record<string,string>)[name]}
                    onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                    placeholder={ph} className={inputCls} />
                </div>
              ))}
            </div>

            {[
              ["email","Email Address","email","you@example.com"],
              ["phoneNumber","Phone Number","tel","+234..."],
            ].map(([name,label,type,ph]) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
                <input type={type} required value={(form as Record<string,string>)[name]}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  placeholder={ph} className={inputCls} />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-brand-lt-gray transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Confirm Password</label>
              <input type="password" required value={form.confirm}
                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Re-enter password" className={inputCls} />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all disabled:opacity-50 mt-1 text-sm">
              {loading ? <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={15} />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-brand-mid text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-accent hover:text-brand-accent-lt underline underline-offset-4 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
