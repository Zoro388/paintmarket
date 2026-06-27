"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGetTools } from "@/lib/adminApi";
import { Loader, Wrench } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface Tool {
  _id: string;
  id?: string;
  name: string;
  description: string;
  image?: string;
}

export default function ToolsPage() {
  const { data, isLoading } = useQuery<Tool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await apiGetTools();
      return (res?.tools ?? res?.data ?? []) as Tool[];
    },
  });

  const list = data ?? [];

  return (
   <>
   <Navbar />
 <div className="flex flex-col gap-10 min-h-screen bg-brand-black py-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-brand-card/50 to-transparent py-16 px-4 border-b border-brand-mid/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-accent-rgb),0.05),transparent_45%)]" />
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-3 relative z-10">
          <div className="p-3 bg-brand-card border border-brand-mid/20 rounded-2xl shadow-xl text-brand-accent mb-2">
            <Wrench size={28} className="animate-pulse" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tools We Use
          </h1>
          <p className="text-brand-mid text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover the premium equipment, professional-grade machinery, and specialized tools we rely on to deliver flawless finishing and exceptional craftsmanship.
          </p>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader size={36} className="animate-spin text-brand-accent" />
            <span className="text-brand-mid text-xs font-medium tracking-wide">Loading directory...</span>
          </div>
        ) : list.length === 0 ? (
          <div className="py-20 border border-dashed border-brand-mid/20 rounded-2xl flex flex-col items-center justify-center gap-3 bg-brand-card/20">
            <Wrench size={44} className="text-brand-mid/40" />
            <h3 className="text-white font-medium text-base">No tools listed yet</h3>
            <p className="text-brand-mid text-xs max-w-xs text-center">
              Our dynamic directory is being populated. Check back shortly to see our deployment gear!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((tool) => {
              const id = tool._id ?? tool.id!;
              return (
                <div
                  key={id}
                  className="bg-brand-card border border-brand-mid/20 rounded-xl overflow-hidden
                    hover:border-brand-accent/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group flex flex-col"
                >
                  {/* Media Wrapper */}
                  <div className="h-44 bg-black/40 flex items-center justify-center overflow-hidden relative border-b border-brand-mid/10">
                    {tool.image ? (
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-black/20">
                        <Wrench size={36} className="text-brand-mid/20" />
                      </div>
                    )}
                  </div>

                  {/* Text Meta Content */}
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="text-white font-bold text-base tracking-wide leading-snug group-hover:text-brand-accent transition-colors duration-200">
                      {tool.name}
                    </h3>
                    <p className="text-brand-mid text-xs leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
   <Footer />
   
   </>
  );
}