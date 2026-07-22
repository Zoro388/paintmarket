
// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { apiGetBlogs } from "@/lib/userApi";
// import { formatDate } from "@/lib/utils";
// import Navbar from "@/components/landing/Navbar";
// import Footer from "@/components/landing/Footer";
// import CTASection from "@/components/landing/CTASection";
// import Image
//  from "next/image";
// import {
//   Loader,
//   Search,
//   Tag,
//   Calendar,
//   ArrowRight,
//   FileText,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
// } from "lucide-react";

// interface BlogPost {
//   _id: string;
//   title: string;
//   shortDescription?: string;
//   content?: string;
//   author?: string;
//   status?: string;
//   tags?: string[];
//   featuredImages?: string[];
//   createdAt: string;
// }

// const TAG_COLORS = [
//   "bg-blue-900/30 text-blue-400 border-blue-700/40",
//   "bg-green-900/30 text-green-400 border-green-700/40",
//   "bg-purple-900/30 text-purple-400 border-purple-700/40",
//   "bg-orange-900/30 text-orange-400 border-orange-700/40",
//   "bg-pink-900/30 text-pink-400 border-pink-700/40",
//   "bg-cyan-900/30 text-cyan-400 border-cyan-700/40",
// ];

// export default function BlogPage() {
//   const [search, setSearch] = useState("");
//   const [activeTag, setActiveTag] = useState("All");

//   // Selected Blog State for Detailed Modal
//   const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
//   const [currentImgIndex, setCurrentImgIndex] = useState(0);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["blogs-public"],
//     queryFn: async () => {
//       const res = await apiGetBlogs();
//       // Safely unpack array whether API returns raw array or nested object: res.blogs.data, res.blogs, res.data, etc.
//       const rawBlogs = res?.blogs?.data ?? res?.blogs ?? res?.data ?? res;
//       return Array.isArray(rawBlogs) ? (rawBlogs as BlogPost[]) : [];
//     },
//   });

//   // Guarantee `list` is always an array
//   const list: BlogPost[] = Array.isArray(data) ? data : [];

//   // Extract unique tags safely using Array.isArray check
//   const dynamicTags = Array.from(
//     new Set(
//       list.flatMap((b) => (Array.isArray(b?.tags) ? b.tags : []))
//     )
//   ).filter(Boolean);

//   const allTags: string[] = ["All", ...dynamicTags];

//   function getTagColor(tag: string) {
//     const idx = dynamicTags.indexOf(tag);
//     return TAG_COLORS[idx >= 0 ? idx % TAG_COLORS.length : 0];
//   }

//   // Filter posts based on search and tag selection
//   const filtered = list.filter((b) => {
//     const titleMatch = b.title?.toLowerCase().includes(search.toLowerCase());
//     const descMatch = b.shortDescription
//       ?.toLowerCase()
//       .includes(search.toLowerCase());
//     const matchesSearch = !search || titleMatch || descMatch;

//     const matchesTag =
//       activeTag === "All" || (Array.isArray(b.tags) && b.tags.includes(activeTag));

//     return matchesSearch && matchesTag;
//   });

//   const [featured, ...rest] = filtered;

//   // Modal handlers
//   const handleOpenModal = (blog: BlogPost) => {
//     setSelectedBlog(blog);
//     setCurrentImgIndex(0);
//   };

//   const handleNextImage = () => {
//     if (!selectedBlog?.featuredImages?.length) return;
//     setCurrentImgIndex((prev) => (prev + 1) % selectedBlog.featuredImages!.length);
//   };

//   const handlePrevImage = () => {
//     if (!selectedBlog?.featuredImages?.length) return;
//     setCurrentImgIndex((prev) =>
//       prev === 0 ? selectedBlog.featuredImages!.length - 1 : prev - 1
//     );
//   };

//   console.log('blog',list)
//   return (
//     <main className="bg-brand-black min-h-screen">
//       <Navbar />

//       {/* Hero Header */}
//       <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-mid/20 bg-gradient-to-br from-brand-black via-brand-card/20 to-brand-black">
//         <div className="max-w-7xl mx-auto text-center">
//           <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
//             Knowledge Base
//           </p>
//           <h1 className="font-display text-5xl font-bold text-brand-white mb-4">
//             Paint Tips &amp; Insights
//           </h1>
//           <p className="text-brand-mid text-lg max-w-xl mx-auto">
//             Expert advice, how-to guides, and inspiration from Nigeria&apos;s
//             paint professionals.
//           </p>
//         </div>
//       </section>

