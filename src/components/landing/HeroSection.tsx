
// // "use client";

// // import Link from "next/link";
// // import Image from "next/image";
// // import { ArrowRight, Play, Loader2 } from "lucide-react";
// // import { useEffect, useState, useCallback } from "react";
// // import { userGetAllHeroBanners } from "../../lib/userApi"; // Adjust path if needed

// // interface HeroBanner {
// //   _id?: string;
// //   id?: string;
// //   title: string;
// //   subtitle?: string;
// //   description?: string;
// //   buttonText?: string;
// //   buttonLink?: string;
// //   displayOrder?: number | null;
// //   image?: {
// //     url: string;
// //     publicId?: string;
// //   } | string;
// //   imageUrl?: string;
// // }

// // export default function HeroSection() {
// //   const [banners, setBanners] = useState<HeroBanner[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [currentIndex, setCurrentIndex] = useState<number>(0);

// //   // Fetch banners on mount
// //   useEffect(() => {
// //     let isMounted = true;

// //     userGetAllHeroBanners()
// //       .then((res) => {
// //         if (!isMounted) return;
        
// //         // Target res.heroes as specified
// //         const bannerList: HeroBanner[] = Array.isArray(res?.heroes)
// //           ? res.heroes
// //           : Array.isArray(res)
// //           ? res
// //           : Array.isArray(res?.data)
// //           ? res.data
// //           : [];
// // console.log('raw', res)
// //         setBanners(bannerList);
// //       })
// //       .catch((err) => {
// //         console.error("Failed to fetch hero banners:", err);
// //       })
// //       .finally(() => {
// //         if (isMounted) setLoading(false);
// //       });

// //     return () => {
// //       isMounted = false;
// //     };
// //   }, []);

// //   // Slide advancement
// //   const nextSlide = useCallback(() => {
// //     setBanners((prevBanners) => {
// //       if (prevBanners.length === 0) return prevBanners;
// //       setCurrentIndex((prevIndex) => (prevIndex + 1) % prevBanners.length);
// //       return prevBanners;
// //     });
// //   }, []);

// //   // Auto-play slider every 5 seconds
// //   useEffect(() => {
// //     if (banners.length <= 1) return;

// //     const interval = setInterval(() => {
// //       nextSlide();
// //     }, 5000);

// //     return () => clearInterval(interval);
// //   }, [banners.length, nextSlide]);

// //   const currentBanner = banners[currentIndex];

// //   // Helper to extract image URL safely
// //   const getImageUrl = (banner?: HeroBanner): string => {
// //     if (!banner) return "";
// //     if (typeof banner.image === "object" && banner.image?.url) {
// //       return banner.image.url;
// //     }
// //     if (typeof banner.image === "string" && banner.image) {
// //       return banner.image;
// //     }
// //     return banner.imageUrl || "";
// //   };

// //   const backgroundImage = getImageUrl(currentBanner);

// //   return (
// //     <section className="relative min-h-screen flex items-center justify-left overflow-hidden bg-brand-black">
// //       {/* ── Full Background Image & Overlays ── */}
// //       {backgroundImage && (
// //         <div className="absolute inset-0 z-0">
// //           <Image
// //             src={backgroundImage}
// //             alt={currentBanner?.title || "Hero background"}
// //             fill
// //             priority
// //             unoptimized
// //             className="object-cover transition-opacity duration-1000"
// //           />
// //           {/* Dark gradient overlay to ensure copy contrast */}
// //           <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/40" />
// //         </div>
// //       )}

// //       {/* Subtle grid pattern */}
// //       <div
// //         className="absolute inset-0 opacity-40 z-10 pointer-events-none"
// //         style={{
// //           backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
// //                             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
// //           backgroundSize: "52px 52px",
// //         }}
// //       />

