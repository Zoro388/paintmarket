// "use client";
// import { useEffect, useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// import {
//   apiSendCampaign,
//   // apiSendUserMessage,
//   adminGetAllUsers,
  
//   adminGetAllSettings
// } from "@/lib/adminApi";
// import endpointRoute from "@/lib/endpointRoute";
// import { Send, Users, User, X, Loader, Mail, Link2, Type, AlignLeft } from "lucide-react";

// interface Subscriber {
//   id: string;
//   email: string;
//   createdAt: string;
// }

// const inputCls =
//   "w-full bg-brand-raised border border-brand-mid/40 text-white placeholder-brand-mid px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

// const EMPTY_FORM = { title: "", message: "", buttonText: "", buttonLink: "" };

// export default function NewsletterCampaignPage() {
//   const [mode, setMode] = useState<"all" | "single">("all");
//   const [selectedUser, setSelectedUser] = useState<Subscriber | null>(null);
//   const [userPickerOpen, setUserPickerOpen] = useState(false);
//   const [userSearch, setUserSearch] = useState("");

//   // Fetch subscribers for single-user picker

  

// const { data: subData, isLoading: subLoading } = useQuery({
//   queryKey: ["settings"],
//   queryFn: async () => {
//     try {
//       const res = await adminGetAllSettings();
//       console.log('Unwrapped API response:', res);
      
//       // Handle it defensively matching your working media query style
//       return res?.data ?? res?.settings ?? res;
//     } catch (error) {
//       console.error("Settings fetch failed:", error);
//       return null; // Return a safe default instead of crashing into undefined
//     }
//   },
// });

// console.log('data', subData)
// console.log(subLoading?"loading..":subData)
// console.log("loading:", subLoading, "data:", subData)


//   // Send to single user
//   // const singleMutation = useMutation({
//   //   mutationFn: () => apiSendUserMessage(selectedUser!.id, form),
//   //   onSuccess: () => {
//   //     toast.success(`Message sent to ${selectedUser!.email}`);
//   //     setForm(EMPTY_FORM);
//   //     setSelectedUser(null);
//   //     setMode("all");
//   //   },
//   //   onError: (err: Error) => toast.error(err.message || "Failed to send message"),
//   // });

 

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div>
//         <h1 className="font-display text-2xl font-bold text-white">Send Newsletter</h1>
//         <p className="text-brand-mid text-sm mt-1">
//           Send a campaign to all subscribers or a direct message to a single user
//         </p>
//       </div>

//       {/* Mode toggle */}
     

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Form */}
//         <div className="lg:col-span-2 bg-brand-card border border-brand-mid/30 rounded-2xl p-6 sm:p-8">

           

//             {/* Title */}
//          \

         
//         </div>

      
//       </div>

//       {/* User picker modal */}
    
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
// import { useSettingsStore } from "@/store/settingsStore";
import { useSettingsStore } from "@/app/store/settingStore";

type TabKeys = "branding" | "heroAbout" | "shopContent" | "socials" | "seo";