//       {/* Search + Tag Filters (Non-sticky to avoid page occlusion) */}
//       <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-brand-mid/10 bg-brand-black">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//           <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 w-full sm:w-72 flex-shrink-0">
//             <Search size={14} className="text-brand-mid" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search articles..."
//               className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {allTags.map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => setActiveTag(tag)}
//                 className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
//                   activeTag === tag
//                     ? "bg-brand-accent text-brand-black border-brand-accent"
//                     : "bg-transparent border-brand-mid/30 text-brand-mid hover:text-brand-white hover:border-brand-mid"
//                 }`}
//               >
//                 {tag !== "All" && <Tag size={10} />}
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Articles Feed */}
//       <section className="py-14 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {isLoading ? (
//             <div className="py-28 flex flex-col items-center justify-center gap-3">
//               <Loader size={36} className="animate-spin text-brand-accent" />
//               <p className="text-brand-mid text-sm">Loading articles...</p>
//             </div>
//           ) : error ? (
//             <div className="py-20 text-center text-red-400">
//               <p>Failed to load articles. Please check back later.</p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="py-20 text-center">
//               <FileText size={48} className="text-brand-mid mx-auto mb-4" />
//               <p className="text-brand-mid text-lg">No articles found</p>
//               <button
//                 onClick={() => {
//                   setSearch("");
//                   setActiveTag("All");
//                 }}
//                 className="text-brand-accent text-sm mt-2 hover:underline"
//               >
//                 Clear filters
//               </button>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-10">
//               {/* Featured Post */}
//               {featured && (
//                 <div
//                   onClick={() => handleOpenModal(featured)}
//                   className="grid lg:grid-cols-5 bg-brand-card border border-brand-accent/20 rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all group cursor-pointer"
//                 >
//                   <div className="lg:col-span-2 h-56 lg:h-auto bg-gradient-to-br from-brand-accent/15 via-brand-card to-brand-black flex items-center justify-center overflow-hidden relative">
//                     {featured.featuredImages && featured.featuredImages.length > 0 ? (
//                       <Image
//                         src={featured.featuredImages[0]}
//                         alt={featured.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     ) : (
//                       <FileText size={52} className="text-brand-accent/20" />
//                     )}
//                   </div>
//                   <div className="lg:col-span-3 p-7 flex flex-col justify-center gap-4">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="bg-brand-accent text-brand-black text-xs font-bold px-3 py-1 rounded-full">
//                         Latest
//                       </span>
//                       {featured.tags?.slice(0, 3).map((t) => (
//                         <span
//                           key={t}
//                           className={`text-xs px-2.5 py-0.5 rounded-full border ${getTagColor(t)}`}
//                         >
//                           {t}
//                         </span>
//                       ))}
//                     </div>
//                     <h2 className="font-display text-2xl font-bold text-brand-white group-hover:text-brand-accent transition-colors leading-snug">
//                       {featured.title}
//                     </h2>
//                     <p className="text-brand-mid leading-relaxed line-clamp-3">
//                       {featured.shortDescription}
//                     </p>
//                     <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
//                       <div className="flex items-center gap-4 text-brand-mid text-xs">
//                         <span className="flex items-center gap-1.5">
//                           <Calendar size={12} className="text-brand-accent" />
//                           {formatDate(featured.createdAt)}
//                         </span>
//                       </div>
//                       <button className="flex items-center gap-2 text-brand-accent text-sm font-medium group-hover:gap-3 transition-all">
//                         Read More <ArrowRight size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Grid of Remaining Posts */}
//               {rest.length > 0 && (
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                   {rest.map((b) => (
//                     <article
//                       key={b._id}
//                       onClick={() => handleOpenModal(b)}
//                       className="bg-brand-card border border-brand-mid/30 rounded-2xl overflow-hidden hover:border-brand-accent/40 transition-all group flex flex-col cursor-pointer"
//                     >
//                       <div className="h-44 bg-gradient-to-br from-brand-black to-brand-card/80 flex items-center justify-center overflow-hidden relative">
//                         {b.featuredImages && b.featuredImages.length > 0 ? (
//                           <img
//                             src={b.featuredImages[0]}
//                             alt={b.title}
//                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                           />
//                         ) : (
//                           <FileText size={36} className="text-brand-accent/20" />
//                         )}
//                       </div>
//                       <div className="p-5 flex flex-col gap-3 flex-1">
//                         <div className="flex flex-wrap gap-1.5">
//                           {b.tags?.slice(0, 2).map((t) => (
//                             <span
//                               key={t}
//                               className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTagColor(t)}`}
//                             >
//                               {t}
//                             </span>
//                           ))}
//                         </div>
//                         <h3 className="font-display text-base font-bold text-brand-white group-hover:text-brand-accent transition-colors leading-snug flex-1 line-clamp-2">
//                           {b.title}
//                         </h3>
//                         <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">
//                           {b.shortDescription}
//                         </p>
//                         <div className="flex items-center justify-between border-t border-brand-mid/20 pt-3 mt-auto">
//                           <div className="flex items-center gap-2 text-brand-mid text-xs">
//                             <Calendar size={11} className="text-brand-accent" />
//                             {formatDate(b.createdAt)}
//                           </div>
//                           <span className="flex items-center gap-1 text-brand-accent text-xs font-medium group-hover:gap-2 transition-all">
//                             Read <ArrowRight size={11} />
//                           </span>
//                         </div>
//                       </div>
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Modal View for Full Blog Details */}
//       {selectedBlog && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
//           onClick={() => setSelectedBlog(null)}
//         >
//           <div
//             className="bg-brand-black border border-brand-mid/30 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative my-8 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedBlog(null)}
//               className="absolute top-4 right-4 z-20 bg-black/70 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black transition-colors"
//             >
//               <X size={18} />
//             </button>

//             <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
//               {/* Carousel / Image Lightbox */}
//               {selectedBlog.featuredImages && selectedBlog.featuredImages.length > 0 && (
//                 <div className="relative w-full h-64 sm:h-80 bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-brand-mid/20">
//                   <img
//                     src={selectedBlog.featuredImages[currentImgIndex]}
//                     alt={`${selectedBlog.title} - image ${currentImgIndex + 1}`}
//                     className="w-full h-full object-contain"
//                   />

//                   {/* Carousel Arrows */}
//                   {selectedBlog.featuredImages.length > 1 && (
//                     <>
//                       <button
//                         onClick={handlePrevImage}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black transition-colors"
//                       >
//                         <ChevronLeft size={20} />
//                       </button>
//                       <button
//                         onClick={handleNextImage}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black transition-colors"
//                       >
//                         <ChevronRight size={20} />
//                       </button>

//                       {/* Image Position Dots */}
//                       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/60 px-3 py-1 rounded-full">
//                         {selectedBlog.featuredImages.map((_, idx) => (
//                           <button
//                             key={idx}
//                             onClick={() => setCurrentImgIndex(idx)}
//                             className={`w-2 h-2 rounded-full transition-all ${
//                               currentImgIndex === idx
//                                 ? "bg-brand-accent w-4"
//                                 : "bg-white/40"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               )}

//               {/* Title & Metadata */}
//               <div className="space-y-3">
//                 <div className="flex flex-wrap items-center gap-2">
//                   {selectedBlog.tags?.map((t) => (
//                     <span
//                       key={t}
//                       className={`text-xs px-2.5 py-0.5 rounded-full border ${getTagColor(t)}`}
//                     >
//                       {t}
//                     </span>
//                   ))}
//                 </div>

//                 <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-white">
//                   {selectedBlog.title}
//                 </h2>

//                 <div className="flex flex-wrap items-center gap-4 text-brand-mid text-xs border-b border-brand-mid/20 pb-4">
//                   {selectedBlog.author && (
//                     <span className="flex items-center gap-1.5">
//                       <User size={13} className="text-brand-accent" />
//                       {selectedBlog.author}
//                     </span>
//                   )}
//                   <span className="flex items-center gap-1.5">
//                     <Calendar size={13} className="text-brand-accent" />
//                     {formatDate(selectedBlog.createdAt)}
//                   </span>
//                 </div>
//               </div>

//               {/* Body Content */}
//               <div className="text-brand-mid space-y-4 text-sm sm:text-base leading-relaxed">
//                 {selectedBlog.shortDescription && (
//                   <p className="text-brand-white font-medium italic border-l-2 border-brand-accent pl-4">
//                     {selectedBlog.shortDescription}
//                   </p>
//                 )}
//                 <div className="whitespace-pre-line">
//                   {selectedBlog.content ?? selectedBlog.shortDescription}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <CTASection />
//       <Footer />
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetBlogs } from "@/lib/userApi";
import { formatDate } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTASection from "@/components/landing/CTASection";
import {
  Loader,
  Search,
  Tag,
  Calendar,
  ArrowRight,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Image from "next/image";

interface BlogPost {
  _id: string;
  title: string;
  shortDescription?: string;
  content?: string;
  author?: string;
  status?: string;
  tags?: string[];
  featuredImage?: string | string[];
  featuredImages?: string | string[];
  createdAt: string;
}

const TAG_COLORS = [
  "bg-blue-900/30 text-blue-400 border-blue-700/40",
  "bg-green-900/30 text-green-400 border-green-700/40",
  "bg-purple-900/30 text-purple-400 border-purple-700/40",
  "bg-orange-900/30 text-orange-400 border-orange-700/40",
  "bg-pink-900/30 text-pink-400 border-pink-700/40",
  "bg-cyan-900/30 text-cyan-400 border-cyan-700/40",
];

/**
 * Normalizes image data whether it comes as:
 * - string: "https://example.com/img.jpg"
 * - array: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
 * - null/undefined
 */
function normalizeImages(rawImage?: string | string[], rawImages?: string | string[]): string[] {
  const target = rawImages ?? rawImage;
  if (!target) return [];
  if (Array.isArray(target)) {
    return target.filter((img): img is string => typeof img === "string" && Boolean(img.trim()));
  }
  if (typeof target === "string" && target.trim()) {
    return [target.trim()];
  }
  return [];
}

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  // Selected Blog State for Detailed Modal
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs-public"],
    queryFn: async () => {
      const res = await apiGetBlogs();
      // Safely unpack array whether API returns raw array or nested object
      const rawBlogs = res?.blogs?.data ?? res?.blogs ?? res?.data ?? res;
      return Array.isArray(rawBlogs) ? (rawBlogs as BlogPost[]) : [];
    },
  });

  // Guarantee `list` is always an array
  const list: BlogPost[] = Array.isArray(data) ? data : [];

  // Extract unique tags safely using Array.isArray check
  const dynamicTags = Array.from(
    new Set(
      list.flatMap((b) => (Array.isArray(b?.tags) ? b.tags : []))
    )
  ).filter(Boolean);

  const allTags: string[] = ["All", ...dynamicTags];

  function getTagColor(tag: string) {
    const idx = dynamicTags.indexOf(tag);
    return TAG_COLORS[idx >= 0 ? idx % TAG_COLORS.length : 0];
  }

  // Filter posts based on search and tag selection
  const filtered = list.filter((b) => {
    const titleMatch = b.title?.toLowerCase().includes(search.toLowerCase());
    const descMatch = b.shortDescription
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesSearch = !search || titleMatch || descMatch;

    const matchesTag =
      activeTag === "All" || (Array.isArray(b.tags) && b.tags.includes(activeTag));

    return matchesSearch && matchesTag;
  });

  const [featured, ...rest] = filtered;

  // Modal handlers
  const handleOpenModal = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setCurrentImgIndex(0);
  };

  const selectedImages = selectedBlog
    ? normalizeImages(selectedBlog.featuredImage, selectedBlog.featuredImages)
    : [];

  const handleNextImage = () => {
    if (selectedImages.length <= 1) return;
    setCurrentImgIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const handlePrevImage = () => {
    if (selectedImages.length <= 1) return;
    setCurrentImgIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-mid/20 bg-gradient-to-br from-brand-black via-brand-card/20 to-brand-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Knowledge Base
          </p>
          <h1 className="font-display text-5xl font-bold text-brand-white mb-4">
            Paint Tips &amp; Insights
          </h1>
          <p className="text-brand-mid text-lg max-w-xl mx-auto">
            Expert advice, how-to guides, and inspiration from Nigeria&apos;s
            paint professionals.
          </p>
        </div>
      </section>

      {/* Search + Tag Filters */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-brand-mid/10 bg-brand-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 w-full sm:w-72 flex-shrink-0">
            <Search size={14} className="text-brand-mid" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  activeTag === tag
                    ? "bg-brand-accent text-brand-black border-brand-accent"
                    : "bg-transparent border-brand-mid/30 text-brand-mid hover:text-brand-white hover:border-brand-mid"
                }`}
              >
                {tag !== "All" && <Tag size={10} />}
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Feed */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-28 flex flex-col items-center justify-center gap-3">
              <Loader size={36} className="animate-spin text-brand-accent" />
              <p className="text-brand-mid text-sm">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-400">
              <p>Failed to load articles. Please check back later.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <FileText size={48} className="text-brand-mid mx-auto mb-4" />
              <p className="text-brand-mid text-lg">No articles found</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveTag("All");
                }}
                className="text-brand-accent text-sm mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
  {list.map((b) => {
    const postImages = normalizeImages(b.featuredImage, b.featuredImages);
    const isFeatured = featured && b._id === featured._id;

    return (
      <article
        key={b._id}
        onClick={() => handleOpenModal(b)}
        className={`bg-brand-card border rounded-2xl overflow-hidden transition-all group flex flex-col cursor-pointer ${
          isFeatured
            ? "border-brand-accent/50 hover:border-brand-accent"
            : "border-brand-mid/30 hover:border-brand-accent/40"
        }`}
      >
        <div className="h-44 bg-gradient-to-br from-brand-black to-brand-card/80 flex items-center justify-center overflow-hidden relative">
          {postImages.length > 0 ? (
            <Image
              height={300}
              width={400}
              src={postImages[0]}
              alt={b.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <FileText size={36} className="text-brand-accent/20" />
          )}
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex flex-wrap gap-1.5 items-center">
            {/* Featured Badge */}
            {isFeatured && (
              <span className="bg-brand-accent text-brand-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}

            {b.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTagColor(t)}`}
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="font-display text-base font-bold text-brand-white group-hover:text-brand-accent transition-colors leading-snug flex-1 line-clamp-2">
            {b.title}
          </h3>

          <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">
            {b.shortDescription}
          </p>

          <div className="flex items-center justify-between border-t border-brand-mid/20 pt-3 mt-auto">
            <div className="flex items-center gap-2 text-brand-mid text-xs">
              <Calendar size={11} className="text-brand-accent" />
              {formatDate(b.createdAt)}
            </div>
            <span className="flex items-center gap-1 text-brand-accent text-xs font-medium group-hover:gap-2 transition-all">
              Read <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </article>
    );
  })}