// //       {loading ? (
// //         <div className="relative z-20 flex flex-col items-center justify-center min-h-[400px]">
// //           <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
// //         </div>
// //       ) : (
// //         <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full text-center flex flex-col items-center">
// //           <div className="flex flex-col items-center gap-7 transition-all duration-500 ease-in-out">
// //             {/* Subtitle / Eyebrow pill */}
// //             {currentBanner?.subtitle && (
// //               <div className="inline-flex items-center gap-2.5 w-fit rounded-full px-4 py-2 border border-brand-accent/25 bg-brand-accent-muted/80 backdrop-blur-md">
// //                 <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
// //                 <span className="text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase">
// //                   {currentBanner.subtitle}
// //                 </span>
// //               </div>
// //             )}

// //             {/* Title */}
// //             <h1 className="font-display text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.04] tracking-tight text-white max-w-3xl">
// //               {currentBanner?.title || "Shop Paints That Stand the Test of Time."}
// //             </h1>

// //             {/* Description */}
// //             <p className="text-brand-mid text-lg leading-relaxed max-w-xl">
// //               {currentBanner?.description ||
// //                 "Explore our expertly crafted range of premium paints designed for beauty, strength and long-lasting protection."}
// //             </p>

// //             {/* CTA Buttons */}
// //             <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
// //               <Link
// //                 href={currentBanner?.buttonLink || "/shop"}
// //                 className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-8 py-3.5 rounded-md hover:bg-brand-accent-lt transition-all duration-200 text-sm shadow-lg"
// //               >
// //                 {currentBanner?.buttonText || "Shop Paints"} <ArrowRight size={15} />
// //               </Link>
// //               <Link
// //                 href="/painter-request"
// //                 className="flex items-center gap-2 border border-brand-border-lt text-brand-lt-gray bg-black/30 backdrop-blur-md px-8 py-3.5 rounded-md hover:border-brand-accent hover:text-brand-accent transition-all duration-200 text-sm"
// //               >
// //                 <Play size={13} fill="currentColor" /> Request a Painter
// //               </Link>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Bottom Center Dots Navigation ── */}
// //       {banners.length > 1 && (
// //         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
// //           {banners.map((_, idx) => (
// //             <button
// //               key={idx}
// //               onClick={() => setCurrentIndex(idx)}
// //               aria-label={`Go to slide ${idx + 1}`}
// //               className={`h-2.5 rounded-full transition-all duration-300 ${
// //                 idx === currentIndex
// //                   ? "w-8 bg-brand-accent"
// //                   : "w-2.5 bg-white/40 hover:bg-white/70"
// //               }`}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </section>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { ArrowRight, Play, Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { userGetAllHeroBanners } from "../../lib/userApi"; // Adjust path if needed

// interface HeroBanner {
//   _id?: string;
//   id?: string;
//   title: string;
//   subtitle?: string;
//   description?: string;
//   buttonText?: string;
//   buttonLink?: string;
//   displayOrder?: number | null;
//   image?: {
//     url: string;
//     publicId?: string;
//   } | string;
//   imageUrl?: string;
// }

// export default function HeroSection() {
//   const [banners, setBanners] = useState<HeroBanner[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   // Fetch banners on mount
//   useEffect(() => {
//     let isMounted = true;

//     userGetAllHeroBanners()
//       .then((res) => {
//         if (!isMounted) return;

//         // Target res.heroes as specified
//         const bannerList: HeroBanner[] = Array.isArray(res?.heroes)
//           ? res.heroes
//           : Array.isArray(res)
//           ? res
//           : Array.isArray(res?.data)
//           ? res.data
//           : [];

//         console.log("raw", res);
//         setBanners(bannerList);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch hero banners:", err);
//       })
//       .finally(() => {
//         if (isMounted) setLoading(false);
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Reliable Auto-play slider every 5 seconds
//   useEffect(() => {
//     if (banners.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [banners.length]);

//   const currentBanner = banners[currentIndex];

