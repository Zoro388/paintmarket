// "use client";
// import { useState } from "react";
// import Navbar from "@/components/landing/Navbar";
// import Footer from "@/components/landing/Footer";
// import { apiSubmitPainterRequest } from "@/lib/userApi";
// import { Brush, CheckCircle, Home, Building, Palette, Calendar, ArrowRight } from "lucide-react";

// const projectTypes  = ["Interior","Exterior","Both Interior & Exterior","Roof Painting","Floor Coating"];
// const propertyTypes = ["Residential – Apartment","Residential – Duplex","Commercial Office","Warehouse / Industrial","School / Institution","Other"];

// const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";
// const selectCls = `${inputCls} cursor-pointer`;

// export default function PainterRequestPage() {
//   const [form, setForm] = useState({
//     fullName:"", phoneNumber:"", email:"", propertyLocation:"",
//     projectType:"", propertyType:"", projectDescription:"",
//     preferredStartDate:"", additionalNotes:"",
//   });
//       console.log('form',form)

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError]   = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     console.log('form',form)
//     e.preventDefault(); setLoading(true); setError("");
//     try { await apiSubmitPainterRequest(form); setSuccess(true); }
//     catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"), form }
//     finally { setLoading(false); }
//   };

//   return (
//     <main className="bg-brand-black min-h-screen">
//       <Navbar />

//       {/* Hero */}
//       <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40"
//         style={{
//           backgroundImage:`linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
//           backgroundSize:"52px 52px",
//         }}>
//         <div className="max-w-7xl mx-auto">
//           <div className="max-w-2xl">
//             <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Service</p>
//             <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
//               Request a Professional Painter
//             </h1>
//             <p className="text-brand-mid text-lg leading-relaxed mb-8">
//               Tell us about your project and we&apos;ll connect you with a vetted, insured painter
//               in your area — usually within 24 hours.
//             </p>
//             <div className="flex flex-wrap gap-3">
//               {[{icon:Brush,label:"Vetted Painters"},{icon:Home,label:"All Property Types"},{icon:Palette,label:"Colour Consultation"},{icon:Calendar,label:"Flexible Scheduling"}].map(({icon:Icon,label}) => (
//                 <div key={label} className="flex items-center gap-2 bg-brand-accent-muted border border-brand-accent/20 rounded-full px-4 py-2 text-brand-accent text-sm">
//                   <Icon size={13} /> {label}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Form */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">

