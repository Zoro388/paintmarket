

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { apiSignup } from "@/lib/userApi";
// import { apiGetData, apiRegisterPainter } from "@/lib/painterApi";
// import { saveToken } from "@/lib/endpointRoute";
// import { Eye, EyeOff, ArrowRight, Upload, Briefcase, X, Video } from "lucide-react";

// interface MasterDataItem {
//   _id: string;
//   name: string;
// }

// export default function RegisterPage() {
//   const [activeTab, setActiveTab] = useState<"customer" | "painter">("customer");
  
//   // MasterData State Managers
//   const [dbSkills, setDbSkills] = useState<MasterDataItem[]>([]);
//   const [dbServices, setDbServices] = useState<MasterDataItem[]>([]);
//   const [dbBrands, setDbBrands] = useState<MasterDataItem[]>([]);

//   const [form, setForm] = useState({
//     firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirm: "",
//     bio: "", state: "", city: "", yearsOfExperience: "",
//     skills: [] as string[], services: [] as string[], preferredBrands: [] as string[]
//   });
  
//   // File state managers
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [profilePreview, setProfilePreview] = useState<string>("");
//   const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
//   const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
//   const [verificationVideo, setVerificationVideo] = useState<File | null>(null);

//   const [showPw, setShowPw] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Populate dynamic dropdown content on component load
//   useEffect(() => {
//     async function fetchMasterData() {
//       try {
//         const [skillsRes] = await Promise.all([
//           apiGetData(),
//           // apiGetServices(),
//           // apiGetPreferredBrands()
//         ]);
//         console.log('skills',skillsRes)
//         setDbSkills(skillsRes?.skills);
//         setDbServices(skillsRes?.services);
//       } catch (err) {
//         console.error("Failed to fetch onboarding masterdata items:", err);
//       }
//     }
//     fetchMasterData();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   // Dedicated Multi-Select Array Change Mapper
//   const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { name, options } = e.target;
//     const selectedValues: string[] = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selectedValues.push(options[i].value);
//       }
//     }
//     setForm((p) => ({ ...p, [name]: selectedValues }));
//   };

//   const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfileImage(file);
//       setProfilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newFiles = Array.from(files);
//       setPortfolioImages((prev) => [...prev, ...newFiles]);
//       const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
//       setPortfolioPreviews((prev) => [...prev, ...newPreviews]);
//     }
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setVerificationVideo(file);
//     }
//   };

//   const removePortfolioImage = (index: number) => {
//     setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
//     setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (form.password !== form.confirm) { 
//       setError("Passwords do not match"); 
//       return; 
//     }
    
//     setLoading(true); 
//     setError("");

//     try {
//       if (activeTab === "customer") {
//         const customerBody = {
//           firstName: form.firstName,
//           lastName: form.lastName,
//           email: form.email,
//           phoneNumber: form.phoneNumber,
//           password: form.password,
//         };
//         const data = await apiSignup(customerBody);
//         if (data?.token) saveToken(data.token);
//         window.location.href = "/login";
//       } else {
//         const formData = new FormData();
//         formData.append("firstName", form.firstName);
//         formData.append("lastName", form.lastName);
//         formData.append("email", form.email);
//         formData.append("phoneNumber", form.phoneNumber);
//         formData.append("password", form.password);
//         formData.append("bio", form.bio);
//         formData.append("state", form.state);
//         formData.append("city", form.city);
        
//         if (form.yearsOfExperience) {
//           formData.append("yearsOfExperience", form.yearsOfExperience);
//         }
        
//         // Append raw collection items explicitly into true array structures
//         form.skills.forEach(id => formData.append("skills", id));
//         form.services.forEach(id => formData.append("services", id));
//         // form.preferredBrands.forEach(id => formData.append("preferredBrands", id));
        
//         if (profileImage) formData.append("profileImage", profileImage);
//         if (verificationVideo) formData.append("verificationVideo", verificationVideo);
        
//         portfolioImages.forEach((file) => {
//           formData.append("portfolioImages", file);
//         });

//         const data = await apiRegisterPainter(formData);
//         if (data?.token) saveToken(data.token);
//         window.location.href = "/login";
//       }
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Registration failed");
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card transition-all";
//   const selectCls = "w-full bg-brand-raised border border-brand-border text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card min-h-[100px] transition-all";