//   // Helper to extract image URL safely
//   const getImageUrl = (banner?: HeroBanner): string => {
//     if (!banner) return "";
//     if (typeof banner.image === "object" && banner.image?.url) {
//       return banner.image.url;
//     }
//     if (typeof banner.image === "string" && banner.image) {
//       return banner.image;
//     }
//     return banner.imageUrl || "";
//   };

//   const backgroundImage = getImageUrl(currentBanner);

//   return (
//     <section className="relative min-h-1/2  flex items-center justify-start overflow-hidden bg-brand-black ;g:min-h-screen">
//       {/* ── Full Background Image & Overlays ── */}
//       {backgroundImage && (
//         <div className="absolute inset-0 z-0">
//         <Image
//   src={backgroundImage}
//   alt={currentBanner?.title || "Hero background"}
//   fill
//   priority
//   unoptimized
//   // Use object-right, object-bottom-right, or custom percentages like object-[80%_center]
//   className="object-cover object-right md:object-right-center transition-opacity duration-1000"
// />
//           {/* Dark gradient overlay to ensure copy contrast */}
//           <div className="absolute inset-0 bg-gradient-to-r from-brand-black/5 via-brand-black/80 to-brand-black/40" />
//         </div>
//       )}

//       {/* Subtle grid pattern */}
//       <div
//         className="absolute inset-0 opacity-40 z-10 pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
//                             linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
//           backgroundSize: "52px 52px",
//         }}
//       />

//       {loading ? (
//         <div className="relative z-20 flex flex-col items-center justify-center w-full min-h-[400px]">
//           <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
//         </div>
//       ) : (
//         <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full text-left flex flex-col items-start">
//           <div className="flex flex-col items-start gap-7 transition-all duration-500 ease-in-out max-w-2xl">
//             {/* Subtitle / Eyebrow pill */}
//             {currentBanner?.subtitle && (
//               <div className="inline-flex items-center gap-2.5 w-fit rounded-full px-4 py-2 border border-brand-accent/25 bg-brand-accent-muted/80 backdrop-blur-md">
//                 <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
//                 <span className="text-brand-accent text-xs font-semibold tracking-[0.18em] uppercase">
//                   {currentBanner.subtitle}
//                 </span>
//               </div>
//             )}

//             {/* Title */}
//             <h1 className="font-display text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.04] tracking-tight text-white">
//               {currentBanner?.title || "Shop Paints That Stand the Test of Time."}
//             </h1>

//             {/* Description */}
//             <p className="text-brand text-lg leading-relaxed">
//               {currentBanner?.description ||
//                 "Explore our expertly crafted range of premium paints designed for beauty, strength and long-lasting protection."}
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-wrap items-center justify-start gap-4 mt-2">
//               <Link
//                 href={currentBanner?.buttonLink || "/shop"}
//                 className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-8 py-3.5 rounded-md hover:bg-brand-accent-lt transition-all duration-200 text-sm shadow-lg"
//               >
//                 {currentBanner?.buttonText || "Shop Paints"} <ArrowRight size={15} />
//               </Link>
//               <Link
//                 href="/painter-request"
//                 className="flex items-center gap-2 border border-brand-border-lt text-brand-lt-gray bg-black/30 backdrop-blur-md px-8 py-3.5 rounded-md hover:border-brand-accent hover:text-brand-accent transition-all duration-200 text-sm"
//               >
//                 <Play size={13} fill="currentColor" /> Request a Painter
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Bottom Center Dots Navigation ── */}
//       {banners.length > 1 && (
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
//           {banners.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentIndex(idx)}
//               aria-label={`Go to slide ${idx + 1}`}
//               className={`h-2.5 rounded-full transition-all duration-300 ${
//                 idx === currentIndex
//                   ? "w-8 bg-brand-accent"
//                   : "w-2.5 bg-white/40 hover:bg-white/70"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { userGetAllHeroBanners } from "../../lib/userApi"; // Adjust path if needed