//           {/* Sidebar */}
//           <div className="flex flex-col gap-5">
//             <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
//               <h3 className="font-display text-lg font-bold text-white mb-5">How It Works</h3>
//               {[
//                 { step:"01", title:"Tell Us About Your Project ",  desc:"Share your location, project details, and what you're looking for." },
//                 { step:"02", title:" Get a Site Estimate",    desc:"Book a site inspection or use our paint calculator to estimate your project." },
//                 { step:"03", title:"Review Your Quotation ",     desc:"Receive a detailed quotation based on your project requirements." },
//                 { step:"04", title:"Shop or Hire",  desc:"Order your preferred paint or connect with a painter to bring your project to life." },
//               ].map((s,i) => (
//                 <div key={s.step} className={`flex gap-4 pb-5 ${i<3?"border-b border-brand-border/40 mb-5":""}`}>
//                   <span className="text-brand-accent font-bold text-sm font-display w-6 flex-shrink-0">{s.step}</span>
//                   <div>
//                     <p className="text-white text-sm font-medium">{s.title}</p>
//                     <p className="text-brand-mid text-xs mt-0.5 leading-relaxed">{s.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="bg-brand-accent-muted border border-brand-accent/20 rounded-2xl p-5">
//               <Building size={22} className="text-brand-accent mb-3" />
//               <h4 className="text-white font-semibold text-sm mb-1.5">Commercial Projects?</h4>
//               <p className="text-brand-mid text-xs leading-relaxed">
//                 For large commercial or industrial projects, our dedicated team provides fully
//                 customised solutions and dedicated project managers.
//               </p>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-2xl p-8">
//             {success ? (
//               <div className="flex flex-col items-center justify-center py-16 gap-5">
//                 <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center">
//                   <CheckCircle size={32} className="text-emerald-400" />
//                 </div>
//                 <div className="text-center">
//                   <h3 className="font-display text-2xl font-bold text-white">Request Submitted!</h3>
//                   <p className="text-brand-mid mt-2 max-w-xs text-sm">We&apos;ll review your request and match you with a painter within 24 hours.</p>
//                 </div>
//                 <button onClick={() => setSuccess(false)} className="text-brand-accent text-sm underline underline-offset-4">Submit another request</button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//                 <div>
//                   <h3 className="font-display text-xl font-bold text-white">Project Details</h3>
//                   <p className="text-brand-mid text-xs mt-1">All fields marked * are required</p>
//                 </div>

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {[
//                     {name:"fullName",        label:"Full Name *",        type:"text",  ph:"Your full name"},
//                     {name:"phoneNumber",      label:"Phone Number *",     type:"tel",   ph:"+234..."},
//                     {name:"email",     label:"Email Address *",    type:"email", ph:"you@example.com"},
//                     {name:"propertyLocation", label:"Property Location *",type:"text",  ph:"Address / Area, State"},
//                   ].map((f) => (
//                     <div key={f.name} className="flex flex-col gap-1.5">
//                       <label className="text-brand-lt-gray text-xs font-medium">{f.label}</label>
//                       <input name={f.name} type={f.type} required value={(form as Record<string,string>)[f.name]}
//                         onChange={handleChange} placeholder={f.ph} className={inputCls} />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Project Type *</label>
//                     <select name="projectType" required value={form.projectType} onChange={handleChange} className={selectCls}>
//                       <option value="">Select type</option>
//                       {projectTypes.map((t) => <option key={t}>{t}</option>)}
//                     </select>
//                   </div>
//                   <div className="flex flex-col gap-1.5">
//                     <label className="text-brand-lt-gray text-xs font-medium">Property Type *</label>
//                     <select name="propertyType" required value={form.propertyType} onChange={handleChange} className={selectCls}>
//                       <option value="">Select property</option>
//                       {propertyTypes.map((t) => <option key={t}>{t}</option>)}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-brand-lt-gray text-xs font-medium">Preferred Start Date *</label>
//                   <input name="preferredStartDate" type="date" required value={form.preferredStartDate} onChange={handleChange} className={inputCls} />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-brand-lt-gray text-xs font-medium">Project Description *</label>
//                   <textarea name="projectDescription" required rows={4} value={form.projectDescription} onChange={handleChange}
//                     placeholder="Describe the scope of work — number of rooms, current condition, surfaces to paint, etc."
//                     className={`${inputCls} resize-none`} />
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-brand-lt-gray text-xs font-medium">Additional Notes (optional)</label>
//                   <textarea name="additionalNotes" rows={3} value={form.additionalNotes} onChange={handleChange}
//                     placeholder="Access instructions, special requirements, colour preferences..."
//                     className={`${inputCls} resize-none`} />
//                 </div>

//                 {error && (
//                   <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
//                     <p className="text-red-400 text-sm">{error}</p>
//                   </div>
//                 )}

//                 <button type="submit" disabled={loading}
//                   className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-3.5 rounded-lg hover:bg-brand-accent-lt transition-all disabled:opacity-50 text-sm">
//                   {loading ? <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={15} />}
//                   {loading ? "Submitting..." : "Submit Painter Request"}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </main>
//   );
// }




// "use client";
// import { useState } from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { apiGetPainters, apiRequestAPainter } from "@/lib/userApi";
// import Navbar from "@/components/landing/Navbar";
// import Footer from "@/components/landing/Footer";
// import { Search, Loader, User, MapPin, Calendar, Star, X, Check } from "lucide-react";
// import LoadingSkeleton from "../dashboard/components/Loading";
// import toast from "react-hot-toast";

// // Interface for Painter object returned from API
// interface Painter {
//   _id: string;
//   fullName: string;
//   bio: string;
//   city: string;
//   state: string;
//   profileImage: string;
//   yearsOfExperience: number;
//   averageRating: number;
//   totalReviews: number;
//   preferredBrands: string[];
//   services: string[];
//   skills: string[];
// }

// // Interface for Booking Request Payload
// interface BookingFormInput {
//   fullName: string;
//   phoneNumber: string;
//   email: string;
//   propertyLocation: string;
//   projectType: string;
//   propertyType: string;
//   projectDescription: string;
//   preferredStartDate: string;
//   additionalNotes: string;
//   selectedPainter: string;
// }

// export default function PaintersPage() {
//   const [selectedState, setSelectedState] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeBookingPainter, setActiveBookingPainter] = useState<Painter | null>(null);

//   // Form State
//   const [formData, setFormData] = useState<Omit<BookingFormInput, "selectedPainter">>({
//     fullName: "",
//     phoneNumber: "",
//     email: "",
//     propertyLocation: "",
//     projectType: "Residential",
//     propertyType: "Interior Paint",
//     projectDescription: "",
//     preferredStartDate: "",
//     additionalNotes: "",
//   });

//   // Query painters list
//   const { data: painters = [], isLoading } = useQuery<Painter[]>({
//     queryKey: ["painters"],
//     queryFn: async () => {
//       try {
//         const res = await apiGetPainters();
//         return res?.painters ?? res?.data ?? [];
//       } catch {
//         return [];
//       }
//     },
//   });

//   // Collect unique states for filter tabs
//   const statesList = painters
//     ? Array.from(new Set(painters.map((p) => p.state))).filter(Boolean)
//     : [];
//   const STATE_TABS = ["All", ...statesList];

//   // Filtering
//   const filteredPainters = painters.filter((p) => {
//     const matchesState = selectedState === "All" || p.state === selectedState;
//     const matchesSearch =
//       !searchQuery ||
//       p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       p.bio.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesState && matchesSearch;
//   });

//   // Booking request mutation
//   const bookingMutation = useMutation({
//     mutationFn: async (payload: BookingFormInput) => {
//       return await apiRequestAPainter(payload);
//     },
//     onSuccess: () => {
//       toast.success("Your booking request has been sent successfully!");
//       setActiveBookingPainter(null);
//       // Reset form fields
//       setFormData({
//         fullName: "",
//         phoneNumber: "",
//         email: "",
//         propertyLocation: "",
//         projectType: "Residential",
//         propertyType: "Interior Paint",
//         projectDescription: "",
//         preferredStartDate: "",
//         additionalNotes: "",
//       });
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Failed to submit request. Please try again.");
//     },
//   });

//   const handleFormChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBookingSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!activeBookingPainter) return;

//     // Validate simple required fields
//     if (
//       !formData.fullName ||
//       !formData.phoneNumber ||
//       !formData.email ||
//       !formData.propertyLocation ||
//       !formData.projectDescription ||
//       !formData.preferredStartDate
//     ) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }

//     bookingMutation.mutate({
//       ...formData,
//       selectedPainter: activeBookingPainter._id,
//     });
//   };

//   if (isLoading) {
//     return <LoadingSkeleton />;
//   }

//   return (
//     <main className="bg-brand-black min-h-screen text-white">
//       <Navbar />

//       {/* Hero Header */}
//       <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40">
//         <div className="max-w-7xl mx-auto">
//           <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Expert Services</p>
//           <h1 className="font-display text-4xl font-bold">Find & Book Professional Painters</h1>
//           <p className="text-brand-mid mt-2 text-sm">
//             {painters.length} certified professionals ready to transform your space.
//           </p>
//         </div>
//       </section>

//       {/* Sticky Filters */}
//       <div className="sticky top-[60px] z-20 bg-brand-black/96 backdrop-blur-md border-b border-brand-border/30 py-4 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//           <div className="flex items-center gap-2 bg-brand-raised border border-brand-border rounded-lg px-3.5 py-2.5 w-full sm:w-64">
//             <Search size={14} className="text-brand-subtle flex-shrink-0" />
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search name, skill, or bio..."
//               className="bg-transparent text-white text-sm placeholder-brand-subtle outline-none flex-1 min-w-0"
//             />
//           </div>
//           <div className="flex flex-wrap gap-1.5">
//             {STATE_TABS.map((stateName) => (
//               <button
//                 key={stateName}
//                 onClick={() => setSelectedState(stateName)}
//                 className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
//                   selectedState === stateName
//                     ? "bg-brand-accent text-brand-black"
//                     : "bg-brand-raised border border-brand-border text-brand-mid hover:text-white hover:border-brand-border-lt"
//                 }`}
//               >
//                 {stateName}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Painters Directory Grid */}
//       <section className="py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {filteredPainters.length === 0 ? (
//             <div className="py-20 text-center">
//               <User size={44} className="text-brand-border mx-auto mb-3" />
//               <p className="text-brand-mid text-sm">No professional painters found matching your criteria.</p>
//             </div>
//           ) : (
//             <>
//               <p className="text-brand-subtle text-xs mb-6 uppercase tracking-wider">
//                 {filteredPainters.length} Painter{filteredPainters.length !== 1 ? "s" : ""} found
//               </p>
              
//               <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {filteredPainters.map((p) => (
//                   <div
//                     key={p._id}
//                     className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden hover:border-brand-accent/30 transition-all duration-300 flex flex-col justify-between group"
//                   >
//                     {/* Top: Square Cover Image (Product Card Style) */}
//                     <div className="relative w-full aspect-square bg-brand-raised overflow-hidden border-b border-brand-border/40">
//                       <img
//                         src={p.profileImage || "https://res.cloudinary.com/ddqhj3e3a/image/upload/v1784109923/paintmarket/painters/profile/nqdwczuyo1vsf5b0lyun.png"}
//                         alt={p.fullName}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     </div>

//                     {/* Content Section Beneath Image */}
//                     <div className="p-5 flex flex-col flex-1 gap-3.5">
//                       {/* Identity header details */}
//                       <div>
//                         <h3 className="text-white font-semibold text-base leading-tight tracking-wide">{p.fullName}</h3>
//                         <div className="flex items-center gap-1.5 mt-1 text-xs text-brand-mid">
//                           <MapPin size={12} className="text-brand-accent" />
//                           <span>{p.city}, {p.state}</span>
//                         </div>
//                       </div>

//                       {/* Biography description snippet */}
//                       <p className="text-brand-mid text-xs leading-relaxed line-clamp-2 italic">
//                         "{p.bio || "Professional painting installer ready for your projects."}"
//                       </p>

//                       {/* Information Meta Data Attributes */}
//                       <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-brand-border/20">
//                         <div>
//                           <span className="text-brand-subtle block">Experience</span>
//                           <span className="font-semibold text-white">{p.yearsOfExperience} Years</span>
//                         </div>
//                         <div>
//                           <span className="text-brand-subtle block">Rating</span>
//                           <span className="font-semibold text-white flex items-center gap-1">
//                             <Star size={11} className="fill-brand-accent text-brand-accent" />
//                             {p.averageRating > 0 ? p.averageRating : "N/A"} ({p.totalReviews})
//                           </span>
//                         </div>
//                       </div>

//                       {/* Interactive Skill Tags Area */}
//                       {p.skills && p.skills.length > 0 && (
//                         <div className="flex flex-wrap gap-1">
//                           {p.skills.slice(0, 3).map((skill, index) => (
//                             <span
//                               key={index}
//                               className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2.5 py-0.5 rounded-full"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Bottom Sticky Interactive Booking Panel */}
//                     <div className="p-5 pt-0 mt-auto">
//                       <button
//                         onClick={() => setActiveBookingPainter(p)}
//                         className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-accent text-brand-black hover:bg-brand-accent-lt transition-colors font-semibold text-xs"
//                       >
//                         <Calendar size={13} />
//                         Book This Painter
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Booking Form Modal Overlay */}
//       {activeBookingPainter && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
//             {/* Modal Header */}
//             <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
//               <div>
//                 <span className="text-brand-accent text-[10px] font-bold tracking-widest uppercase block mb-0.5">
//                   Secure Professional Painter Booking
//                 </span>
//                 <h2 className="text-white font-bold text-lg leading-tight">
//                   Request {activeBookingPainter.fullName}
//                 </h2>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setActiveBookingPainter(null)}
//                 className="p-1.5 rounded-lg text-brand-subtle hover:text-white hover:bg-brand-raised transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Modal Form Content */}
//             <form onSubmit={handleBookingSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 text-xs">
              
//               {/* Personal Information */}
//               <h3 className="text-brand-accent uppercase font-bold text-[10px] tracking-wider mb-2">Contact details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-brand-subtle mb-1">Your Full Name <span className="text-red-500">*</span></label>
//                   <input
//                     type="text"
//                     required
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleFormChange}
//                     className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50"
//                     placeholder="Enter your first & last name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-brand-subtle mb-1">Phone Number <span className="text-red-500">*</span></label>
//                   <input
//                     type="tel"
//                     required
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleFormChange}
//                     className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50"
//                     placeholder="e.g., +234 81234567"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-brand-subtle mb-1">Email Address <span className="text-red-500">*</span></label>
//                 <input
//                   type="email"
//                   required
//                   name="email"
//                   value={formData.email}
//                   onChange={handleFormChange}
//                   className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50"
//                   placeholder="name@domain.com"
//                 />
//               </div>

