"use client";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />

      {/* Ambient glow — warm champagne, low opacity */}
      <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(212,175,120,0.07) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(212,175,120,0.04) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left copy ── */}
          <div className="flex flex-col gap-7">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2.5 w-fit rounded-full px-4 py-2
              border border-brand-accent/25 bg-brand-accent-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              <span className="text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase">
                Nigeria's Premier Paint Specialists
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.04] tracking-tight">
              <span className="text-white">Transform</span>
              <br />
              <span className="text-brand-accent">Every Space</span>
              <br />
              <span className="text-white">You Live In</span>
            </h1>

            <p className="text-brand-mid text-lg leading-relaxed max-w-md">
              Premium paints, professional painters, and expert estimators — everything you
              need to bring your interior vision to life. Trusted by thousands across Nigeria.
            </p>

            <div className="flex flex-wrap gap-3 mt-1">
              <Link
                href="/shop"
                className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
                  px-7 py-3.5 rounded-md hover:bg-brand-accent-lt transition-all duration-200 text-sm"
              >
                Shop Paints <ArrowRight size={15} />
              </Link>
              <Link
                href="/painter-request"
                className="flex items-center gap-2 border border-brand-border-lt text-brand-lt-gray
                  px-7 py-3.5 rounded-md hover:border-brand-accent hover:text-brand-accent
                  transition-all duration-200 text-sm"
              >
                <Play size={13} fill="currentColor" /> Request a Painter
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-7 border-t border-brand-border/60">
              {[
                { value: "800+", label: "Projects Completed" },
                { value: "200+",   label: "Paint Colours" },
                { value: "98%",    label: "Client Satisfaction" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-brand-accent text-2xl font-bold font-display">{s.value}</p>
                  <p className="text-brand-mid text-xs mt-0.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right visual ── */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[420px]">

              {/* Main card */}
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 shadow-2xl">
                {/* Colour grid */}
                <div className="aspect-video rounded-xl bg-brand-raised overflow-hidden mb-5 relative">
                  <div className="grid grid-cols-4 gap-0.5 p-3 w-full h-full">
                    {[
                      "#D4AF78","#1C1C1C","#F0EEE9","#4A4A3A",
                      "#0F0F0F","#A8842E","#C8C8C8","#8A8A8A",
                      "#E8D0A5","#2A2A2A","#FFFFFF","#333333",
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="rounded-sm"
                        style={{ backgroundColor: c, minHeight: "36px" }}
                      />
                    ))}
                  </div>
                  {/* Overlay label */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <span className="text-white text-[10px] font-semibold bg-black/50 rounded px-2 py-0.5">
                      Premium Colour Collection
                    </span>
                    <span className="text-brand-mid text-[10px] bg-black/50 rounded px-2 py-0.5">
                      200+ shades
                    </span>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm">Curated Paint Collections</p>
                <p className="text-brand-mid text-xs mt-1">Professionally matched for every interior style</p>
              </div>

             

              {/* Floating bottom-left badge */}
              <div className="absolute -bottom-5 -left-5 bg-brand-card border border-brand-border
                rounded-xl px-4 py-3 shadow-xl">
                <p className="text-brand-accent text-xs font-semibold mb-0.5">✓ Professional Painters</p>
                <p className="text-brand-mid text-[11px]">Vetted &amp; insured experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-subtle">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-brand-subtle to-transparent" />
      </div>
    </section>
  );
}