//   return (
//     <main className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-12"
//       style={{
//         backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
//         backgroundSize: "48px 48px",
//       }}>
//       <div className={`w-full ${activeTab === "painter" ? "max-w-2xl" : "max-w-md"} transition-all duration-300 relative z-10`}>
        
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex flex-col items-center gap-1 group">
//             <span className="font-display text-3xl font-bold text-white group-hover:text-brand-accent transition-colors">Paint Domain</span>
//             {/* <span className="text-brand-accent text-[10px] tracking-[0.18em] uppercase">&amp; Primary Interior Builders</span> */}
//           </Link>
//         </div>

//         <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl">
//           <h2 className="font-display text-2xl font-bold text-white mb-1">Create Account</h2>
//           <p className="text-brand-mid text-sm mb-6">
//             {activeTab === "customer" ? "Join thousands of satisfied customers" : "Grow your painting business with us"}
//           </p>

//           <div className="flex border-b border-brand-border mb-6">
//             <button type="button" onClick={() => { setActiveTab("customer"); setError(""); }}
//               className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "customer" ? "border-brand-accent text-brand-accent" : "border-transparent text-brand-mid hover:text-white"}`}>
//               Sign up as Customer
//             </button>
//             <button type="button" onClick={() => { setActiveTab("painter"); setError(""); }}
//               className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "painter" ? "border-brand-accent text-brand-accent" : "border-transparent text-brand-mid hover:text-white"}`}>
//               Sign up as Painter
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-xs font-medium">First Name</label>
//                 <input type="text" name="firstName" required value={form.firstName} onChange={handleInputChange} placeholder="John" className={inputCls} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-xs font-medium">Last Name</label>
//                 <input type="text" name="lastName" required value={form.lastName} onChange={handleInputChange} placeholder="Doe" className={inputCls} />
//               </div>
//             </div>

//             <div className="grid sm:grid-cols-2 gap-4">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-xs font-medium">Email Address</label>
//                 <input type="email" name="email" required value={form.email} onChange={handleInputChange} placeholder="you@example.com" className={inputCls} />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-xs font-medium">Phone Number</label>
//                 <input type="tel" name="phoneNumber" required value={form.phoneNumber} onChange={handleInputChange} placeholder="+234..." className={inputCls} />
//               </div>
//             </div>

//             {activeTab === "painter" && (
//               <div className="border-t border-brand-border/40 pt-4 mt-2 flex flex-col gap-4">
//                 <div className="flex items-center gap-2 text-brand-accent mb-1">
//                   <Briefcase size={16} />
//                   <span className="text-xs font-bold uppercase tracking-wider">Professional Profile Data</span>
//                 </div>

//                 <div className="grid sm:grid-cols-3 gap-4">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">State</label>
//                     <input type="text" name="state" required={activeTab === "painter"} value={form.state} onChange={handleInputChange} placeholder="Lagos" className={inputCls} />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">City</label>
//                     <input type="text" name="city" required={activeTab === "painter"} value={form.city} onChange={handleInputChange} placeholder="Ikeja" className={inputCls} />
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Experience (Years)</label>
//                     <input type="number" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleInputChange} placeholder="5" className={inputCls} />
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-brand-lt-gray text-xs font-medium">Bio</label>
//                   <textarea name="bio" rows={3} required={activeTab === "painter"} value={form.bio} onChange={handleInputChange} placeholder="Tell customers about your expertise..." className={`${inputCls} resize-none`} />
//                 </div>

//                 {/* dynamic lookup multiselect options wrapper */}
//                 <div className="grid sm:grid-cols-3 gap-4">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Select Skills <span className="text-[10px] text-brand-subtle">(Hold Cmd/Ctrl)</span></label>
//                     <select name="skills" multiple value={form.skills} onChange={handleMultiSelectChange} className={selectCls}>
//                       {dbSkills.map((item) => (
//                         <option key={item._id} value={item._id}>{item.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Select Services <span className="text-[10px] text-brand-subtle">(Hold Cmd/Ctrl)</span></label>
//                     <select name="services" multiple value={form.services} onChange={handleMultiSelectChange} className={selectCls}>
//                       {dbServices.map((item) => (
//                         <option key={item._id} value={item._id}>{item.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   {/* <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Preferred Brands <span className="text-[10px] text-brand-subtle">(Hold Cmd/Ctrl)</span></label>
//                     <select name="preferredBrands" multiple value={form.preferredBrands} onChange={handleMultiSelectChange} className={selectCls}>
//                       {dbBrands.map((item) => (
//                         <option key={item._id} value={item._id}>{item.name}</option>
//                       ))}
//                     </select>
//                   </div> */}
//                 </div>

