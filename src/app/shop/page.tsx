

"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetProducts , apiAddToCart} from "@/lib/userApi";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ShoppingCart, Search, Loader, Package, CheckCircle, HelpCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import LoadingSkeleton from "../dashboard/components/Loading";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Updated Interface to support the nested structure of questions and product images
interface QuestionAnswer {
  question: string;
  answer: string;
}

interface Product { 
  _id: string; 
  productName: string; 
  productCategory: string; 
  productDescription: string; 
  colourCode: string; 
  colourName: string; 
  price: number; 
  stockQuantity: number; 
  coverageInformation: string; 
  productFeatures: string[]; 
  status: string; 
  questions?: QuestionAnswer[];
  productImages?: string[];
}

export default function ShopPage() {
  const COLORS = {
  bg: "#F8F5F0",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
};
  const [cat, setCat]   = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // State management for image expansion lightbox modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // State management for the Q&A Info Modal
  const [activeInfoProduct, setActiveInfoProduct] = useState<Product | null>(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["shop-products"],
    queryFn: async () => {
      try { 
        const res = await apiGetProducts(); 
        return res?.products ?? res?.data ?? [];      
      } catch { 
        return []; 
      }
    },
  });

  const category = data
    ? Array.from(new Set(data.map((p) => p.productCategory))).filter(Boolean)
    : [];
  const CATS = ["All", ...category];

  const list = (data || []).filter((p) => p.status === "active");
  const filtered = list
    .filter((p) => cat === "All" || p.productCategory === cat)
    .filter((p) => !search || p.productName.toLowerCase().includes(search.toLowerCase()));

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ productId, quantity, selectedColour }: { productId: string; quantity: number; selectedColour: string }) => {
      const res = await apiAddToCart({ productId, quantity, selectedColour });
      return { res, productId };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cart-product"] });
      toast.success("Product added to cart successfully!");
      if (data?.productId) {
        setCart((prev) => [...prev, data.productId]);
      }
    },
    onError: (err: Error) => {
      console.error('Error adding to cart:', err);
      if (err.message && err.message.includes("Access denied")) {
        toast.error("Please sign up or log in to add products to your cart");
        router.push('/login');
      } else {
        toast.error(err.message || "Failed to add product to cart");
      }
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
   <main className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />

      {/* Hero bar */}
      <section 
        className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b"
        style={{ borderColor: "rgba(197, 154, 70, 0.18)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: COLORS.accent }}>
              Paint Shop
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight" style={{ color: COLORS.primaryText }}>
              Browse Our Collection
            </h1>
            <p className="mt-2 text-sm" style={{ color: COLORS.secondaryText }}>
              {list.length} premium paints available
            </p>
          </div>
          {cart.length > 0 && (
            <div 
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm"
              style={{ backgroundColor: COLORS.accent }}
            >
              <ShoppingCart size={15} />
              {cart.length} item{cart.length > 1 ? "s" : ""} in cart
            </div>
          )}
        </div>
      </section>

      {/* Sticky filter bar */}
      <div 
        className="sticky top-[60px] z-20 backdrop-blur-md border-b py-4 px-4 sm:px-6 lg:px-8"
        style={{ 
          backgroundColor: "rgba(248, 245, 240, 0.92)", 
          borderColor: "rgba(197, 154, 70, 0.18)" 
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          
          {/* Search Input */}
          <div 
            className="flex items-center gap-2 bg-white border rounded-lg px-3.5 py-2.5 w-full sm:w-64 shadow-sm"
            style={{ borderColor: "rgba(197, 154, 70, 0.25)" }}
          >
            <Search size={14} className="flex-shrink-0" style={{ color: COLORS.secondaryText }} />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search paints..."
              className="bg-transparent text-sm placeholder:text-gray-400 outline-none flex-1 min-w-0" 
              style={{ color: COLORS.primaryText }}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => {
              const isActive = cat === c;
              return (
                <button 
                  key={c} 
                  onClick={() => setCat(c)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-sm"
                  style={{
                    backgroundColor: isActive ? COLORS.accent : "#FFFFFF",
                    color: isActive ? "#FFFFFF" : COLORS.secondaryText,
                    border: isActive ? `1px solid ${COLORS.accent}` : "1px solid rgba(197, 154, 70, 0.2)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Product grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader size={28} className="animate-spin" style={{ color: COLORS.accent }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={44} className="mx-auto mb-3 opacity-40" style={{ color: COLORS.secondaryText }} />
              <p className="text-sm" style={{ color: COLORS.secondaryText }}>No products found</p>
            </div>
          ) : (
            <>
              <p className="text-xs mb-6 uppercase tracking-wider font-semibold" style={{ color: COLORS.secondaryText }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
              </p>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filtered.map((p) => {
                  const isAlreadyInCart = cart.includes(p._id);
                  const isCurrentlyAdding = mutation.isPending && mutation.variables?.productId === p._id;

                  return (
                    <div 
                      key={p._id}
                      className="bg-white border rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col hover:-translate-y-1 hover:shadow-md"
                      style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
                    >
                      
                      {/* Swatch Background / Product Image Component */}
                      <div 
                        className="h-32 relative flex items-center justify-center overflow-hidden transition-all"
                        style={{ backgroundColor: p.colourCode || '#F2ECE1' }}
                      >
                        {/* Interactive Clickable Product Image */}
                        {p.productImages && p.productImages.length > 0 && (
                          <Image
                            src={p.productImages[0]} 
                            alt={p.productName || "Product image"} 
                            width={1000}
                            height={1000}
                            onClick={() => setSelectedImage(p.productImages![0])}
                            className="h-[85%] w-auto object-contain drop-shadow-md z-10 cursor-pointer hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}

                        {/* Subtle bottom shadow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none z-10" />

                        {/* Bottom Left Label Segment */}
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 z-20">
                          <div 
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex-shrink-0"
                            style={{ backgroundColor: p.colourCode }} 
                          />
                          <span className="text-white text-[10px] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] uppercase tracking-wider">
                            {p.colourName || "No Name Color"} ({p.colourCode || 'No Code'})
                          </span>
                        </div>

                        {/* Category Pill Tag */}
                        <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-20 shadow-sm">
                          {p.productCategory}
                        </span>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <h3 
                            className="font-semibold text-sm leading-snug transition-colors group-hover:opacity-80"
                            style={{ color: COLORS.primaryText }}
                          >
                            {p.productName}
                          </h3>
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: COLORS.secondaryText }}>
                            {p.productDescription}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-lg font-display" style={{ color: COLORS.accent }}>
                            {formatCurrency(p.price)}
                          </span>
                        </div>

                        <p className="text-xs font-medium" style={{ color: COLORS.secondaryText }}>
                          Coverage: {p.coverageInformation}
                        </p>

                        {/* Product Features Badges */}
                        <div className="flex flex-wrap gap-1">
                          {p.productFeatures?.slice(0, 3).map((f) => (
                            <span 
                              key={f} 
                              className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                              style={{ 
                                backgroundColor: "rgba(197, 154, 70, 0.08)", 
                                borderColor: "rgba(197, 154, 70, 0.25)",
                                color: COLORS.accent 
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>

                        {/* Button 1: Add to Cart */}
                        <button
                          disabled={isCurrentlyAdding}
                          onClick={() => {
                            if (isAlreadyInCart) {
                              toast.error("Item is already in your cart!");
                              return;
                            }
                            mutation.mutate({ productId: p._id, quantity, selectedColour: p.colourName || p.colourCode });
                          }}
                          className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
                            isAlreadyInCart
                              ? "bg-emerald-50 border border-emerald-300 text-emerald-700"
                              : "text-white hover:opacity-90 disabled:opacity-75"
                          }`}
                          style={{
                            backgroundColor: isAlreadyInCart ? undefined : COLORS.accent,
                          }}
                        >
                          {isCurrentlyAdding ? (
                            <>
                              <Loader size={14} className="animate-spin" />
                              Adding...
                            </>
                          ) : isAlreadyInCart ? (
                            <>
                              <CheckCircle size={14} />
                              Added to Cart
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              Add to Cart
                            </>
                          )}
                        </button>

                        {/* Button 2: View Info & Q&A */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInfoProduct(p);
                            setOpenAccordionIndex(null);
                          }}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-white border transition-all duration-200 hover:bg-amber-50/40"
                          style={{
                            borderColor: "rgba(197, 154, 70, 0.3)",
                            color: COLORS.primaryText,
                          }}
                        >
                          <HelpCircle size={13} style={{ color: COLORS.accent }} />
                          See Info & FAQs
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Expanded Image Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-2"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white border text-gray-800 p-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              style={{ borderColor: "rgba(197, 154, 70, 0.3)" }}
            >
              <X size={20} />
            </button>
            <Image
              src={selectedImage}
              alt="Expanded product image"
              width={1600}
              height={1600}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white p-2"
            />
          </div>
        </div>
      )}

      {/* Dynamic Accordion Info Modal Popup */}
      {activeInfoProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[85vh]"
            style={{ borderColor: "rgba(197, 154, 70, 0.3)" }}
          >
            
            {/* Modal Header */}
            <div 
              className="p-5 border-b flex justify-between items-center"
              style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.2)" }}
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5" style={{ color: COLORS.accent }}>
                  Product Specifications & FAQ
                </span>
                <h2 className="font-bold text-lg leading-tight" style={{ color: COLORS.primaryText }}>
                  {activeInfoProduct.productName}
                </h2>
              </div>
              <button 
                onClick={() => setActiveInfoProduct(null)} 
                className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: COLORS.secondaryText }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              
              {/* Quick Details Block */}
              <div 
                className="grid grid-cols-2 gap-3 text-xs border p-3.5 rounded-xl"
                style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.2)" }}
              >
                <div>
                  <p className="mb-0.5 font-medium" style={{ color: COLORS.secondaryText }}>Category</p>
                  <p className="font-semibold" style={{ color: COLORS.primaryText }}>{activeInfoProduct.productCategory}</p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium" style={{ color: COLORS.secondaryText }}>Coverage</p>
                  <p className="font-semibold" style={{ color: COLORS.primaryText }}>{activeInfoProduct.coverageInformation || 'N/A'}</p>
                </div>
              </div>

              {/* Accordion List for Questions & Answers */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.primaryText }}>
                  Frequently Asked Questions
                </h4>
                
                {!activeInfoProduct.questions || activeInfoProduct.questions.length === 0 ? (
                  <div 
                    className="text-center py-6 border border-dashed rounded-xl"
                    style={{ borderColor: "rgba(197, 154, 70, 0.3)" }}
                  >
                    <HelpCircle size={24} className="mx-auto mb-2 opacity-50" style={{ color: COLORS.secondaryText }} />
                    <p className="text-xs" style={{ color: COLORS.secondaryText }}>No questions found for this paint variant.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeInfoProduct.questions.map((item, index) => {
                      const isOpen = openAccordionIndex === index;
                      return (
                        <div 
                          key={index} 
                          className="border rounded-xl overflow-hidden bg-white"
                          style={{ borderColor: "rgba(197, 154, 70, 0.2)" }}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenAccordionIndex(isOpen ? null : index)}
                            className="w-full text-left p-4 flex items-center justify-between transition-colors gap-3 hover:bg-amber-50/30"
                          >
                            <span 
                              className="text-xs font-semibold leading-relaxed"
                              style={{ color: isOpen ? COLORS.accent : COLORS.primaryText }}
                            >
                              {item.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp size={14} className="flex-shrink-0" style={{ color: COLORS.accent }} />
                            ) : (
                              <ChevronDown size={14} className="flex-shrink-0" style={{ color: COLORS.secondaryText }} />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div 
                              className="px-4 pb-4 pt-1 border-t text-xs leading-relaxed"
                              style={{ 
                                backgroundColor: COLORS.bg, 
                                borderColor: "rgba(197, 154, 70, 0.15)",
                                color: COLORS.secondaryText 
                              }}
                            >
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer actions */}
            <div 
              className="p-4 border-t flex justify-end"
              style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197, 154, 70, 0.2)" }}
            >
              <button
                type="button"
                onClick={() => setActiveInfoProduct(null)}
                className="px-4 py-2 text-white font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity shadow-sm"
                style={{ backgroundColor: COLORS.accent }}
              >
                Close Info Window
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}