//               <hr className="border-brand-border/30" />

//               {/* Property Details */}
//               <h3 className="text-brand-accent uppercase font-bold text-[10px] tracking-wider mb-2">Project properties</h3>
//               <div>
//                 <label className="block text-brand-subtle mb-1">Property Location Address <span className="text-red-500">*</span></label>
//                 <input
//                   type="text"
//                   required
//                   name="propertyLocation"
//                   value={formData.propertyLocation}
//                   onChange={handleFormChange}
//                   className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50"
//                   placeholder="Street Address, City, State"
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-brand-subtle mb-1">Project Type</label>
//                   <select
//                     name="projectType"
//                     value={formData.projectType}
//                     onChange={handleFormChange}
//                     className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white outline-none focus:border-brand-accent/50"
//                   >
//                     <option value="Residential">Residential (Home)</option>
//                     <option value="Commercial">Commercial (Office/Shop)</option>
//                     <option value="Industrial">Industrial</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-brand-subtle mb-1">Property Type</label>
//                   <select
//                     name="propertyType"
//                     value={formData.propertyType}
//                     onChange={handleFormChange}
//                     className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white outline-none focus:border-brand-accent/50"
//                   >
//                     <option value="Interior Paint">Interior Paint Only</option>
//                     <option value="Exterior Paint">Exterior Paint Only</option>
//                     <option value="Complete Overhaul">Both Interior & Exterior</option>
//                     <option value="Spackling/Screeding">Spackling & Screeding</option>
//                     <option value="Wallpapering">Wallpaper/Special Finish</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-brand-subtle mb-1">Preferred Start Date <span className="text-red-500">*</span></label>
//                   <input
//                     type="date"
//                     required
//                     name="preferredStartDate"
//                     value={formData.preferredStartDate}
//                     onChange={handleFormChange}
//                     className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white outline-none focus:border-brand-accent/50"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-brand-subtle mb-1">Project Description <span className="text-red-500">*</span></label>
//                 <textarea
//                   required
//                   name="projectDescription"
//                   rows={3}
//                   value={formData.projectDescription}
//                   onChange={handleFormChange}
//                   placeholder="Describe your painting requirement context (e.g., Number of rooms, wall defects, current colors...)"
//                   className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50 resize-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-brand-subtle mb-1">Additional Notes</label>
//                 <textarea
//                   name="additionalNotes"
//                   rows={2}
//                   value={formData.additionalNotes}
//                   onChange={handleFormChange}
//                   placeholder="Any other details or questions you have for the painter?"
//                   className="w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50 resize-none"
//                 />
//               </div>

