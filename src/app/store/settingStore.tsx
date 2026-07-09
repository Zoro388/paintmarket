import { create } from "zustand";
import endpointRoute from "@/lib/endpointRoute";
// Match the exact database keys returned by your API
export interface SettingsData {
  _id?: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  footerColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroBanner: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutImage: string;
  aboutBanner: string;
  shopTitle: string;
  shopDescription: string;
  shopBanner: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  copyright: string;
  footerDescription: string;
  footerLogo: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  maintenanceMode: boolean;
  showGallery: boolean;
  showNewsletter: boolean;
  showPortfolio: boolean;
  showTestimonials: boolean;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterBanner: string;
}

interface SettingsStore {
  settings: SettingsData;
  isLoading: boolean;
  error: string | null;
  
  // File upload staging mirrors (for local UI blob previews)
  logoFile: File | null;
  heroImageFile: File | null;
  aboutImageFile: File | null;
  logoPreviewUrl: string;
  heroPreviewUrl: string;
  aboutPreviewUrl: string;

  fetchSettings: () => Promise<void>;
  updateField: (key: keyof SettingsData, value: any) => void;
  setImageFile: (field: "logo" | "heroImage" | "aboutImage", file: File | null) => void;
  removeImageFile: (field: "logo" | "heroImage" | "aboutImage") => void;
  saveSettings: () => Promise<boolean>;
}

const initialSettingsState: SettingsData = {
  siteName: "", siteDescription: "", logo: "", favicon: "",
  primaryColor: "#D4AF78", secondaryColor: "#0A2E63", backgroundColor: "#FFFFFF",
  textColor: "#222222", buttonColor: "#D4AF78", footerColor: "#0A2E63",
  heroTitle: "", heroSubtitle: "", heroImage: "", heroButtonText: "", heroButtonLink: "", heroBanner: "",
  aboutTitle: "", aboutSubtitle: "", aboutDescription: "", aboutImage: "", aboutBanner: "",
  shopTitle: "", shopDescription: "", shopBanner: "",
  address: "", phone: "", whatsapp: "", email: "", workingHours: "",
  facebook: "", instagram: "", twitter: "", linkedin: "", tiktok: "", youtube: "",
  copyright: "", footerDescription: "", footerLogo: "",
  metaTitle: "", metaDescription: "", metaKeywords: "", ogImage: "",
  maintenanceMode: false, showGallery: true, showNewsletter: true, showPortfolio: true, showTestimonials: true,
  newsletterTitle: "", newsletterSubtitle: "", newsletterBanner: ""
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: initialSettingsState,
  isLoading: false,
  error: null,

  logoFile: null,
  heroImageFile: null,
  aboutImageFile: null,
  logoPreviewUrl: "",
  heroPreviewUrl: "",
  aboutPreviewUrl: "",

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await endpointRoute.get("/settings");
      // Unpack safely based on your working backend configuration structure
      const rawData = response.data?.data ?? response.data?.settings ?? response.data;
      
      if (rawData) {
        // Build initial states matching incoming document shapes cleanly
        const mergedSettings = { ...initialSettingsState, ...rawData };
        set({
          settings: mergedSettings,
          logoPreviewUrl: mergedSettings.logo || "",
          heroPreviewUrl: mergedSettings.heroImage || "",
          aboutPreviewUrl: mergedSettings.aboutImage || "",
        });
      }
    } catch (err: any) {
      set({ error: err?.message || "Failed loading configuration document" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateField: (key, value) => {
    set((state) => ({
      settings: { ...state.settings, [key]: value }
    }));
  },

  setImageFile: (field, file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (field === "logo") set({ logoFile: file, logoPreviewUrl: objectUrl });
    if (field === "heroImage") set({ heroImageFile: file, heroPreviewUrl: objectUrl });
    if (field === "aboutImage") set({ aboutImageFile: file, aboutPreviewUrl: objectUrl });
  },

  removeImageFile: (field) => {
    if (field === "logo") set((state) => ({ logoFile: null, logoPreviewUrl: "", settings: { ...state.settings, logo: "" } }));
    if (field === "heroImage") set((state) => ({ heroImageFile: null, heroPreviewUrl: "", settings: { ...state.settings, heroImage: "" } }));
    if (field === "aboutImage") set((state) => ({ aboutImageFile: null, aboutPreviewUrl: "", settings: { ...state.settings, aboutImage: "" } }));
  },

  saveSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { settings, logoFile, heroImageFile, aboutImageFile } = get();
      const submissionForm = new FormData();

      // Append standard text strings & features checkboxes
      Object.entries(settings).forEach(([key, val]) => {
        if (key !== "logo" && key !== "heroImage" && key !== "aboutImage") {
          submissionForm.append(key, String(val ?? ""));
        }
      });

      // Handle raw Multi-part uploads if selected
      if (logoFile) submissionForm.append("logo", logoFile);
      if (heroImageFile) submissionForm.append("heroImage", heroImageFile);
      if (aboutImageFile) submissionForm.append("aboutImage", aboutImageFile);

      // Execute configuration save
      await endpointRoute.put("/settings", submissionForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear staged binary targets while preserving settings
      set({ logoFile: null, heroImageFile: null, aboutImageFile: null });
      return true;
    } catch (err: any) {
      set({ error: err?.message || "Error saving updated configurations" });
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));