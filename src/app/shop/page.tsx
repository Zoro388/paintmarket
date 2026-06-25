
"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetProducts , apiAddToCart} from "@/lib/userApi";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ShoppingCart, Search, Loader, Package, CheckCircle } from "lucide-react";
import LoadingSkeleton from "../dashboard/components/Loading";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Product { _id:string; productName:string; productCategory:string; productDescription:string; colourCode:string; colourName:string; price:number; stockQuantity:number; coverageInformation:string; productFeatures:string[]; status:string; }

export default function ShopPage() {
  const [cat, setCat]   = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
const router=useRouter()
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
      console.log('hello');
      const res = await apiAddToCart({ productId, quantity, selectedColour });
      console.log('res', res);
      return { res, productId }; // return productId to update local cart state on success
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cart-product"] }); // double-check if your key should be "cart" or "portfolio"!
      toast.success("Product added to cart successfully!");
      // Append item to cart array to mark it visually as added
      if (data?.productId) {
        setCart((prev) => [...prev, data.productId]);
      }
    },
    onError: (err: Error) => {
  console.error('Error adding to cart:', err);

  // ✅ Fixed: Changed .includes == "Access denied" to .includes("Access denied")
  if (err.message && err.message.includes("Access denied")) {
    // 1. Show the specific sign-up reminder toast
    toast.error("Please sign up or log in to add products to your cart");
    
    // 2. Redirect them to the login page
    router.push('/login');
  } else {
    // Fallback error message for other kinds of failures
    toast.error(err.message || "Failed to add product to cart");
  }

  console.log('err', err.message);
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
                      {/* Swatch */}
                      <div className="h-28 relative" style={{ backgroundColor: p.colourCode }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border-2 border-white/50"
                            style={{ backgroundColor: p.colourCode }} />
                          <span className="text-white text-[10px] font-semibold drop-shadow">
                            {p.colourName}
                          </span>
                        </div>
                        <span className="absolute top-2.5 right-2.5 bg-black/50 text-white/80
                          text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {p.productCategory}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <h3 className="text-white font-semibold text-sm leading-snug
                            group-hover:text-brand-accent transition-colors">
                            {p.productName}
                          </h3>
                          <p className="text-brand-mid text-xs mt-1 leading-relaxed line-clamp-2">
                            {p.productDescription}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-brand-accent font-bold text-lg font-display">
                            {formatCurrency(p.price)}
                          </span>
                          <span className={`text-xs font-medium ${p.stockQuantity > 50 ? "text-emerald-400" : p.stockQuantity > 10 ? "text-yellow-400" : "text-red-400"}`}>
                            {p.stockQuantity} left
                          </span>
                        </div>

                        <p className="text-brand-subtle text-xs">Coverage: {p.coverageInformation}</p>

                        <div className="flex flex-wrap gap-1">
                          {p.productFeatures.slice(0,3).map((f) => (
                            <span key={f} className="bg-brand-accent-muted border border-brand-accent/15
                              text-brand-accent text-[10px] px-2 py-0.5 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>

                        <button
                          disabled={isCurrentlyAdding}
                          onClick={() => {
                            if (isAlreadyInCart) {
                              toast.error("Item is already in your cart!");
                              return;
                            }
                            mutation.mutate({ productId: p._id, quantity, selectedColour: p.colourName });
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}