//               {/* Modal Actions */}
//               <div className="pt-4 border-t border-brand-border/40 flex justify-end gap-3">
//                 <button
//                   type="button"
//                   disabled={bookingMutation.isPending}
//                   onClick={() => setActiveBookingPainter(null)}
//                   className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg hover:text-white hover:border-brand-border-lt transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={bookingMutation.isPending}
//                   className="px-5 py-2 bg-brand-accent text-brand-black font-semibold rounded-lg hover:bg-brand-accent-lt transition-colors flex items-center gap-2"
//                 >
//                   {bookingMutation.isPending ? (
//                     <>
//                       <Loader size={14} className="animate-spin" />
//                       Submitting Request...
//                     </>
//                   ) : (
//                     <>
//                       <Check size={14} />
//                       Submit Booking Request
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </main>
//   );
// }

"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetPainters, apiRequestAPainter, apiCreateReview, apiGetPainterReviews } from "@/lib/userApi";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Search, Loader, User, MapPin, Calendar, Star, X, Check, MessageSquare, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface Painter {
  _id: string; fullName: string; bio: string; city: string; state: string;
  profileImage: string; yearsOfExperience: number; averageRating: number;
  totalReviews: number; preferredBrands: string[]; services: string[]; skills: string[];
}

interface Review {
  _id: string; requestId: string; rating: number; review: string;
  createdAt: string; hidden?: boolean;
}