</div>
          )}
        </div>
      </section>

      {/* Modal View for Full Blog Details */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-brand-black border border-brand-mid/30 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-20 bg-black/70 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Carousel / Image Lightbox */}
              {selectedImages.length > 0 && (
                <div className="relative w-full h-64 sm:h-80 bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-brand-mid/20">
                  <img
                    src={selectedImages[currentImgIndex]}
                    alt={`${selectedBlog.title} - image ${currentImgIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Carousel Controls (only render if there are multiple images) */}
                  {selectedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Image Position Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/60 px-3 py-1 rounded-full">
                        {selectedImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImgIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentImgIndex === idx
                                ? "bg-brand-accent w-4"
                                : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedBlog.tags?.map((t) => (
                    <span
                      key={t}
                      className={`text-xs px-2.5 py-0.5 rounded-full border ${getTagColor(t)}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-white">
                  {selectedBlog.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-brand-mid text-xs border-b border-brand-mid/20 pb-4">
                  {selectedBlog.author && (
                    <span className="flex items-center gap-1.5">
                      <User size={13} className="text-brand-accent" />
                      {selectedBlog.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-brand-accent" />
                    {formatDate(selectedBlog.createdAt)}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="text-brand-mid space-y-4 text-sm sm:text-base leading-relaxed">
                {selectedBlog.shortDescription && (
                  <p className="text-brand-white font-medium italic border-l-2 border-brand-accent pl-4">
                    {selectedBlog.shortDescription}
                  </p>
                )}
                <div className="whitespace-pre-line">
                  {selectedBlog.content ?? selectedBlog.shortDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CTASection />
      <Footer />
    </main>
  );
}