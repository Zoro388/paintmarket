"use client";
import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { apiCreateSiteEstimator } from "@/lib/userApi";
import { Calculator, CheckCircle, ClipboardList, Clock, Star, ArrowRight } from "lucide-react";

const propertyTypes = ["House", "Apartment", "Office", "Commercial", "Other"];
const projectTypes = ["Interior Painting","Exterior Painting","Full Renovation","Ceiling Work","Waterproofing","Other"];

const inputCls = "w-full bg-brand-raised border border-brand-border text-white placeholder-brand-subtle px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

export default function SiteEstimatorPage() {
  type SiteEstimatorForm = {
    fullName: string;
    phoneNumber: string;
    email: string;
    propertyLocation: string;
    propertyType: string;
    preferredInspectionDate: string;
    additionalNotes: string;
    numberOfRooms: number;
  };

  const [form, setForm] = useState<SiteEstimatorForm>({
    fullName:"", phoneNumber:"", email:"",
    propertyLocation:"", propertyType:"", preferredInspectionDate:"", additionalNotes:"",
    numberOfRooms: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "numberOfRooms" ? Number(value) : value,
    }));
  };
  console.log('form',form)

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault(); setLoading(true); setError("");
    try { await apiCreateSiteEstimator(form); setSuccess(true); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setLoading(false); }
  };

  const perks = [
    { icon: Calculator,    label: "Accurate Estimates" },
    { icon: ClipboardList, label: "Detailed Reports" },
    { icon: Clock,         label: "Fast Turnaround" },
    { icon: Star,          label: "Zero Obligation" },
  ];

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
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
            Free Service
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
            Book a Site Estimator
          </h1>
          <p className="text-brand-mid text-lg max-w-xl mx-auto mb-8">
            Our expert estimators visit your property, assess the scope, and provide an accurate
            material &amp; labour estimate — completely free, no obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-brand-accent-muted border border-brand-accent/20 rounded-full px-4 py-2 text-brand-accent text-sm">
                <Icon size={13} /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-8 lg:p-10">
            {success ? (
              <div className="flex flex-col items-center justify-center py-16 gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <h3 className=",       play text-2xl font-bold text-white">Booking Confirmed!</h3>
                  <p className="text-brand-mid mt-2 max-w-xs text-sm">Our team will contact you to confirm your inspection date and time.</p>
                </div>
                <button onClick={() => setSuccess(false)} className="text-brand-accent text-sm underline underline-offset-4">Book another inspection</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Inspection Booking Form</h3>
                  <p className="text-brand-mid text-sm mt-1">Fill in your details and we&apos;ll confirm your booking within 2 hours.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {name:"fullName",            label:"Full Name *",          type:"text",  ph:"Your full name"},
                    {name:"phoneNumber",          label:"Phone Number *",       type:"tel",   ph:"+234..."},
                    {name:"email",         label:"Email Address *",      type:"email", ph:"you@example.com"},
                    {name:"propertyLocation",     label:"Property Location *",  type:"text",  ph:"Address, City, State"},
                                        {name:"numberOfRooms",        label:"Number of Rooms",      type:"number", ph:"e.g., 3"},

                  ].map((f) => (
                    <div key={f.name} className="flex flex-col gap-1.5">
                      <label className="text-brand-lt-gray text-xs font-medium">{f.label}</label>
                      <input name={f.name} type={f.type} required value={form[f.name as keyof SiteEstimatorForm]}
                        onChange={handleChange} placeholder={f.ph} className={inputCls} />
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Property Type *</label>
                    <select name="propertyType" required value={form.propertyType} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
                      <option value="">Select property type</option>
                      {propertyTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-brand-lt-gray text-xs font-medium">Preferred Inspection Date *</label>
                    <input name="preferredInspectionDate" type="date" required value={form.preferredInspectionDate} onChange={handleChange} className={inputCls} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-lt-gray text-xs font-medium">Additional Notes (optional)</label>
                  <textarea name="additionalNotes" rows={4} value={form.additionalNotes} onChange={handleChange}
                    placeholder="Access instructions, specific concerns, areas of focus..."
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
                  {loading ? "Submitting..." : "Book Site Inspection"}
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
