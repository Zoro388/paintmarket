"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGetBlogs } from "@/lib/userApi";
import { formatDate } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CTASection from "@/components/landing/CTASection";
import { Loader, Search, Tag, Calendar, ArrowRight, FileText } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  shortDescription: string;
  author: string;
  status: string;
  tags: string[];
  featuredImages: string[];
  createdAt: string;
}

const MOCK_BLOGS: BlogPost[] = [
  { _id: "b1", title: "5 Tips for Choosing the Perfect Interior Paint Colour", shortDescription: "Picking the right colour can transform any room from dull to stunning. Here's exactly how the pros get it right every time.", author: "Paint Domain Team", status: "published", tags: ["Interior", "Colour", "Tips"], featuredImages: [], createdAt: "2025-06-01" },
  { _id: "b2", title: "Why Exterior Paint Quality Matters More Than You Think", shortDescription: "Your exterior paint is your home's first line of defence against Nigeria's harsh sun, rain, and humidity.", author: "Paint Domain Team", status: "published", tags: ["Exterior", "Quality", "Durability"], featuredImages: [], createdAt: "2025-05-20" },
  { _id: "b3", title: "The Complete Guide to Surface Preparation Before Painting", shortDescription: "Great results start long before the first coat. Learn the surface prep steps that professional painters never skip.", author: "Paint Domain Team", status: "published", tags: ["Guide", "Preparation", "Pro Tips"], featuredImages: [], createdAt: "2025-05-10" },
  { _id: "b4", title: "Understanding Paint Finishes: Matte, Satin, Gloss & More", shortDescription: "Each finish has its purpose. We break down which sheen level works best for every room and surface.", author: "Paint Domain Team", status: "published", tags: ["Interior", "Finishes", "Guide"], featuredImages: [], createdAt: "2025-04-28" },
  { _id: "b5", title: "How to Calculate How Much Paint You Need", shortDescription: "Stop buying too much or running out mid-project. Our simple formula helps you order exactly the right amount.", author: "Paint Domain Team", status: "published", tags: ["Guide", "Tips"], featuredImages: [], createdAt: "2025-04-15" },
  { _id: "b6", title: "Waterproofing Your Walls: When and Why It Matters", shortDescription: "Damp walls lead to mould, structural damage, and costly repairs. Here's how to protect your property the right way.", author: "Paint Domain Team", status: "published", tags: ["Waterproofing", "Exterior", "Protection"], featuredImages: [], createdAt: "2025-04-02" },
];

const ALL_TAGS = Array.from(new Set(MOCK_BLOGS.flatMap((b) => b.tags)));
const TAG_COLORS = [
  "bg-blue-900/30 text-blue-400 border-blue-700/40",
  "bg-green-900/30 text-green-400 border-green-700/40",
  "bg-purple-900/30 text-purple-400 border-purple-700/40",
  "bg-orange-900/30 text-orange-400 border-orange-700/40",
  "bg-pink-900/30 text-pink-400 border-pink-700/40",
  "bg-cyan-900/30 text-cyan-400 border-cyan-700/40",
];
function getTagColor(tag: string) {
  return TAG_COLORS[ALL_TAGS.indexOf(tag) % TAG_COLORS.length] ?? TAG_COLORS[0];
}

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const { data, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blogs-public"],
    queryFn: async () => {
      try {
        const res = await apiGetBlogs();
        const blogs: BlogPost[] = res?.blogs ?? res?.data ?? [];
        return blogs.filter((b) => b.status === "published");
      } catch {
        return MOCK_BLOGS;
      }
    },
    placeholderData: MOCK_BLOGS,
  });

  const list: BlogPost[] = data ?? MOCK_BLOGS;
  const allTags: string[] = ["All", ...Array.from(new Set(list.flatMap((b) => b.tags)))];

  const filtered = list.filter((b) => {
    const matchesSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === "All" || b.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const [featured, ...rest] = filtered;

  return (
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-mid/20 bg-gradient-to-br from-brand-black via-brand-card/20 to-brand-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">Knowledge Base</p>
          <h1 className="font-display text-5xl font-bold text-brand-white mb-4">Paint Tips &amp; Insights</h1>
          <p className="text-brand-mid text-lg max-w-xl mx-auto">
            Expert advice, how-to guides, and inspiration from Nigeria&apos;s paint professionals.
          </p>
        </div>
      </section>

      {/* Search + Tags */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-brand-mid/10 sticky top-[72px] z-20 bg-brand-black/95 backdrop-blur-md">
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

      {/* Posts */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader size={32} className="animate-spin text-brand-accent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <FileText size={48} className="text-brand-mid mx-auto mb-4" />
              <p className="text-brand-mid text-lg">No articles found</p>
              <button
                onClick={() => { setSearch(""); setActiveTag("All"); }}
                className="text-brand-accent text-sm mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Featured post */}
              {featured && (
                <div className="grid lg:grid-cols-5 bg-brand-card border border-brand-accent/20 rounded-2xl overflow-hidden hover:border-brand-accent/50 transition-all group cursor-pointer">
                  <div className="lg:col-span-2 h-52 lg:h-auto bg-gradient-to-br from-brand-accent/15 via-brand-card to-brand-black flex items-center justify-center">
                    <FileText size={52} className="text-brand-accent/20" />
                  </div>
                  <div className="lg:col-span-3 p-7 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-brand-accent text-brand-black text-xs font-bold px-3 py-1 rounded-full">Latest</span>
                      {featured.tags.slice(0, 2).map((t) => (
                        <span key={t} className={`text-xs px-2.5 py-0.5 rounded-full border ${getTagColor(t)}`}>{t}</span>
                      ))}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-brand-white group-hover:text-brand-accent transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-brand-mid leading-relaxed">{featured.shortDescription}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4 text-brand-mid text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-brand-accent" />
                          {formatDate(featured.createdAt)}
                        </span>
                      </div>
                      <button className="flex items-center gap-2 text-brand-accent text-sm font-medium group-hover:gap-3 transition-all">
                        Read More <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining posts */}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((b) => (
                    <article
                      key={b._id}
                      className="bg-brand-card border border-brand-mid/30 rounded-2xl overflow-hidden hover:border-brand-accent/40 transition-all group flex flex-col cursor-pointer"
                    >
                      <div className="h-40 bg-gradient-to-br from-brand-black to-brand-card/80 flex items-center justify-center">
                        <FileText size={36} className="text-brand-accent/20" />
                      </div>
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex flex-wrap gap-1.5">
                          {b.tags.slice(0, 2).map((t) => (
                            <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTagColor(t)}`}>{t}</span>
                          ))}
                        </div>
                        <h3 className="font-display text-base font-bold text-brand-white group-hover:text-brand-accent transition-colors leading-snug flex-1">
                          {b.title}
                        </h3>
                        <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">{b.shortDescription}</p>
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
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
