
"use client";

import { useState } from "react";
import { apiLogin, apiSignup } from "@/lib/userApi";
import { saveToken } from "@/lib/endpointRoute";
import { Eye, EyeOff, X, ArrowRight, Lock, Mail, User, Phone } from "lucide-react";

interface ToolAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export default function ToolAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
}: ToolAuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#C59A46] focus:ring-1 focus:ring-[#C59A46]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;

      if (mode === "signup") {
        data = await apiSignup({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
        });

        // If signup does not return a token, log the customer in.
        if (data?.token) {
          saveToken(data.token);
        } else {
          data = await apiLogin({
            email: form.email,
            password: form.password,
          });

          if (!data?.token) {
            throw new Error("Account created. Please sign in to continue.");
          }

          saveToken(data.token);
        }
      } else {
        data = await apiLogin({
          email: form.email,
          password: form.password,
        });

        if (!data?.token) {
          throw new Error("Login was unsuccessful. Please try again.");
        }

        saveToken(data.token);
      }

      onAuthenticated();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        (mode === "signup"
          ? "Unable to create your account."
          : "Unable to sign in.")
      );
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      {/* Dark backdrop */}
      <button
        type="button"
        aria-label="Close authentication window"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Authentication panel */}
      <div className="relative z-10 flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Left promotional panel */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#171717] p-10 text-white">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="rounded-xl bg-[#C59A46] p-3 text-black">
                <Lock size={23} />
              </div>
              <span className="text-2xl font-bold">
                Paint Domain
              </span>
            </div>

            <h2 className="mb-5 text-3xl font-extrabold leading-tight">
              Everything you need for your next painting project.
            </h2>

            <p className="text-sm leading-7 text-gray-400">
              Sign in or create an account to shop professional painting
              tools and equipment. Your selected tool will be waiting
              in your cart when you're done.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-gray-400">
              Quality tools. Professional results.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="relative w-full p-6 sm:p-10 md:w-1/2">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={21} />
          </button>

          <div className="mb-7 pr-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#C59A46]">
              Paint Domain Account
            </p>

            <h2 className="text-2xl font-extrabold text-gray-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {mode === "login"
                ? "Sign in to continue adding tools to your cart."
                : "Create a customer account to continue shopping."}
            </p>
          </div>

          {/* Mode switch */}
          <div className="mb-7 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => changeMode("login")}
              className={`rounded-md py-2.5 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-[#C59A46] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => changeMode("signup")}
              className={`rounded-md py-2.5 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-[#C59A46] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      className={`${inputClass} pl-9`}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone number"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className={`${inputClass} pl-10 pr-11`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C59A46] px-5 py-3.5 text-sm font-bold text-black transition hover:bg-[#B0873B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <ArrowRight size={17} />
              )}

              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In & Continue"
                  : "Create Account & Continue"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-6 text-gray-500">
            {mode === "login"
              ? "New to Paint Domain? "
              : "Already have an account? "}

            <button
              type="button"
              onClick={() =>
                changeMode(mode === "login" ? "signup" : "login")
              }
              className="font-bold text-[#B0873B] hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