//                 {/* File Upload Actions Area */}
//                 <div className="grid sm:grid-cols-3 gap-4 mt-2">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Profile Avatar Image</label>
//                     {!profilePreview ? (
//                       <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-brand-border hover:border-brand-accent/50 bg-brand-raised rounded-lg p-4 text-center text-[11px] text-brand-subtle cursor-pointer transition-colors min-h-[90px]">
//                         <Upload size={14} />
//                         <span>Upload Picture</span>
//                         <input type="file" accept="image/*" required={activeTab === "painter"} onChange={handleProfileChange} className="hidden" />
//                       </label>
//                     ) : (
//                       <div className="relative w-full h-[90px] rounded-lg overflow-hidden border border-brand-border bg-brand-raised">
//                         <img src={profilePreview} alt="Avatar preview" className="w-full h-full object-cover" />
//                         <button type="button" onClick={() => { setProfileImage(null); setProfilePreview(""); }} className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-red-400 hover:text-red-500">
//                           <X size={12} />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Portfolio Projects (1-6)</label>
//                     <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-brand-border hover:border-brand-accent/50 bg-brand-raised rounded-lg p-4 text-center text-[11px] text-brand-subtle cursor-pointer transition-colors min-h-[90px]">
//                       <Upload size={14} />
//                       <span>Add Images</span>
//                       <input type="file" accept="image/*" multiple onChange={handlePortfolioChange} className="hidden" />
//                     </label>

//                     {portfolioPreviews.length > 0 && (
//                       <div className="grid grid-cols-3 gap-1 mt-1 max-h-16 overflow-y-auto p-1 bg-brand-black/20 rounded border border-brand-border/40">
//                         {portfolioPreviews.map((url, i) => (
//                           <div key={i} className="relative aspect-square rounded overflow-hidden border border-brand-border bg-brand-raised">
//                             <img src={url} alt={`Showcase ${i}`} className="w-full h-full object-cover" />
//                             <button type="button" onClick={() => removePortfolioImage(i)} className="absolute top-0.5 right-0.5 bg-black/80 p-0.5 rounded-full text-red-400 hover:text-red-500">
//                               <X size={10} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Verification Video</label>
//                     <label className={`flex flex-col items-center justify-center gap-1 border border-dashed hover:border-brand-accent/50 rounded-lg p-4 text-center text-[11px] cursor-pointer transition-colors min-h-[90px] ${verificationVideo ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' : 'border-brand-border bg-brand-raised text-brand-subtle'}`}>
//                       <Video size={14} />
//                       <span className="truncate max-w-full px-1">
//                         {verificationVideo ? verificationVideo.name : "Upload Video"}
//                       </span>
//                       <input type="file" accept="video/*" required={activeTab === "painter"} onChange={handleVideoChange} className="hidden" />
//                     </label>
//                   </div>
//                 </div>

//               </div>
//             )}

//             <div className="grid sm:grid-cols-2 gap-4 border-t border-brand-border/20 pt-4 mt-2">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-xs font-medium">Password</label>
//                 <div className="relative">
//                   <input type={showPw ? "text" : "password"} name="password" required value={form.password} onChange={handleInputChange} placeholder="Min. 8 characters" className={`${inputCls} pr-10`} />
//                   <button type="button" onClick={() => { setShowPw(!showPw); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-brand-lt-gray transition-colors">
//                     {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-lt-gray text-xs font-medium">Confirm Password</label>
//                 <input type={showPw ? "text" : "password"} name="confirm" required value={form.confirm} onChange={handleInputChange} placeholder="Re-enter password" className={inputCls} />
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 mt-2">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}

//             <button type="submit" disabled={loading}
//               className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all disabled:opacity-50 mt-3 text-sm">
//               {loading ? <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={15} />}
//               {loading ? "Creating account..." : "Create Account"}
//             </button>
//           </form>

//           <p className="text-center text-brand-mid text-sm mt-6">
//             Already have an account?{" "}
//             <Link href="/login" className="text-brand-accent hover:text-brand-accent-lt underline underline-offset-4 transition-colors">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiSignup } from "@/lib/userApi";
import { apiGetData, apiRegisterPainter } from "@/lib/painterApi";
import { saveToken } from "@/lib/endpointRoute";
import { Eye, EyeOff, ArrowRight, Upload, Briefcase, X, Video } from "lucide-react";

interface MasterDataItem {
  _id: string;
  name: string;
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"customer" | "painter">("customer");
  
