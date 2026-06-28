// "use client";
// import { useQuery } from "@tanstack/react-query";
// import { apiGetTools } from "@/lib/adminApi";
// import { Loader, Wrench } from "lucide-react";
// import Navbar from "@/components/landing/Navbar";
// import Footer from "@/components/landing/Footer";

// interface Tool {
//   _id: string;
//   id?: string;
//   name: string;
//   description: string;
//   image?: string;
// }

// export default function ToolsPage() {
//   const { data, isLoading } = useQuery<Tool[]>({
//     queryKey: ["tools"],
//     queryFn: async () => {
//       const res = await apiGetTools();
//       return (res?.tools ?? res?.data ?? []) as Tool[];
//     },
//   });

//   console.log('data',data)
//   const list = data ?? [];

//   return (
//    <>
//    <Navbar />
//  <div className="flex flex-col gap-10 min-h-screen bg-brand-black py-12">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden bg-gradient-to-b from-brand-card/50 to-transparent py-16 px-4 border-b border-brand-mid/10">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-accent-rgb),0.05),transparent_45%)]" />
//         <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-3 relative z-10">
//           <div className="p-3 bg-brand-card border border-brand-mid/20 rounded-2xl shadow-xl text-brand-accent mb-2">
//             <Wrench size={28} className="animate-pulse" />
//           </div>
//           <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
//             Tools We Use
//           </h1>
//           <p className="text-brand-mid text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
//             Discover the premium equipment, professional-grade machinery, and specialized tools we rely on to deliver flawless finishing and exceptional craftsmanship.
//           </p>
//         </div>
//       </div>

//       {/* Main Grid Content Area */}
//       <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
//         {isLoading ? (
//           <div className="py-24 flex flex-col items-center justify-center gap-3">
//             <Loader size={36} className="animate-spin text-brand-accent" />
//             <span className="text-brand-mid text-xs font-medium tracking-wide">Loading directory...</span>
//           </div>
//         ) : list.length === 0 ? (
//           <div className="py-20 border border-dashed border-brand-mid/20 rounded-2xl flex flex-col items-center justify-center gap-3 bg-brand-card/20">
//             <Wrench size={44} className="text-brand-mid/40" />
//             <h3 className="text-white font-medium text-base">No tools listed yet</h3>
//             <p className="text-brand-mid text-xs max-w-xs text-center">
//               Our dynamic directory is being populated. Check back shortly to see our deployment gear!
//             </p>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {list.map((tool) => {
//               const id = tool._id ?? tool.id!;
//               return (
//                 <div
//                   key={id}
//                   className="bg-brand-card border border-brand-mid/20 rounded-xl overflow-hidden
//                     hover:border-brand-accent/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group flex flex-col"
//                 >
//                   {/* Media Wrapper */}
//                   <div className="h-44 bg-black/40 flex items-center justify-center overflow-hidden relative border-b border-brand-mid/10">
//                     {tool.image ? (
//                       <img
//                         src={tool.image}
//                         alt={tool.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         loading="lazy"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-brand-black/20">
//                         <Wrench size={36} className="text-brand-mid/20" />
//                       </div>
//                     )}
//                   </div>

//                   {/* Text Meta Content */}
//                   <div className="p-5 flex flex-col gap-2 flex-1">
//                     <h3 className="text-white font-bold text-base tracking-wide leading-snug group-hover:text-brand-accent transition-colors duration-200">
//                       {tool.name}
//                     </h3>
//                     <p className="text-brand-mid text-xs leading-relaxed line-clamp-3">
//                       {tool.description}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//    <Footer />
   
//    </>
//   );
// }

"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetTools } from "@/lib/adminApi";
import { Loader, Wrench, ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface Tool {
  _id: string;
  id?: string;
  name: string;
  description: string;
  images?: string[];
}

export default function ToolsPage() {
  const { data, isLoading } = useQuery<Tool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await apiGetTools();
      return (res?.tools ?? res?.data ?? []) as Tool[];
    },
  });

  console.log('data', data);
  const list = (data ?? []).filter((t) => t && (t._id || t.id));

  // ── Carousel Lightbox State ──
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openLightbox = (images: string[], index: number) => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setActiveIdx(index);
    setIsOpen(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };

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
                const hasImages = tool.images && tool.images.length > 0;
                const toolImgs = tool.images ?? [];

                return (
                  <div
                    key={id}
                    className="bg-brand-card border border-brand-mid/20 rounded-xl overflow-hidden
                      hover:border-brand-accent/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group flex flex-col"
                  >
                    {/* Media Wrapper */}
                    <div className="h-44 bg-black/40 flex items-center justify-center overflow-hidden relative border-b border-brand-mid/10">
                      {hasImages ? (
                        <div 
                          className="w-full h-full cursor-zoom-in relative"
                          onClick={() => openLightbox(toolImgs, 0)}
                        >
                          <img
                            src={toolImgs[0]}
                            alt={tool.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {toolImgs.length > 1 && (
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10">
                              +{toolImgs.length - 1} more
                            </span>
                          )}
                        </div>
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
                      <p className="text-brand-mid text-xs leading-relaxed line-clamp-3 mb-2">
                        {tool.description}
                      </p>

                      {/* Extra mini clickable inline carousel row */}
                      {toolImgs.length > 1 && (
                        <div className="flex gap-1.5 mt-auto pt-2 border-t border-brand-mid/10">
                          {toolImgs.map((imgUrl, index) => (
                            <button
                              key={index}
                              onClick={() => openLightbox(toolImgs, index)}
                              className="w-8 h-8 rounded border border-brand-mid/30 hover:border-brand-accent overflow-hidden transition-colors flex-shrink-0"
                            >
                              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* ── Dynamic Lightbox Carousel Modal ── */}
      {isOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
          {/* Backdrop Close Click area */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Close trigger button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 text-brand-mid hover:text-white bg-brand-card/50 border border-brand-mid/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Slider Frame */}
          <div className="relative max-w-4xl w-full flex items-center justify-center z-10">
            {/* Prev Trigger */}
            {lightboxImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:-left-16 p-2 bg-brand-card/80 border border-brand-mid/20 rounded-full text-white hover:text-brand-accent hover:border-brand-accent/50 transition-all z-20"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Displaying Current Dynamic Frame */}
            <div className="w-full max-h-[75vh] flex items-center justify-center rounded-lg overflow-hidden select-none">
              <img
                src={lightboxImages[activeIdx]}
                alt=""
                className="max-w-full max-h-[75vh] object-contain rounded-md"
              />
            </div>

            {/* Next Trigger */}
            {lightboxImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:-right-16 p-2 bg-brand-card/80 border border-brand-mid/20 rounded-full text-white hover:text-brand-accent hover:border-brand-accent/50 transition-all z-20"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Pagination Index Dots */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-brand-card/40 px-3 py-1.5 rounded-full border border-brand-mid/10">
              {lightboxImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIdx(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === activeIdx ? "bg-brand-accent w-4" : "bg-brand-mid/50 hover:bg-brand-mid"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}