const inputCls = "w-full bg-brand-raised border border-brand-border rounded-lg p-2.5 text-white placeholder-brand-subtle/50 outline-none focus:border-brand-accent/50 text-xs";

// ── Star Rating Input ─────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={`transition-colors ${
              n <= (hovered || value) ? "fill-brand-accent text-brand-accent" : "text-brand-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Reviews Modal ─────────────────────────────────────────────────────────────
// function ReviewsModal({ painter, onClose }: { painter: Painter; onClose: () => void }) {
//   const qc = useQueryClient();
//   const [showForm, setShowForm] = useState(false);
//   const [requestId, setRequestId] = useState("");
//   const [rating, setRating] = useState(5);
//   const [reviewText, setReviewText] = useState("");

//   const { data, isLoading } = useQuery<Review[]>({
//     queryKey: ["painter-reviews", painter._id],
//     queryFn: async () => {
//       const res = await apiGetPainterReviews(painter._id);
//       return (res?.reviews ?? res?.data ?? []) as Review[];
//     },
//   });

//   const reviewMutation = useMutation({
//     mutationFn: () => apiCreateReview({ requestId, rating, review: reviewText }),
//     onSuccess: () => {
//       toast.success("Review submitted!");
//       qc.invalidateQueries({ queryKey: ["painter-reviews", painter._id] });
//       qc.invalidateQueries({ queryKey: ["painters"] });
//       setShowForm(false);
//       setRequestId(""); setRating(5); setReviewText("");
//     },
//     onError: (err: Error) => toast.error(err?.message || "Failed to submit review"),
//   });