export default function GlobalSettingsPage() {
  const {
    settings, isLoading, error,
    logoPreviewUrl, heroPreviewUrl,
    //  aboutPreviewUrl,
    fetchSettings, updateField, setImageFile, removeImageFile, saveSettings
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<TabKeys>("branding");

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
console.log('settings',settings)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      updateField(name as any, checked);
    } else {
      updateField(name as any, value);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: "logo" | "heroImage" | "aboutImage") => {
    const targetFile = e.target.files?.[0] || null;
    if (targetFile) setImageFile(fieldName, targetFile);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveSettings();
    if (success) alert("Application settings synchronized successfully!");
  };

  if (isLoading && !settings._id) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-accent">
        <p className="text-lg tracking-wider animate-pulse">Syncing Site Engine Records...</p>
      </div>
    );
  }

  return (
    <div className=" bg-brand-black bg-subtle-grid font-body text-brand-white px-4 py-12 md:px-8">
      <div className=" mx-auto animate-fade-up">
        
        {/* Header Block */}
        <header className="mb-10  md:text-left">
          
          <div>
          <h1 className="font-display text-2xl font-bold text-white">            Engine Room <span className="text-brand-accent">Configurations</span>
</h1>
          <p className="text-brand-mid text-sm mt-0.5">
            Live configurations management panel for layout schemas, image assets, color arrays, and contextual sections.
          </p>
        </div>

          {error && <div className="mt-4 p-3 bg-red-900/40 border border-red-500 rounded text-red-200 text-sm">{error}</div>}
        </header>

        {/* Tab Selection Row */}
        <div className="flex border-b border-brand-border mb-8 overflow-x-auto scrollbar-none gap-2">
          {([
            { id: "branding", label: "1. Identity & Palette" },
            { id: "heroAbout", label: "2. Hero & About Sections" },
            { id: "shopContent", label: "3. Address & Sections" },
            { id: "socials", label: "4. Social Coordinates" },
            { id: "seo", label: "5. SEO Engine Meta" }
          ] as { id: TabKeys; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-medium text-xs tracking-wider uppercase border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? "border-brand-accent text-brand-accent bg-brand-surface/40" : "border-transparent text-brand-mid hover:text-brand-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Root Layout */}
        <form onSubmit={handleFormSubmit} className="bg-brand-card border border-brand-border rounded-xl p-6 md:p-8 shadow-xl space-y-8">
          
          {/* TAB 1: IDENTITY & PALETTE */}
          {activeTab === "branding" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pb-2">Website Branding Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Site Name</label>
                  <input type="text" name="siteName" value={settings.siteName} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" placeholder="e.g. Paint Domain Master" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Favicon Reference Path</label>
                  <input type="text" name="favicon" value={settings.favicon} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" placeholder="/favicon.ico" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Global Description Summary</label>
                <textarea name="siteDescription" value={settings.siteDescription} onChange={handleInputChange} rows={2} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition resize-none" placeholder="Short description overview..." />
              </div>

              {/* Logo Manager */}
              <div>
                <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Corporate Branding Logo</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-brand-surface rounded-lg border border-brand-border">
                  {logoPreviewUrl ? (
                    <div className="relative group w-20 h-20 bg-brand-black rounded border border-brand-border-lt flex items-center justify-center overflow-hidden">
                      <img src={logoPreviewUrl} alt="Logo preview" className="object-contain max-h-full max-w-full" />
                      <div className="absolute inset-0 bg-brand-black/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button type="button" onClick={() => removeImageFile("logo")} className="bg-red-600 text-white text-[10px] px-2 py-1 rounded">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-brand-raised border border-dashed border-brand-subtle flex items-center justify-center text-[10px] text-brand-subtle text-center px-1">No File</div>
                  )}
                  <div>
                    <input type="file" accept="image/*" id="logo-input" onChange={(e) => handleFileChange(e, "logo")} className="hidden" />
                    <label htmlFor="logo-input" className="bg-brand-raised hover:bg-brand-border border border-brand-border-lt text-brand-white text-xs px-4 py-2 rounded cursor-pointer transition">Select Logo Image</label>
                  </div>
                </div>
              </div>

              {/* Color Schema Interface */}
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pt-4 pb-2">Dynamic Color Swatch System</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "primaryColor", label: "Primary Theme" },
                  { name: "secondaryColor", label: "Secondary Layout" },
                  { name: "backgroundColor", label: "Canvas Base BG" },
                  { name: "textColor", label: "Global Typography" },
                  { name: "buttonColor", label: "Call-To-Action Element" },
                  { name: "footerColor", label: "Footer Wrapper" }
                ].map((color) => (
                  <div key={color.name} className="p-3 bg-brand-surface border border-brand-border rounded-lg flex items-center gap-3">
                    <input type="color" name={color.name} value={(settings as any)[color.name] || "#ffffff"} onChange={handleInputChange} className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent" />
                    <div>
                      <p className="text-[11px] text-brand-mid uppercase tracking-wider">{color.label}</p>
                      <p className="text-xs font-mono text-brand-white">{(settings as any)[color.name]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HERO & ABOUT SECTIONS */}
          {activeTab === "heroAbout" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pb-2">Hero Showcase Module</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Hero Section Title</label>
                  <input type="text" name="heroTitle" value={settings.heroTitle} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Hero Auxiliary Banner URL</label>
                  <input type="text" name="heroBanner" value={settings.heroBanner} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">CTA Action Button Text</label>
                  <input type="text" name="heroButtonText" value={settings.heroButtonText} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">CTA Redirection Link</label>
                  <input type="text" name="heroButtonLink" value={settings.heroButtonLink} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Hero Subtitle Context</label>
                <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleInputChange} rows={2} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition resize-none" />
              </div>

              {/* Hero Image Selector */}
              <div className="p-4 bg-brand-surface border border-brand-border rounded-lg">
                <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Hero Main Cover Image Asset</label>
                {heroPreviewUrl && <div className="relative group rounded overflow-hidden border border-brand-border mb-3 max-h-40 flex justify-center bg-brand-black"><img src={heroPreviewUrl} alt="Hero" className="object-cover h-40 w-full" /><div className="absolute inset-0 bg-brand-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"><button type="button" onClick={() => removeImageFile("heroImage")} className="bg-red-600 text-xs px-3 py-1.5 rounded">Remove Canvas Image</button></div></div>}
                <input type="file" accept="image/*" id="hero-img-input" onChange={(e) => handleFileChange(e, "heroImage")} className="hidden" />
                <label htmlFor="hero-img-input" className="inline-block bg-brand-raised border border-brand-border-lt text-brand-white text-xs px-4 py-2 rounded cursor-pointer">Choose Hero File Image</label>
              </div>

              {/* About Us Segment */}
              
            </div>
          )}

          {/* TAB 3: CONTACT & BUSINESS CONTROLS */}
          {activeTab === "shopContent" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pb-2">Business Communications & Logistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Public Telephone Line</label>
                  <input type="text" name="phone" value={settings.phone} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">WhatsApp Number</label>
                  <input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Business Email Address</label>
                  <input type="email" name="email" value={settings.email} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Weekly Operational Hours</label>
                  <input type="text" name="workingHours" value={settings.workingHours} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Physical Shop Showroom Address</label>
                <textarea name="address" value={settings.address} onChange={handleInputChange} rows={2} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition resize-none" />
              </div>

              {/* Boolean Component Visibilities Toggle */}
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pt-4 pb-2">Layout Components Display Controller</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "maintenanceMode", label: "Lock Website in Maintenance Mode" },
                  { name: "showGallery", label: "Render Image Media Gallery Section" },
                  { name: "showNewsletter", label: "Render Newsletter Subscription Box" },
                  { name: "showPortfolio", label: "Display Client Case Studies / Portfolio" },
                  { name: "showTestimonials", label: "Render Verified Customer Testimonials" }
                ].map((toggle) => (
                  <label key={toggle.name} className="flex items-center gap-3 p-4 bg-brand-surface border border-brand-border rounded-lg cursor-pointer hover:border-brand-border-lt transition select-none">
                    <input type="checkbox" name={toggle.name} checked={!!(settings as any)[toggle.name]} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-border bg-brand-black text-brand-accent focus:ring-0 cursor-pointer" />
                    <span className="text-sm text-brand-white font-medium">{toggle.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL CHANNELS */}
          {activeTab === "socials" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pb-2">Social Network Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "facebook", label: "Facebook Page Profile URL" },
                  { name: "instagram", label: "Instagram Handle URL" },
                  { name: "twitter", label: "Twitter / X Profile Link" },
                  { name: "linkedin", label: "LinkedIn Company Directory" },
                  { name: "tiktok", label: "TikTok Channel URL" },
                  { name: "youtube", label: "YouTube Stream Channel Link" }
                ].map((network) => (
                  <div key={network.name}>
                    <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">{network.label}</label>
                    <input type="text" name={network.name} value={(settings as any)[network.name] || ""} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" placeholder="https://..." />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SEO SETTINGS */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-display text-brand-accent-lt border-b border-brand-border-lt pb-2">Search Engine Optimization Meta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Meta Title Element</label>
                  <input type="text" name="metaTitle" value={settings.metaTitle} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" placeholder="High ranking search header text" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Meta Index Keywords (Comma Separated)</label>
                  <input type="text" name="metaKeywords" value={settings.metaKeywords} onChange={handleInputChange} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition" placeholder="paint, market, lagos, premium structural texture" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-lt-gray uppercase mb-2">Meta Index Description String</label>
                <textarea name="metaDescription" value={settings.metaDescription} onChange={handleInputChange} rows={3} className="w-full bg-brand-surface border border-brand-border rounded-lg px-4 py-3 text-brand-white focus:outline-none focus:border-brand-accent transition resize-none" placeholder="Crawlers snippets text box content details..." />
              </div>
            </div>
          )}

          {/* Configuration Form Actions Button Container */}
          <div className="pt-4 border-t border-brand-border-lt flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-brand-accent hover:bg-brand-accent-lt text-brand-black disabled:bg-brand-subtle font-semibold tracking-wide px-10 py-4 rounded-lg shadow-md transition duration-300"
            >
              {isLoading ? "Saving Configurations..." : "Synchronize System Settings"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}