"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiGetProfile, apiUpdateProfile, apiChangePassword } from "@/lib/userApi";
import { clearToken } from "@/lib/endpointRoute";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  User, Lock, Mail, Phone, Save, Eye, EyeOff, Loader, ShieldCheck,
} from "lucide-react";

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const inputCls =
  "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

const TABS = [
  { key: "profile", label: "Profile Info", icon: User },
  { key: "password", label: "Change Password", icon: Lock },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // ── Profile data ────────────────────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiGetProfile();
      const data = (res?.user ?? res?.data ?? res) as Profile;
      return data;
    },
  });

  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
      });
    }
  }, [profile]);

  const profileMutation = useMutation({
    mutationFn: () => apiUpdateProfile(profileForm),
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: (err: Error) => toast.error(err.message || "Failed to update profile"),
  });

  // ── Password form ────────────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: () =>
      apiChangePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed successfully. Logging you out...");
      setTimeout(() => {
        clearToken();
        router.push("/login");
      }, 1500);
    },
    onError: (err: Error) => toast.error(err.message || "Failed to change password"),
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    passwordMutation.mutate();
  };

  return (
    <main className="bg-brand-black">

      {/* Header */}
      <section className=" px-4 sm:px-6 lg:px-8 border-b border-brand-border/40">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Account</p>
          <h1 className="font-display text-4xl font-bold text-white">My Profile</h1>
          <p className="text-brand-mid text-sm mt-2">Manage your account information and security</p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-brand-border/40">
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative ${
                    active ? "text-brand-accent" : "text-brand-mid hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Card */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8">

            {/* ── PROFILE TAB ───────────────────────────────────────────────── */}
            {activeTab === "profile" && (
              isLoading ? (
                <div className="py-16 flex justify-center">
                  <Loader size={26} className="animate-spin text-brand-accent" />
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); profileMutation.mutate(); }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center text-brand-black font-bold text-lg flex-shrink-0">
                      {(profile?.firstName?.[0] ?? "U").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {profile?.firstName} {profile?.lastName}
                      </p>
                      <p className="text-brand-mid text-xs flex items-center gap-1.5 mt-0.5">
                        <Mail size={11} /> {profile?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-brand-lt-gray text-xs font-medium">First Name</label>
                      <input
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                        placeholder="John"
                        className={inputCls}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-brand-lt-gray text-xs font-medium">Last Name</label>
                      <input
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                        placeholder="Doe"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle" />
                      <input
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                        placeholder="08012345678"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 opacity-60">
                    <label className="text-brand-lt-gray text-xs font-medium">Email Address</label>
                    <input
                      value={profile?.email ?? ""}
                      disabled
                      className={`${inputCls} cursor-not-allowed`}
                    />
                    <p className="text-brand-subtle text-[11px]">Email cannot be changed</p>
                  </div>

                  <button
                    type="submit"
                    disabled={profileMutation.isPending}
                    className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                      font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all
                      text-sm disabled:opacity-50 mt-2"
                  >
                    {profileMutation.isPending
                      ? <Loader size={15} className="animate-spin" />
                      : <Save size={15} />}
                    {profileMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              )
            )}

            {/* ── PASSWORD TAB ──────────────────────────────────────────────── */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-9 h-9 rounded-lg bg-brand-accent-muted border border-brand-accent/20 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Update Your Password</h3>
                    <p className="text-brand-mid text-xs mt-0.5">You'll be logged out after a successful change</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className={`${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-brand-lt-gray transition-colors"
                    >
                      {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">New Password *</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Min. 8 characters"
                      className={`${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-brand-lt-gray transition-colors"
                    >
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Re-enter new password"
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                    font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all
                    text-sm disabled:opacity-50 mt-2"
                >
                  {passwordMutation.isPending
                    ? <Loader size={15} className="animate-spin" />
                    : <Lock size={15} />}
                  {passwordMutation.isPending ? "Updating..." : "Change Password"}
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

    </main>
  );
}