//   const handleSubmit = () => {
//     if (!requestId.trim()) { toast.error("Request ID is required"); return; }
//     if (!reviewText.trim()) { toast.error("Please write a review"); return; }
//     reviewMutation.mutate();
//   };

//   const reviews = data ?? [];

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg
//         overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">

//         {/* Header */}
//         <div className="p-5 border-b border-brand-border/40 flex items-center justify-between bg-brand-raised/50">
//           <div>
//             <p className="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-0.5">
//               Reviews
//             </p>
//             <h2 className="text-white font-bold text-base leading-tight">{painter.fullName}</h2>
//           </div>
//           <button onClick={onClose} className="text-brand-subtle hover:text-white transition-colors p-1">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">

//           {/* Rating summary */}
//           <div className="flex items-center gap-4 bg-brand-raised border border-brand-border/30 rounded-xl p-4">
//             <div className="text-center">
//               <p className="text-brand-accent font-bold text-3xl font-display">
//                 {painter.averageRating > 0 ? painter.averageRating.toFixed(1) : "—"}
//               </p>
//               <div className="flex gap-0.5 mt-1 justify-center">
//                 {[1,2,3,4,5].map((n) => (
//                   <Star key={n} size={11}
//                     className={n <= Math.round(painter.averageRating)
//                       ? "fill-brand-accent text-brand-accent"
//                       : "text-brand-border"} />
//                 ))}
//               </div>
//             </div>
//             <div className="text-brand-mid text-xs">
//               <p><span className="text-white font-semibold">{painter.totalReviews}</span> total review{painter.totalReviews !== 1 ? "s" : ""}</p>
//             </div>
//             <button
//               onClick={() => setShowForm(!showForm)}
//               className="ml-auto flex items-center gap-1.5 bg-brand-accent text-brand-black
//                 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-brand-accent-lt transition-colors"
//             >
//               <Star size={12} /> Leave a Review
//             </button>
//           </div>

//           {/* Leave review form */}
//           {showForm && (
//             <div className="bg-brand-raised border border-brand-accent/20 rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
//               <p className="text-brand-accent text-xs font-semibold uppercase tracking-wider">Write a Review</p>

//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-mid text-xs">Request ID *</label>
//                 <input
//                   value={requestId}
//                   onChange={(e) => setRequestId(e.target.value)}
//                   placeholder="Your booking request ID"
//                   className={inputCls}
//                 />
//                 <p className="text-brand-subtle text-[11px]">
//                   Find your request ID in your order confirmation or dashboard.
//                 </p>
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-mid text-xs">Rating *</label>
//                 <StarPicker value={rating} onChange={setRating} />
//               </div>

