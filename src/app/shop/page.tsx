

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
  const [cat, setCat]   = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

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
    <main className="bg-brand-black min-h-screen">
      <Navbar />

      {/* Hero bar */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b border-brand-border/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Paint Shop</p>
            <h1 className="font-display text-4xl font-bold text-white">Browse Our Collection</h1>
            <p className="text-brand-mid mt-2 text-sm">{list.length} premium paints available</p>
          </div>
          {cart.length > 0 && (
            <div className="flex items-center gap-2 bg-brand-accent text-brand-black px-5 py-2.5 rounded-lg font-semibold text-sm">
              <ShoppingCart size={15} />
              {cart.length} item{cart.length > 1 ? "s" : ""} in cart
            </div>
          )}
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[60px] z-20 bg-brand-black/96 backdrop-blur-md border-b border-brand-border/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-brand-raised border border-brand-border rounded-lg px-3.5 py-2.5 w-full sm:w-64">
            <Search size={13} className="text-brand-subtle flex-shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search paints..."
              className="bg-transparent text-white text-sm placeholder-brand-subtle outline-none flex-1 min-w-0" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  cat === c
                    ? "bg-brand-accent text-brand-black"
                    : "bg-brand-raised border border-brand-border text-brand-mid hover:text-white hover:border-brand-border-lt"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader size={28} className="animate-spin text-brand-accent" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={44} className="text-brand-border mx-auto mb-3" />
              <p className="text-brand-mid text-sm">No products found</p>
            </div>
          ) : (
            <>
              <p className="text-brand-subtle text-xs mb-6 uppercase tracking-wider">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((p) => {
                  const isAlreadyInCart = cart.includes(p._id);
                  const isCurrentlyAdding = mutation.isPending && mutation.variables?.productId === p._id;

                  return (
                    <div key={p._id}
                      className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden
                        hover:border-brand-accent/30 transition-all duration-300 group flex flex-col">
                      
                      {/* Swatch Background / Or optional handling for product images */}
                      <div className="h-28 relative" style={{ backgroundColor: p.colourCode }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: p.colourCode }} />
                          <span className="text-white text-[10px] font-semibold drop-shadow">
                            {p.colourName || "No Name Color"}
                          </span>
                        </div>
                        <span className="absolute top-2.5 right-2.5 bg-black/50 text-white/80
                          text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {p.productCategory}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-white font-semibold text-sm leading-snug
                            group-hover:text-brand-accent transition-colors">
                            {p.productName}
                          </h3>
                          <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">
                            {p.productDescription}
                          </p>
                          <h3 className="text-brand-subtle text-xs font-mono">
                            {p.colourCode}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-brand-accent font-bold text-lg font-display">
                            {formatCurrency(p.price)}
                          </span>
                          {/* <span className={`text-xs font-medium ${p.stockQuantity > 50 ? "text-emerald-400" : p.stockQuantity > 10 ? "text-yellow-400" : "text-red-400"}`}>
                            {p.stockQuantity} left
                          </span> */}
                        </div>

                        <p className="text-brand-subtle text-xs">Coverage: {p.coverageInformation}</p>

                        <div className="flex flex-wrap gap-1">
                          {p.productFeatures?.slice(0, 3).map((f) => (
                            <span key={f} className="bg-brand-accent-muted border border-brand-accent/15
                              text-brand-accent text-[10px] px-2 py-0.5 rounded-full">
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
                          className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-lg
                            text-sm font-semibold transition-all duration-200 ${
                            isAlreadyInCart
                              ? "bg-emerald-950/50 border border-emerald-800/50 text-emerald-400"
                              : "bg-brand-accent text-brand-black hover:bg-brand-accent-lt disabled:opacity-75"
                          }`}
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

                        {/* Button 2: View Info & Q&A (New Addition) */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInfoProduct(p);
                            setOpenAccordionIndex(null); // Reset accordion tracking state on opening new details
                          }}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold 
                            bg-brand-raised border border-brand-border text-brand-mid hover:text-white 
                            hover:border-brand-border-lt transition-all duration-200"
                        >
                          <HelpCircle size={13} />
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

      {/* Dynamic Accordion Info Modal Popup */}
      {activeInfoProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
              <div>
                <span className="text-brand-accent text-[10px] font-bold tracking-widest uppercase block mb-0.5">
                  Product Specifications & FAQ
                </span>
                <h2 className="text-white font-bold text-lg leading-tight">
                  {activeInfoProduct.productName}
                </h2>
              </div>
              <button 
                onClick={() => setActiveInfoProduct(null)} 
                className="p-1.5 rounded-lg text-brand-subtle hover:text-white hover:bg-brand-raised transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              
              {/* Quick Details Block */}
              <div className="grid grid-cols-2 gap-3 text-xs border border-brand-border/40 bg-brand-raised/20 p-3 rounded-xl">
                <div>
                  <p className="text-brand-subtle mb-0.5">Category</p>
                  <p className="text-white font-medium">{activeInfoProduct.productCategory}</p>
                </div>
                <div>
                  <p className="text-brand-subtle mb-0.5">Coverage</p>
                  <p className="text-white font-medium">{activeInfoProduct.coverageInformation || 'N/A'}</p>
                </div>
              </div>

              {/* Accordion List for Questions & Answers */}
              <div>
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
                  Frequently Asked Questions
                </h4>
                
                {!activeInfoProduct.questions || activeInfoProduct.questions.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-brand-border/40 rounded-xl">
                    <HelpCircle size={24} className="text-brand-subtle mx-auto mb-2 opacity-60" />
                    <p className="text-brand-mid text-xs">No questions found for this paint variant.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeInfoProduct.questions.map((item, index) => {
                      const isOpen = openAccordionIndex === index;
                      return (
                        <div 
                          key={index} 
                          className="border border-brand-border rounded-xl overflow-hidden bg-brand-raised/30"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenAccordionIndex(isOpen ? null : index)}
                            className="w-full text-left p-4 flex items-center justify-between text-white hover:bg-brand-raised/60 transition-colors gap-3"
                          >
                            <span className="text-xs font-semibold leading-relaxed">
                              {item.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp size={14} className="text-brand-accent flex-shrink-0" />
                            ) : (
                              <ChevronDown size={14} className="text-brand-subtle flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 border-t border-brand-border/20 text-brand-mid text-xs leading-relaxed bg-brand-card/40">
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
            <div className="p-4 bg-brand-raised/30 border-t border-brand-border/40 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInfoProduct(null)}
                className="px-4 py-2 bg-brand-accent text-brand-black font-semibold rounded-lg text-xs hover:bg-brand-accent-lt transition-colors"
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