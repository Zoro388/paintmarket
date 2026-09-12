"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiChangePassword } from "@/lib/userApi";
import { clearToken } from "@/lib/endpointRoute";
import {
  apiGetPainterProfile,
  apiUpdatePainterProfile,
  apiGetData,
} from "@/lib/painterApi";

import {
  User,
  Lock,
  Loader,
  Save,
  Eye,
  EyeOff,
  Camera,
  ShieldCheck,
  Plus,
  X,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
} from "lucide-react";

interface TagItem {
  _id: string;
  name: string;
  type?: string;
}
interface ImageObj {
  url: string;
  publicId: string;
  _id?: string;
}

interface PainterProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  city: string;
  state: string;
  yearsOfExperience: number;
  approvalStatus: string;
  isVerified: boolean;
  profileImage: ImageObj;
  skills: TagItem[];
  services: TagItem[];
  portfolioImages: ImageObj[];
}

type Tab = "profile" | "portfolio" | "password";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile Info", icon: User },
  { key: "portfolio", label: "Portfolio", icon: ImageIcon },
  { key: "password", label: "Change Password", icon: Lock },
];

const inputCls =
  "w-full bg-brand-black border border-brand-border text-brand-white placeholder-brand-mid " +
  "px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

// ── Dropdown Selectable Tag Component ──────────────────────────────────────────
function MasterTagPicker({
  label,
  selectedIds,
  masterList,
  onChange,
}: {
  label: string;
  selectedIds: string[];
  masterList: TagItem[];
  onChange: (ids: string[]) => void;
}) {
  const [selectedOption, setSelectedOption] = useState("");

  const addTag = (id: string) => {
    if (!id) return;
    if (selectedIds.includes(id)) {
      toast.error("Already selected");
      return;
    }
    onChange([...selectedIds, id]);
    setSelectedOption("");
  };

  const removeTag = (id: string) => {
    onChange(selectedIds.filter((item) => item !== id));
  };

  const selectedItems = masterList.filter((item) => selectedIds.includes(item._id));
  const availableOptions = masterList.filter((item) => !selectedIds.includes(item._id));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-brand-lt-gray text-xs font-medium">{label}</label>

      {/* Selected Items */}
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {selectedItems.length === 0 && (
          <span className="text-brand-subtle text-xs italic">None selected yet</span>
        )}
        {selectedItems.map((item) => (
          <span
            key={item._id}
            className="flex items-center gap-1.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs px-3 py-1 rounded-full"
          >
            {item.name}
            <button
              type="button"
              onClick={() => removeTag(item._id)}
              className="hover:text-red-400 transition-colors"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      {/* Select Dropdown */}
      <div className="flex gap-2">
        <select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            addTag(e.target.value);
          }}
          className={`${inputCls} flex-1`}
        >
          <option value="">Select a {label.toLowerCase().replace(/s$/, "")}...</option>
          {availableOptions.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PainterProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("profile");

  // Master Data from DB
  const [dbSkills, setDbSkills] = useState<TagItem[]>([]);
  const [dbServices, setDbServices] = useState<TagItem[]>([]);

  useEffect(() => {
    async function fetchMasterData() {
      try {
        const response = await apiGetData();
        if (response?.skills) setDbSkills(response.skills);
        if (response?.services) setDbServices(response.services);
      } catch (err) {
        console.error("Failed to fetch onboarding masterdata items:", err);
      }
    }
    fetchMasterData();
  }, []);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["painter-profile"],
    queryFn: async () => {
      const res = await apiGetPainterProfile();
      return res as { painter: PainterProfile };
    },
  });

  const profile = rawData?.painter;

  // Form State
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    city: "",
    state: "",
    yearsOfExperience: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  // Avatar Image
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const avatarRef = useRef<HTMLInputElement>(null);

  // Portfolio Images State
  const [existingPortfolio, setExistingPortfolio] = useState<ImageObj[]>([]);
  const [newPortfolioFiles, setNewPortfolioFiles] = useState<File[]>([]);
  const [newPortfolioPreviews, setNewPortfolioPreviews] = useState<string[]>([]);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      bio: profile.bio ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      yearsOfExperience: String(profile.yearsOfExperience ?? ""),
    });
    setSkills(profile.skills?.map((s) => s._id) ?? []);
    setServices(profile.services?.map((s) => s._id) ?? []);
    setAvatarPreview(profile.profileImage?.url ?? "");
    setExistingPortfolio(profile.portfolioImages ?? []);
    setNewPortfolioFiles([]);
    setNewPortfolioPreviews([]);
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
    e.target.value = "";
  };

  const handlePortfolioFilesAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewPortfolioFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewPortfolioPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeExistingPortfolioImage = (idToRemove?: string) => {
    if (!idToRemove) return;
    setExistingPortfolio((prev) => prev.filter((img) => img._id !== idToRemove));
  };

  const removeNewPortfolioFile = (index: number) => {
    setNewPortfolioFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Main Unified Update Mutation
  const profileMutation = useMutation({
    mutationFn: () =>
      apiUpdatePainterProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        bio: form.bio,
        city: form.city,
        state: form.state,
        yearsOfExperience: Number(form.yearsOfExperience),
        skills,
        services,
        ...(avatarFile ? { profileImage: avatarFile } : {}),
        portfolioImages: newPortfolioFiles,
        retainedPortfolioIds: existingPortfolio
          .map((img) => img._id)
          .filter((id): id is string => Boolean(id)),
      }),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["painter-profile"] });
    },
    onError: (err: Error) => toast.error(err.message || "Update failed"),
  });

  // Password tab state
  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: () =>
      apiChangePassword({
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed. Logging you out…");
      setTimeout(() => {
        clearToken();
        router.push("/login");
      }, 1500);
    },
    onError: (err: Error) => toast.error(err.message || "Password change failed"),
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (pw.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    passwordMutation.mutate();
  };

  const initials =
    `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase() || "P";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Avatar Header */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-accent/40 bg-brand-raised flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-brand-accent font-bold text-2xl font-display">
                {initials}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 bg-brand-accent text-brand-black rounded-full flex items-center justify-center hover:bg-brand-accent-lt transition-colors shadow-lg"
            title="Change photo"
          >
            <Camera size={13} />
          </button>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-brand-white font-bold text-lg font-display">
            {profile?.firstName} {profile?.lastName}
          </h2>
          <p className="text-brand-mid text-sm mt-0.5">{profile?.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
            {profile?.city && (
              <span className="text-brand-mid text-xs">
                {profile.city}, {profile.state}
              </span>
            )}
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border capitalize ${
                profile?.approvalStatus === "approved"
                  ? "text-green-400 bg-green-950/40 border-green-700/40"
                  : "text-yellow-400 bg-yellow-950/40 border-yellow-700/40"
              }`}
            >
              {profile?.approvalStatus}
            </span>
            {profile?.isVerified && (
              <span className="text-xs text-brand-accent flex items-center gap-1">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-brand-border/40 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                active ? "text-brand-accent" : "text-brand-mid hover:text-brand-white"
              }`}
            >
              <Icon size={14} />
              {label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Info */}
      {tab === "profile" && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-4">
              Personal Information
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">First Name</label>
                <input
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  placeholder="First name"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Last Name</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  placeholder="Last name"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Phone Number</label>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                  placeholder="08012345678"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5 opacity-60">
                <label className="text-brand-lt-gray text-xs font-medium">Email Address</label>
                <input
                  value={profile?.email ?? ""}
                  disabled
                  className={`${inputCls} cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          {/* Location Details (City & State) */}
          <div className="border-t border-brand-border/30 pt-5">
            <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-4">
              Location
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Lagos"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">State</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                  placeholder="e.g. Lagos"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border/30 pt-5">
            <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-4">
              Professional Details
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={(e) => setForm((p) => ({ ...p, yearsOfExperience: e.target.value }))}
                  placeholder="e.g. 5"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Bio</label>
                <textarea
                  value={form.bio}
                  rows={4}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell clients about yourself..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Master Skills */}
          <div className="border-t border-brand-border/30 pt-5">
            <MasterTagPicker
              label="Skills"
              selectedIds={skills}
              masterList={dbSkills}
              onChange={setSkills}
            />
          </div>

          {/* Master Services */}
          <div className="border-t border-brand-border/30 pt-5">
            <MasterTagPicker
              label="Services"
              selectedIds={services}
              masterList={dbServices}
              onChange={setServices}
            />
          </div>

          {/* Save Button */}
          <div className="border-t border-brand-border/30 pt-4">
            <button
              type="button"
              onClick={() => profileMutation.mutate()}
              disabled={profileMutation.isPending}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-8 py-3 rounded-lg hover:bg-brand-accent-lt transition-all text-sm disabled:opacity-50 w-full sm:w-auto"
            >
              {profileMutation.isPending ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {profileMutation.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Portfolio Tab */}
      {tab === "portfolio" && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-1">
                Portfolio Images
              </p>
              <p className="text-brand-mid text-xs">
                Upload new photos or remove existing items from your portfolio
              </p>
            </div>
            <button
              type="button"
              onClick={() => portfolioInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-brand-accent/20 border border-brand-accent/40 text-brand-accent font-semibold px-4 py-2 rounded-lg text-xs hover:bg-brand-accent/30 transition-colors"
            >
              <UploadCloud size={13} /> Select Images
            </button>
            <input
              ref={portfolioInputRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handlePortfolioFilesAdd}
            />
          </div>

          {/* Existing & New Images Display */}
          {existingPortfolio.length === 0 && newPortfolioPreviews.length === 0 ? (
            <div className="border border-dashed border-brand-border/40 rounded-xl py-14 flex flex-col items-center gap-2 text-center">
              <ImageIcon size={36} className="text-brand-mid" />
              <p className="text-brand-mid text-sm">No portfolio images added</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Saved Portfolio Images */}
              {existingPortfolio.map((img, i) => (
                <div
                  key={img._id || img.publicId || i}
                  className="relative aspect-square rounded-xl overflow-hidden border border-brand-border/30 group"
                >
                  <img
                    src={img.url}
                    alt={`Portfolio ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPortfolioImage(img._id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                    title="Remove Image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {/* Newly Selected Preview Files */}
              {newPortfolioPreviews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-brand-accent group"
                >
                  <img
                    src={url}
                    alt={`New upload ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 bg-brand-accent text-brand-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewPortfolioFile(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save Profile Button */}
          <div className="border-t border-brand-border/30 pt-4">
            <button
              type="button"
              onClick={() => profileMutation.mutate()}
              disabled={profileMutation.isPending}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-8 py-3 rounded-lg hover:bg-brand-accent-lt transition-all text-sm disabled:opacity-50 w-full sm:w-auto"
            >
              {profileMutation.isPending ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {profileMutation.isPending ? "Saving Portfolio Changes…" : "Save Portfolio Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Password Tab */}
      {tab === "password" && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-brand-accent-muted border border-brand-accent/20 flex items-center justify-center">
              <ShieldCheck size={16} className="text-brand-accent" />
            </div>
            <div>
              <h3 className="text-brand-white font-semibold text-sm">Update Password</h3>
              <p className="text-brand-mid text-xs mt-0.5">
                You'll be logged out after a successful change
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={pw.currentPassword}
                  onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
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
                  value={pw.newPassword}
                  onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
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
              <label className="text-brand-lt-gray text-xs font-medium">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={pw.confirmPassword}
                onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Re-enter new password"
                className={inputCls}
              />
              {pw.confirmPassword && pw.newPassword !== pw.confirmPassword && (
                <p className="text-red-400 text-[11px]">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-3 rounded-lg hover:bg-brand-accent-lt transition-all text-sm disabled:opacity-50 mt-2 w-full sm:w-auto px-8"
            >
              {passwordMutation.isPending ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Lock size={15} />
              )}
              {passwordMutation.isPending ? "Updating…" : "Change Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}