//               <div className="flex flex-col gap-1.5">
//                 <label className="text-brand-mid text-xs">Your Review *</label>
//                 <textarea
//                   value={reviewText}
//                   onChange={(e) => setReviewText(e.target.value)}
//                   rows={3}
//                   placeholder="Share your experience..."
//                   className={`${inputCls} resize-none`}
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <button onClick={() => setShowForm(false)}
//                   className="flex-1 border border-brand-border text-brand-mid py-2 rounded-lg text-xs hover:text-white transition-colors">
//                   Cancel
//                 </button>
//                 <button onClick={handleSubmit} disabled={reviewMutation.isPending}
//                   className="flex-1 flex items-center justify-center gap-1.5 bg-brand-accent text-brand-black
//                     font-semibold py-2 rounded-lg text-xs hover:bg-brand-accent-lt transition-colors disabled:opacity-50">
//                   {reviewMutation.isPending ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
//                   {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Review list */}
//           {isLoading ? (
//             <div className="py-10 flex justify-center">
//               <Loader size={22} className="animate-spin text-brand-accent" />
//             </div>
//           ) : reviews.length === 0 ? (
//             <div className="py-10 text-center">
//               <MessageSquare size={32} className="text-brand-border mx-auto mb-2" />
//               <p className="text-brand-mid text-sm">No reviews yet</p>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-3">
//               {reviews.map((r) => (
//                 <div key={r._id}
//                   className="bg-brand-raised border border-brand-border/30 rounded-xl p-4 flex flex-col gap-2">
//                   <div className="flex items-center justify-between">
//                     <div className="flex gap-0.5">
//                       {[1,2,3,4,5].map((n) => (
//                         <Star key={n} size={12}
//                           className={n <= r.rating ? "fill-brand-accent text-brand-accent" : "text-brand-border"} />
//                       ))}
//                     </div>
//                     <span className="text-brand-subtle text-[11px]">
//                       {new Date(r.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
//                     </span>
//                   </div>
//                   <p className="text-brand-lt-gray text-xs leading-relaxed">{r.review}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ painter, onClose }: { painter: Painter; onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "", phoneNumber: "", email: "", propertyLocation: "",
    projectType: "Residential", propertyType: "Interior Paint",
    projectDescription: "", preferredStartDate: "", additionalNotes: "",
  });

  const mutation = useMutation({
    mutationFn: () => apiRequestAPainter({ ...formData, selectedPainter: painter._id }),
    onSuccess: () => {
      toast.success("Booking request sent!");
      onClose();
    },
    onError: (err: Error) => toast.error(err?.message || "Failed to submit"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, phoneNumber, email, propertyLocation, projectDescription, preferredStartDate } = formData;
    if (!fullName || !phoneNumber || !email || !propertyLocation || !projectDescription || !preferredStartDate) {
      toast.error("Please fill in all required fields"); return;
    }
    mutation.mutate();
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-xl
        overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
          <div>
            <span className="text-brand-accent text-[10px] font-bold tracking-widest uppercase block mb-0.5">
              Booking Request
            </span>
            <h2 className="text-white font-bold text-base leading-tight">Request {painter.fullName}</h2>
          </div>
          <button onClick={onClose} className="text-brand-subtle hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-wider">Contact Details</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-subtle mb-1">Full Name *</label>
              <input type="text" required value={formData.fullName} onChange={set("fullName")} placeholder="First & last name" className={inputCls} />
            </div>
            <div>
              <label className="block text-brand-subtle mb-1">Phone Number *</label>
              <input type="tel" required value={formData.phoneNumber} onChange={set("phoneNumber")} placeholder="+234 8xx..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-brand-subtle mb-1">Email Address *</label>
            <input type="email" required value={formData.email} onChange={set("email")} placeholder="you@email.com" className={inputCls} />
          </div>

          <hr className="border-brand-border/30" />
          <p className="text-brand-accent text-[10px] font-bold uppercase tracking-wider">Project Details</p>

          <div>
            <label className="block text-brand-subtle mb-1">Property Location *</label>
            <input type="text" required value={formData.propertyLocation} onChange={set("propertyLocation")} placeholder="Street, City, State" className={inputCls} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-subtle mb-1">Project Type</label>
              <select value={formData.projectType} onChange={set("projectType")} className={inputCls}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-brand-subtle mb-1">Property Type</label>
              <select value={formData.propertyType} onChange={set("propertyType")} className={inputCls}>
                <option value="Interior Paint">Interior Only</option>
                <option value="Exterior Paint">Exterior Only</option>
                <option value="Complete Overhaul">Both</option>
                <option value="Spackling/Screeding">Spackling & Screeding</option>
                <option value="Wallpapering">Wallpaper / Special Finish</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">Preferred Start Date *</label>
            <input type="date" required value={formData.preferredStartDate} onChange={set("preferredStartDate")} className={inputCls} />
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">Project Description *</label>
            <textarea required rows={3} value={formData.projectDescription} onChange={set("projectDescription")}
              placeholder="Number of rooms, current condition, colours, etc."
              className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className="block text-brand-subtle mb-1">Additional Notes</label>
            <textarea rows={2} value={formData.additionalNotes} onChange={set("additionalNotes")}
              placeholder="Anything else for the painter?"
              className={`${inputCls} resize-none`} />
          </div>

          <div className="pt-3 border-t border-brand-border/40 flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg text-xs hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="px-5 py-2 bg-brand-accent text-brand-black font-semibold rounded-lg text-xs
                hover:bg-brand-accent-lt transition-colors flex items-center gap-2 disabled:opacity-50">
              {mutation.isPending ? <Loader size={13} className="animate-spin" /> : <Check size={13} />}
              {mutation.isPending ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PaintersPage() {
  const [selectedState, setSelectedState] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingPainter, setBookingPainter]   = useState<Painter | null>(null);
  const [reviewsPainter, setReviewsPainter]   = useState<Painter | null>(null);

  const { data: painters = [], isLoading } = useQuery<Painter[]>({
    queryKey: ["painters"],
    queryFn: async () => {
      try {
        const res = await apiGetPainters();
        return res?.painters ?? res?.data ?? [];
      } catch { return []; }
    },
  });

  // Unique states from painters list for the select dropdown
  const statesList = Array.from(new Set(painters.map((p) => p.state).filter(Boolean)));

  const filtered = painters.filter((p) => {
    const matchState  = selectedState === "All" || p.state === selectedState;
    const matchSearch = !searchQuery ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchState && matchSearch;
  });

  return (
    <main className="bg-brand-black min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Expert Services</p>
          <h1 className="font-display text-4xl font-bold">Request a Professional Painter</h1>
          <p className="text-brand-mid mt-2 w-1/2 text-sm">Find painters experienced in Gravitex, Marble Trowel Paint, and other decorative coatings. Connect with professionals in your area and request their services directly.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[60px] z-20 bg-brand-black/96 backdrop-blur-md border-b border-brand-border/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">

          {/* Search */}
          <div className="flex items-center gap-2 bg-brand-raised border border-brand-border rounded-lg px-3.5 py-2.5 w-full sm:w-64">
            <Search size={14} className="text-brand-subtle flex-shrink-0" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or skill..."
              className="bg-transparent text-white text-sm placeholder-brand-subtle outline-none flex-1 min-w-0" />
          </div>

          {/* Location select dropdown ← replaces the tab buttons */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none bg-brand-raised border border-brand-border text-sm text-white
                rounded-lg pl-3.5 pr-9 py-2.5 outline-none focus:border-brand-accent/60 transition-colors cursor-pointer"
            >
              <option value="All">All Locations</option>
              {statesList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader size={32} className="animate-spin text-brand-accent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <User size={44} className="text-brand-border mx-auto mb-3" />
              <p className="text-brand-mid text-sm">No painters found matching your criteria.</p>
            </div>
          ) : (
            <>
              <p className="text-brand-subtle text-xs mb-6 uppercase tracking-wider">
                {filtered.length} Painter{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((p) => (
                  <div key={p._id}
                    className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden
                      hover:border-brand-accent/30 transition-all duration-300 flex flex-col group">

                    {/* Image */}
                    <div className="relative w-full aspect-square bg-brand-raised overflow-hidden border-b border-brand-border/40">
                      <img
                        src={p.profileImage || "https://res.cloudinary.com/ddqhj3e3a/image/upload/v1784109923/paintmarket/painters/profile/nqdwczuyo1vsf5b0lyun.png"}
                        alt={p.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div>
                        <h3 className="text-white font-semibold text-sm leading-tight">{p.fullName}</h3>
                        <div className="flex items-center gap-1 mt-1 text-xs text-brand-mid">
                          <MapPin size={11} className="text-brand-accent" />
                          <span>{p.city}, {p.state}</span>
                        </div>
                      </div>

                      <p className="text-brand-mid text-xs leading-relaxed line-clamp-2 italic">
                        &ldquo;{p.bio || "Professional painter ready for your project."}&rdquo;
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-brand-border/20">
                        <div>
                          <span className="text-brand-subtle block">Experience</span>
                          <span className="font-semibold text-white">{p.yearsOfExperience} yrs</span>
                        </div>
                        <div>
                          <span className="text-brand-subtle block">Rating</span>
                          <span className="font-semibold text-white flex items-center gap-1">
                            <Star size={10} className="fill-brand-accent text-brand-accent" />
                            {p.averageRating > 0 ? p.averageRating.toFixed(1) : "N/A"}
                            <span className="text-brand-subtle">({p.totalReviews})</span>
                          </span>
                        </div>
                      </div>

                      {p.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.skills.slice(0,3).map((s, i) => (
                            <span key={i}
                              className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto flex flex-col gap-2 pt-1">
                        <button
                          onClick={() => setBookingPainter(p)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                            bg-brand-accent text-brand-black hover:bg-brand-accent-lt transition-colors
                            font-semibold text-xs"
                        >
                          <Calendar size={12} /> Book This Painter
                        </button>
                        {/* <button
                          onClick={() => setReviewsPainter(p)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                            border border-brand-border text-brand-mid hover:text-white hover:border-brand-accent/40
                            transition-colors text-xs"
                        >
                          <MessageSquare size={12} /> View Reviews
                          {p.totalReviews > 0 && (
                            <span className="ml-1 bg-brand-raised border border-brand-border rounded-full
                              text-[10px] px-1.5 py-0.5 text-brand-mid">
                              {p.totalReviews}
                            </span>
                          )}
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modals */}
      {bookingPainter && (
        <BookingModal painter={bookingPainter} onClose={() => setBookingPainter(null)} />
      )}
      {/* {reviewsPainter && (
        <ReviewsModal painter={reviewsPainter} onClose={() => setReviewsPainter(null)} />
      )} */}

      <Footer />
    </main>
  );
}