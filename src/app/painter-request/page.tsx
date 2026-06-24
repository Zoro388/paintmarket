"use client";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { apiSubmitPainterRequest } from "@/lib/userApi";
import { Brush, CheckCircle, Home, Building, Palette, Calendar, ArrowRight } from "lucide-react";

const projectTypes  = ["Interior","Exterior","Both Interior & Exterior","Roof Painting","Floor Coating"];
const propertyTypes = ["Residential – Apartment","Residential – Duplex","Commercial Office","Warehouse / Industrial","School / Institution","Other"];

const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";
const selectCls = `${inputCls} cursor-pointer`;

export default function PainterRequestPage() {
  const [form, setForm] = useState({
    fullName:"", phoneNumber:"", email:"", propertyLocation:"",
    projectType:"", propertyType:"", projectDescription:"",
    preferredStartDate:"", additionalNotes:"",
  });
      console.log('form',form)

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('form',form)
    e.preventDefault(); setLoading(true); setError("");
    try { await apiSubmitPainterRequest(form); setSuccess(true); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"), form }
    finally { setLoading(false); }
  };

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40"
        style={{
          backgroundImage:`linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize:"52px 52px",
        }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">Our Service</p>
            <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
              Request a Professional Painter
            </h1>
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              Tell us about your project and we&apos;ll connect you with a vetted, insured painter
              in your area — usually within 24 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              {[{icon:Brush,label:"Vetted Painters"},{icon:Home,label:"All Property Types"},{icon:Palette,label:"Colour Consultation"},{icon:Calendar,label:"Flexible Scheduling"}].map(({icon:Icon,label}) => (
                <div key={label} className="flex items-center gap-2 bg-brand-accent-muted border border-brand-accent/20 rounded-full px-4 py-2 text-brand-accent text-sm">
                  <Icon size={13} /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-white mb-5">How It Works</h3>
              {[
                { step:"01", title:"Submit Request",  desc:"Fill in your project details and preferred start date." },
                { step:"02", title:"We Match You",    desc:"Our team reviews and connects you with the right painter." },
                { step:"03", title:"Get a Quote",     desc:"Receive a detailed quote before any work begins." },
                { step:"04", title:"Project Begins",  desc:"Your painter arrives and transforms your space." },
              ].map((s,i) => (
                <div key={s.step} className={`flex gap-4 pb-5 ${i<3?"border-b border-brand-border/40 mb-5":""}`}>
                  <span className="text-brand-accent font-bold text-sm font-display w-6 flex-shrink-0">{s.step}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{s.title}</p>
                    <p className="text-brand-mid text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-accent-muted border border-brand-accent/20 rounded-2xl p-5">
              <Building size={22} className="text-brand-accent mb-3" />
              <h4 className="text-white font-semibold text-sm mb-1.5">Commercial Projects?</h4>
              <p className="text-brand-mid text-xs leading-relaxed">
                For large commercial or industrial projects, our dedicated team provides fully
                customised solutions and dedicated project managers.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-2xl p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center py-16 gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-2xl font-bold text-white">Request Submitted!</h3>
                  <p className="text-brand-mid mt-2 max-w-xs text-sm">We&apos;ll review your request and match you with a painter within 24 hours.</p>
                </div>
                <button onClick={() => setSuccess(false)} className="text-brand-accent text-sm underline underline-offset-4">Submit another request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Project Details</h3>
                  <p className="text-brand-mid text-xs mt-1">All fields marked * are required</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {name:"fullName",        label:"Full Name *",        type:"text",  ph:"Your full name"},
                    {name:"phoneNumber",      label:"Phone Number *",     type:"tel",   ph:"+234..."},
                    {name:"email",     label:"Email Address *",    type:"email", ph:"you@example.com"},
                    {name:"propertyLocation", label:"Property Location *",type:"text",  ph:"Address / Area, State"},
                  ].map((f) => (
                    <div key={f.name} className="flex flex-col gap-1.5">
                      <label className="text-brand-lt-gray text-xs font-medium">{f.label}</label>
                      <input name={f.name} type={f.type} required value={(form as Record<string,string>)[f.name]}
                        onChange={handleChange} placeholder={f.ph} className={inputCls} />
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Project Type *</label>
                    <select name="projectType" required value={form.projectType} onChange={handleChange} className={selectCls}>
                      <option value="">Select type</option>
                      {projectTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Property Type *</label>
                    <select name="propertyType" required value={form.propertyType} onChange={handleChange} className={selectCls}>
                      <option value="">Select property</option>
                      {propertyTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Preferred Start Date *</label>
                  <input name="preferredStartDate" type="date" required value={form.preferredStartDate} onChange={handleChange} className={inputCls} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Project Description *</label>
                  <textarea name="projectDescription" required rows={4} value={form.projectDescription} onChange={handleChange}
                    placeholder="Describe the scope of work — number of rooms, current condition, surfaces to paint, etc."
                    className={`${inputCls} resize-none`} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Additional Notes (optional)</label>
                  <textarea name="additionalNotes" rows={3} value={form.additionalNotes} onChange={handleChange}
                    placeholder="Access instructions, special requirements, colour preferences..."
                    className={`${inputCls} resize-none`} />
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-3.5 rounded-lg hover:bg-brand-accent-lt transition-all disabled:opacity-50 text-sm">
                  {loading ? <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={15} />}
                  {loading ? "Submitting..." : "Submit Painter Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