  // MasterData State Managers
  const [dbSkills, setDbSkills] = useState<MasterDataItem[]>([]);
  const [dbServices, setDbServices] = useState<MasterDataItem[]>([]);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirm: "",
    bio: "", state: "", city: "", yearsOfExperience: "",
    skills: [] as string[], services: [] as string[]
  });
  
  // File state managers
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  
  // Video state managers
  
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate dynamic dropdown content on component load
  useEffect(() => {
    async function fetchMasterData() {
      try {
        const response = await apiGetData();
        console.log('API Response:', response);
        // Map the arrays from the response exactly as seen in your console log
        if (response?.skills) setDbSkills(response.skills);
        if (response?.services) setDbServices(response.services);
      } catch (err) {
        console.error("Failed to fetch onboarding masterdata items:", err);
      }
    }
    fetchMasterData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Toggle selection for Skills and Services (Interactive Pills)
  const toggleArraySelection = (field: "skills" | "services", id: string) => {
    setForm((prev) => {
      const currentSelected = prev[field];
      if (currentSelected.includes(id)) {
        // Remove if already selected
        return { ...prev, [field]: currentSelected.filter((item) => item !== id) };
      } else {
        // Add if not selected
        return { ...prev, [field]: [...currentSelected, id] };
      }
    });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setPortfolioImages((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPortfolioPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

 
  const removePortfolioImage = (index: number) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { 
      setError("Passwords do not match"); 
      return; 
    }
    
    setLoading(true); 
    setError("");

    try {
      if (activeTab === "customer") {
        const customerBody = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
        };
        const data = await apiSignup(customerBody);
        if (data?.token) saveToken(data.token);
        window.location.href = "/login";
      } else {
        const formData = new FormData();
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append("email", form.email);
        formData.append("phoneNumber", form.phoneNumber);
        formData.append("password", form.password);
        formData.append("bio", form.bio);
        formData.append("state", form.state);
        formData.append("city", form.city);
        
        if (form.yearsOfExperience) {
          formData.append("yearsOfExperience", form.yearsOfExperience);
        }
        
        // Append raw collection item IDs explicitly into true array structures
        form.skills.forEach((id) => formData.append("skills", id));
        form.services.forEach((id) => formData.append("services", id));
        
        if (profileImage) formData.append("profileImage", profileImage);
        
        portfolioImages.forEach((file) => {
          formData.append("portfolioImages", file);
        });

        const data = await apiRegisterPainter(formData);
        if (data?.token) saveToken(data.token);
        window.location.href = "/login";
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally { 
      setLoading(false); 
    }
  };

  const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-card transition-all";

  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}>
      <div className={`w-full ${activeTab === "painter" ? "max-w-2xl" : "max-w-md"} transition-all duration-300 relative z-10`}>
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <span className="font-display text-3xl font-bold text-white group-hover:text-brand-accent transition-colors">Paint Domain</span>
          </Link>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="font-display text-2xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-brand-mid text-sm mb-6">
            {activeTab === "customer" ? "Join thousands of satisfied customers" : "Grow your painting business with us"}
          </p>

          <div className="flex border-b border-brand-border mb-6">
            <button type="button" onClick={() => { setActiveTab("customer"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "customer" ? "border-brand-accent text-brand-accent" : "border-transparent text-brand-mid hover:text-white"}`}>
              Sign up as Customer
            </button>
            <button type="button" onClick={() => { setActiveTab("painter"); setError(""); }}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "painter" ? "border-brand-accent text-brand-accent" : "border-transparent text-brand-mid hover:text-white"}`}>
              Sign up as Painter
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">First Name</label>
                <input type="text" name="firstName" required value={form.firstName} onChange={handleInputChange} placeholder="John" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Last Name</label>
                <input type="text" name="lastName" required value={form.lastName} onChange={handleInputChange} placeholder="Doe" className={inputCls} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Email Address</label>
                <input type="email" name="email" required value={form.email} onChange={handleInputChange} placeholder="you@example.com" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Phone Number</label>
                <input type="tel" name="phoneNumber" required value={form.phoneNumber} onChange={handleInputChange} placeholder="+234..." className={inputCls} />
              </div>
            </div>

            {activeTab === "painter" && (
              <div className="border-t border-brand-border/40 pt-4 mt-2 flex flex-col gap-5">
                <div className="flex items-center gap-2 text-brand-accent mb-1">
                  <Briefcase size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Professional Profile Data</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">State</label>
                    <input type="text" name="state" required={activeTab === "painter"} value={form.state} onChange={handleInputChange} placeholder="Lagos" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">City</label>
                    <input type="text" name="city" required={activeTab === "painter"} value={form.city} onChange={handleInputChange} placeholder="Ikeja" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Experience (Years)</label>
                    <input type="number" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleInputChange} placeholder="5" className={inputCls} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Bio</label>
                  <textarea name="bio" rows={3} required={activeTab === "painter"} value={form.bio} onChange={handleInputChange} placeholder="Tell customers about your expertise..." className={`${inputCls} resize-none`} />
                </div>

                {/* ── Interactive Skill & Service Badges ── */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Skills */}
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-lt-gray text-xs font-medium">Select Skills</label>
                    <div className="flex flex-wrap gap-2 bg-brand-raised/50 border border-brand-border p-3 rounded-lg min-h-[90px]">
                      {dbSkills.length > 0 ? (
                        dbSkills.map((item) => {
                          const isSelected = form.skills.includes(item._id);
                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => toggleArraySelection("skills", item._id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                isSelected
                                  ? "bg-brand-accent text-brand-black border-brand-accent shadow-sm"
                                  : "bg-transparent text-brand-mid border-brand-border hover:border-brand-accent/50 hover:text-white"
                              }`}
                            >
                              {item.name}
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-brand-subtle text-xs italic">Loading skills...</span>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-col gap-2">
                    <label className="text-brand-lt-gray text-xs font-medium">Select Services</label>
                    <div className="flex flex-wrap gap-2 bg-brand-raised/50 border border-brand-border p-3 rounded-lg min-h-[90px]">
                      {dbServices.length > 0 ? (
                        dbServices.map((item) => {
                          const isSelected = form.services.includes(item._id);
                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => toggleArraySelection("services", item._id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                isSelected
                                  ? "bg-brand-accent text-brand-black border-brand-accent shadow-sm"
                                  : "bg-transparent text-brand-mid border-brand-border hover:border-brand-accent/50 hover:text-white"
                              }`}
                            >
                              {item.name}
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-brand-subtle text-xs italic">Loading services...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── File Upload Actions Area ── */}
                <div className="grid sm:grid-cols-3 gap-4 mt-2">
                  
                  {/* Profile Avatar */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Profile Image</label>
                    {!profilePreview ? (
                      <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-brand-border hover:border-brand-accent/50 bg-brand-raised rounded-lg p-4 text-center text-[11px] text-brand-subtle cursor-pointer transition-colors min-h-[90px]">
                        <Upload size={14} />
                        <span>Upload Picture</span>
                        <input type="file" accept="image/*" required={activeTab === "painter"} onChange={handleProfileChange} className="hidden" />
                      </label>
                    ) : (
                      <div className="relative w-full h-[90px] rounded-lg overflow-hidden border border-brand-border bg-brand-raised">
                        <img src={profilePreview} alt="Avatar preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setProfileImage(null); setProfilePreview(""); }} className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-red-400 hover:text-red-500 transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Portfolio Projects */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Portfolio (1-6)</label>
                    <label className="flex flex-col items-center justify-center gap-1 border border-dashed border-brand-border hover:border-brand-accent/50 bg-brand-raised rounded-lg p-4 text-center text-[11px] text-brand-subtle cursor-pointer transition-colors min-h-[90px]">
                      <Upload size={14} />
                      <span>Add Images</span>
                      <input type="file" accept="image/*" multiple onChange={handlePortfolioChange} className="hidden" />
                    </label>

                    {portfolioPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-1 mt-1 max-h-16 overflow-y-auto p-1 bg-brand-black/20 rounded border border-brand-border/40">
                        {portfolioPreviews.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded overflow-hidden border border-brand-border bg-brand-raised">
                            <img src={url} alt={`Showcase ${i}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePortfolioImage(i)} className="absolute top-0.5 right-0.5 bg-black/80 p-0.5 rounded-full text-red-400 hover:text-red-500">
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Verification Video Preview Setup */}
                

                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 border-t border-brand-border/20 pt-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} name="password" required value={form.password} onChange={handleInputChange} placeholder="Min. 8 characters" className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => { setShowPw(!showPw); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-brand-lt-gray transition-colors">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-brand-lt-gray text-xs font-medium">Confirm Password</label>
                <input type={showPw ? "text" : "password"} name="confirm" required value={form.confirm} onChange={handleInputChange} placeholder="Re-enter password" className={inputCls} />
              </div>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 mt-2">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-3 rounded-lg hover:bg-brand-accent-lt transition-all disabled:opacity-50 mt-3 text-sm">
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