interface HeroBanner {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  displayOrder?: number | null;
  image?: {
    url: string;
    publicId?: string;
  } | string;
  imageUrl?: string;
}

export default function HeroSection() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Fetch banners on mount
  useEffect(() => {
    let isMounted = true;

    userGetAllHeroBanners()
      .then((res) => {
        if (!isMounted) return;

        const bannerList: HeroBanner[] = Array.isArray(res?.heroes)
          ? res.heroes
          : Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];

        setBanners(bannerList);
      })
      .catch((err) => {
        console.error("Failed to fetch hero banners:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Reliable Auto-play slider every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentIndex];

  // Helper to extract image URL safely
  const getImageUrl = (banner?: HeroBanner): string => {
    if (!banner) return "";
    if (typeof banner.image === "object" && banner.image?.url) {
      return banner.image.url;
    }
    if (typeof banner.image === "string" && banner.image) {
      return banner.image;
    }
    return banner.imageUrl || "";
  };

  const backgroundImage = getImageUrl(currentBanner);

  return (
    // ── Mobile height: min-h-[50vh] or min-h-[75vh], Desktop: min-h-screen ──
    <section className="relative min-h-[75vh] lg:min-h-screen flex items-center justify-start overflow-hidden bg-brand-black">
      {/* ── Background Image & Overlay ── */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={currentBanner?.title || "Hero background"}
            fill
            priority
            unoptimized
            // object-center keeps the product(s) in the middle
            className="object-cover object-center transition-opacity duration-1000"
          />
          {/* Subtle gradient to maintain contrast without hiding the center products */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-brand-black/60 to-transparent" />
        </div>
      )}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-40 z-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />

      {loading ? (
        <div className="relative z-20 flex flex-col items-center justify-center w-full min-h-[300px]">
          <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
        </div>
      ) : (
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24 w-full text-left flex flex-col items-start">
          <div className="flex flex-col items-start gap-4 lg:gap-7 transition-all duration-500 ease-in-out max-w-2xl">
            {/* Subtitle / Eyebrow pill */}
            {currentBanner?.subtitle && (
              <div className="inline-flex items-center gap-2.5 w-fit rounded-full px-3.5 py-1.5 lg:px-4 lg:py-2 border border-brand-accent/25 bg-brand-accent-muted/80 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                <span className="text-brand-accent text-[10px] lg:text-xs font-semibold tracking-[0.18em] uppercase">
                  {currentBanner.subtitle}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[68px] font-bold leading-[1.1] lg:leading-[1.04] tracking-tight text-white">
              {currentBanner?.title || "Shop Paints That Stand the Test of Time."}
            </h1>

            {/* Description */}
            <p className="text-brand-mid text-sm sm:text-base lg:text-lg leading-relaxed">
              {currentBanner?.description ||
                "Explore our expertly crafted range of premium paints designed for beauty, strength and long-lasting protection."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-start gap-3 lg:gap-4 mt-2">
              <Link
                href={currentBanner?.buttonLink || "/shop"}
                className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-6 py-3 lg:px-8 lg:py-3.5 rounded-md hover:bg-brand-accent-lt transition-all duration-200 text-xs sm:text-sm shadow-lg"
              >
                {currentBanner?.buttonText || "Shop Paints"} <ArrowRight size={15} />
              </Link>
              <Link
                href="/painter-request"
                className="flex items-center gap-2 border border-brand-border-lt text-brand-lt-gray bg-black/30 backdrop-blur-md px-6 py-3 lg:px-8 lg:py-3.5 rounded-md hover:border-brand-accent hover:text-brand-accent transition-all duration-200 text-xs sm:text-sm"
              >
                <Play size={13} fill="currentColor" /> Request a Painter
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Center Dots Navigation ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 lg:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 lg:w-8 bg-brand-accent"
                  : "w-2 lg:w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}