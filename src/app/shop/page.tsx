


"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetProducts, apiAddToCart } from "@/lib/userApi";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  ShoppingCart, Search, Loader, Package, CheckCircle, HelpCircle,
  ChevronDown, ChevronUp, X, Palette,
} from "lucide-react";
import LoadingSkeleton from "../dashboard/components/Loading";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const COLORS = {
  bg: "#F8F5F0",
  primaryText: "#1F1F1F",
  secondaryText: "#7A7A7A",
  accent: "#C59A46",
};

interface QA { question: string; answer: string }

interface Variant {
  _id: string;
  colourName: string;
  colourCode: string;
  image?: { url: string; publicId?: string };
}

interface Product {
  _id: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  price: number;
  coverageInformation: string;
  productFeatures: string[];
  status: string;
  questions?: QA[];
  productImages?: string[];   // productImages[0] = bucket image
  variants: Variant[];
}

export default function ShopPage() {
  const [cat, setCat]       = useState("All");
  const [search, setSearch] = useState("");
  const router              = useRouter();

  // Track added items: productId → selectedVariantId
  const [addedItems, setAddedItems] = useState<Record<string, string>>({});

  // Lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
// Colour picker modal
const [colourPickerProduct, setColourPickerProduct] = useState<Product | null>(null);
const [pickerSelectedVariant, setPickerSelectedVariant] = useState<string>("");
console.log('picker', colourPickerProduct)
// Open picker
const openColourPicker = (product: Product) => {
  setColourPickerProduct(product);

  const defaultVariant =
    selectedVariants[product._id] ??
    product.variants?.[0]?._id ??
    "";

  setPickerSelectedVariant(defaultVariant);
};

// Close picker
const closeColourPicker = () => {
  setColourPickerProduct(null);
  setPickerSelectedVariant("");
};
  // Info modal
  const [activeInfoProduct, setActiveInfoProduct] = useState<Product | null>(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

  // Colour picker per card: productId → selectedVariantId
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["shop-products"],
    queryFn: async () => {
      try {
        const res = await apiGetProducts();
        console.log('res', res)
        return res?.products ?? res?.data ?? [];
      } catch { return []; }
    },
  });

  const category = data ? Array.from(new Set(data.map((p) => p.productCategory))).filter(Boolean) : [];
  const CATS = ["All", ...category];

  const list     = (data || []).filter((p) => p.status === "active");
  const filtered = list
    .filter((p) => cat === "All" || p.productCategory === cat)
    .filter((p) => !search || p.productName.toLowerCase().includes(search.toLowerCase()));

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ productId, quantity, selectedColour }: {
      productId: string; quantity: number; selectedColour: string;
    }) => {
      const res = await apiAddToCart({ productId, quantity, selectedColour });
      return { res, productId, selectedColour };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["cart-product"] });
      // toast.success("Added to cart!");
      toast.success("Colour added to cart!");
closeColourPicker();
      setAddedItems((prev) => ({ ...prev, [data.productId]: data.selectedColour }));
    },
    onError: (err: Error) => {
      if (err.message?.includes("Access denied")) {
        toast.error("Please log in to add to cart");
        router.push("/login");
      } else {
        toast.error(err.message || "Failed to add to cart");
        closeColourPicker();
      }
    },
  });

  // const handleAddToCart = (p: Product) => {
  //   const variantId = selectedVariants[p._id] ?? p.variants?.[0]?._id;
  //   if (!variantId) { toast.error("Please select a colour"); return; }
  //   if (addedItems[p._id] === variantId) { toast.error("Already in cart!"); return; }
  //   mutation.mutate({ productId: p._id, quantity: 1, selectedColour: variantId });
  // };
  const [quantity, setQuantity] = useState<number>(1);
  const handleAddToCart = () => {
  if (!colourPickerProduct) return;

  if (!pickerSelectedVariant) {
    toast.error("Please select a colour");
    return;
  }

  if (addedItems[colourPickerProduct._id] === pickerSelectedVariant) {
    toast.error("Already in cart!");
    return;
  }

  setSelectedVariants((prev) => ({
    ...prev,
    [colourPickerProduct._id]: pickerSelectedVariant,
  }));

  mutation.mutate({
    productId: colourPickerProduct._id,
    quantity: quantity, // <-- Passes the user selected quantity
    selectedColour: pickerSelectedVariant,
  });

  closeColourPicker();
};
//   const handleAddToCart = () => {
//   if (!colourPickerProduct) return;

//   if (!pickerSelectedVariant) {
//     toast.error("Please select a colour");
//     return;
//   }

//   if (
//     addedItems[colourPickerProduct._id] === pickerSelectedVariant
//   ) {
//     toast.error("Already in cart!");
//     return;
//   }

//   setSelectedVariants((prev) => ({
//     ...prev,
//     [colourPickerProduct._id]: pickerSelectedVariant,
//   }));

//   mutation.mutate({
//     productId: colourPickerProduct._id,
//     quantity: 1,
//     selectedColour: pickerSelectedVariant,
//   });

//   closeColourPicker();
// };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <main className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 border-b"
        style={{ borderColor: "rgba(197,154,70,0.18)" }}>
        <div className="max-w-7xl mx-auto">
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
      </section>

      {/* Filters */}
      <div className="sticky top-[60px] z-20 backdrop-blur-md border-b py-4 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "rgba(248,245,240,0.92)", borderColor: "rgba(197,154,70,0.18)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3.5 py-2.5 w-full sm:w-64 shadow-sm"
            style={{ borderColor: "rgba(197,154,70,0.25)" }}>
            <Search size={14} style={{ color: COLORS.secondaryText }} className="flex-shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search paints..."
              className="bg-transparent text-sm placeholder:text-gray-400 outline-none flex-1"
              style={{ color: COLORS.primaryText }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-sm"
                style={{
                  backgroundColor: cat === c ? COLORS.accent : "#FFFFFF",
                  color: cat === c ? "#FFFFFF" : COLORS.secondaryText,
                  border: cat === c ? `1px solid ${COLORS.accent}` : "1px solid rgba(197,154,70,0.2)",
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
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
                  const activeVariantId = selectedVariants[p._id] ?? p.variants?.[0]?._id ?? "";
                  const activeVariant   = p.variants?.find((v) => v._id === activeVariantId) ?? p.variants?.[0];
                  const isAdded         = addedItems[p._id] === activeVariantId;
                  const isAdding        = mutation.isPending && mutation.variables?.productId === p._id;
                  const bucketImage     = p.productImages?.[0];

                  return (
                    <div key={p._id}
                      className="bg-white border rounded-2xl overflow-hidden transition-all duration-300
                        group flex flex-col hover:-translate-y-1 hover:shadow-md"
                      style={{ borderColor: "rgba(197,154,70,0.2)" }}>

                      {/* Bucket image */}
                      <div className="h-40 relative flex items-center justify-center overflow-hidden bg-gray-50">
                        {bucketImage ? (
                          <Image
                            src={bucketImage}
                            alt={p.productName}
                            width={400}
                            height={400}
                            onClick={() => setSelectedImage(bucketImage)}
                            className="h-[85%] w-auto object-contain drop-shadow-md cursor-pointer
                              hover:scale-105 transition-transform duration-200 z-10 relative"
                            onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                          />
                        ) : (
                          <Package size={36} className="opacity-20" style={{ color: COLORS.secondaryText }} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute top-2.5 right-2.5 bg-black/50 text-white text-[9px]
                          font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-20">
                          {p.productCategory}
                        </span>
                      </div>

                      {/* Content */}
                     {/* Content */}
<div className="p-5 flex flex-col flex-1">

  {/* Product Name */}
  <div>
    <h3
      className="font-bold text-lg leading-tight"
      style={{ color: COLORS.primaryText }}
    >
      {p.productName}
    </h3>

    <p
      className="text-sm mt-2 line-clamp-3"
      style={{ color: COLORS.secondaryText }}
    >
      {p.productDescription}
    </p>
  </div>

  {/* Price */}
  <div className="mt-4">
    <span
      className="text-2xl font-bold"
      style={{ color: COLORS.accent }}
    >
      {formatCurrency(p.price)}
    </span>
  </div>

 

  {/* Features */}
  {p.productFeatures?.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-4">
      {p.productFeatures.slice(0, 3).map((feature) => (
        <span
          key={feature}
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: "rgba(197,154,70,.08)",
            color: COLORS.accent,
            border: "1px solid rgba(197,154,70,.25)",
          }}
        >
          {feature}
        </span>
      ))}
    </div>
  )}

  <div className="mt-auto  flex flex-col gap-3 pt-5">

    <button
      onClick={() => openColourPicker(p)}
      className="w-full rounded-xl py-3.5 font-semibold transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: COLORS.accent,
        color: "#fff",
      }}
    >
      🎨 Choose Colour
    </button>

    {((p.questions?.length ?? 0) > 0 || p.coverageInformation) && (
                          <button type="button"
                            onClick={() => { setActiveInfoProduct(p); setOpenAccordionIndex(null); }}
                            className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs
                              font-semibold bg-white border transition-all hover:bg-amber-50/40"
                            style={{ borderColor: "rgba(197,154,70,0.3)", color: COLORS.primaryText }}>
                            <HelpCircle size={13} style={{ color: COLORS.accent }} />
                            See Info &amp; FAQs
                          </button>
                        )}

  </div>

</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out">
          <div onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-2">
            <button onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white border text-gray-800 p-2.5 rounded-full
                hover:bg-gray-100 transition-colors shadow-lg"
              style={{ borderColor: "rgba(197,154,70,0.3)" }}>
              <X size={20} />
            </button>
            <Image src={selectedImage} alt="Expanded" width={1600} height={1600}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white p-2" />
          </div>
        </div>
      )}

      {/* Info & Q&A Modal */}
      {activeInfoProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[85vh]"
            style={{ borderColor: "rgba(197,154,70,0.3)" }}>

            <div className="p-5 border-b flex justify-between items-center"
              style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197,154,70,0.2)" }}>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5" style={{ color: COLORS.accent }}>
                  Product Info &amp; FAQ
                </span>
                <h2 className="font-bold text-lg leading-tight" style={{ color: COLORS.primaryText }}>
                  {activeInfoProduct.productName}
                </h2>
              </div>
              <button onClick={() => setActiveInfoProduct(null)}
                className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: COLORS.secondaryText }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border p-3.5 rounded-xl"
                style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197,154,70,0.2)" }}>
                <div>
                  <p className="mb-0.5 font-medium" style={{ color: COLORS.secondaryText }}>Category</p>
                  <p className="font-semibold" style={{ color: COLORS.primaryText }}>{activeInfoProduct.productCategory}</p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium" style={{ color: COLORS.secondaryText }}>Coverage</p>
                  <p className="font-semibold" style={{ color: COLORS.primaryText }}>
                    {activeInfoProduct.coverageInformation || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium" style={{ color: COLORS.secondaryText }}>Available Colours</p>
                  <p className="font-semibold" style={{ color: COLORS.primaryText }}>
                    {activeInfoProduct.variants?.length ?? 0} variant{activeInfoProduct.variants?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Variants list in modal */}
              {activeInfoProduct.variants?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: COLORS.primaryText }}>
                    Colour Options
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeInfoProduct.variants.map((v) => (
                      <div key={v._id}
                        className="flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-white text-xs"
                        style={{ borderColor: "rgba(197,154,70,0.2)" }}>
                        {v.image?.url ? (
                          <img src={v.image.url} alt={v.colourName}
                            className="w-5 h-5 rounded-full object-cover flex-shrink-0 border"
                            style={{ borderColor: "rgba(197,154,70,0.3)" }} />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                        )}
                        <span style={{ color: COLORS.primaryText }}>{v.colourName}</span>
                        <span className="font-mono opacity-60" style={{ color: COLORS.secondaryText }}>
                          {v.colourCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ accordion */}
              {activeInfoProduct.questions && activeInfoProduct.questions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.primaryText }}>
                    Frequently Asked Questions
                  </h4>
                  <div className="space-y-2">
                    {activeInfoProduct.questions.map((item, index) => {
                      const isOpen = openAccordionIndex === index;
                      return (
                        <div key={index} className="border rounded-xl overflow-hidden bg-white"
                          style={{ borderColor: "rgba(197,154,70,0.2)" }}>
                          <button type="button"
                            onClick={() => setOpenAccordionIndex(isOpen ? null : index)}
                            className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-amber-50/30 transition-colors">
                            <span className="text-xs font-semibold leading-relaxed"
                              style={{ color: isOpen ? COLORS.accent : COLORS.primaryText }}>
                              {item.question}
                            </span>
                            {isOpen
                              ? <ChevronUp size={14} style={{ color: COLORS.accent }} className="flex-shrink-0" />
                              : <ChevronDown size={14} style={{ color: COLORS.secondaryText }} className="flex-shrink-0" />}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 border-t text-xs leading-relaxed"
                              style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197,154,70,0.15)", color: COLORS.secondaryText }}>
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end"
              style={{ backgroundColor: COLORS.bg, borderColor: "rgba(197,154,70,0.2)" }}>
              <button type="button" onClick={() => setActiveInfoProduct(null)}
                className="px-4 py-2 text-white font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity shadow-sm"
                style={{ backgroundColor: COLORS.accent }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
{/* ================= COLOUR PICKER MODAL ================= */}

{colourPickerProduct && (
  // <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

  //   <div
  //     className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-y-scroll"
  //   >

  //     {/* Header */}

  //     <div
  //       className="flex items-center justify-between p-6 border-b"
  //       style={{
  //         borderColor: "rgba(197,154,70,.2)",
  //       }}
  //     >
  //       <div>

  //         <p
  //           className="uppercase text-xs tracking-[.3em]"
  //           style={{
  //             color: COLORS.accent,
  //           }}
  //         >
  //           Choose Colour
  //         </p>

  //         <h2
  //           className="font-bold text-2xl mt-2"
  //           style={{
  //             color: COLORS.primaryText,
  //           }}
  //         >
  //           {colourPickerProduct.productName}
  //         </h2>
  //         <p>features</p>
  //         {colourPickerProduct.productFeatures?.length > 0 && (
  //   <div className="flex flex-wrap gap-2 mt-4">
  //     {colourPickerProduct.productFeatures.map((feature) => (
  //       <span
  //         key={feature}
  //         className="px-3 py-1 rounded-full text-xs font-medium"
  //         style={{
  //           background: "rgba(197,154,70,.08)",
  //           color: COLORS.accent,
  //           border: "1px solid rgba(197,154,70,.25)",
  //         }}
  //       >
  //         {feature}
  //       </span>
  //     ))}
  //   </div>
  // )}

  //       </div>

  //       <button
  //         onClick={closeColourPicker}
  //         className="p-3 rounded-xl hover:bg-gray-100"
  //       >
  //         <X size={22} />
  //       </button>
  //     </div>

  //     {/* Body */}

  //     <div className="p-8">

  //       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

  //         {colourPickerProduct.variants.map((variant) => {

  //           const selected =
  //             pickerSelectedVariant === variant._id;

  //           return (

  //             <button
  //               key={variant._id}
  //               type="button"
  //               onClick={() =>
  //                 setPickerSelectedVariant(variant._id)
  //               }
  //               className={`rounded-2xl border transition-all duration-200 p-3 ${
  //                 selected
  //                   ? "scale-105 shadow-xl"
  //                   : "hover:shadow-lg"
  //               }`}
  //               style={{
  //                 borderColor: selected
  //                   ? COLORS.accent
  //                   : "#ddd",
  //                 borderWidth: selected ? 3 : 1,
  //               }}
  //             >

  //               <div className="relative">

  //                 {variant.image?.url ? (

  //                   <img
  //                     src={variant.image.url}
  //                     alt={variant.colourName}
  //                     className="w-full h-32 object-cover rounded-xl"
  //                   />

  //                 ) : (

  //                   <div className="w-full h-32 rounded-xl bg-gray-200" />

  //                 )}

  //                 {selected && (

  //                   <div className="absolute top-2 right-2">

  //                     <div
  //                       className="w-8 h-8 rounded-full flex items-center justify-center text-white"
  //                       style={{
  //                         background: COLORS.accent,
  //                       }}
  //                     >
  //                       ✓
  //                     </div>

  //                   </div>

  //                 )}

  //               </div>

  //               <h3
  //                 className="mt-4 font-semibold"
  //                 style={{
  //                   color: COLORS.primaryText,
  //                 }}
  //               >
  //                 {variant.colourName}
  //               </h3>

  //               <p
  //                 className="text-xs mt-1"
  //                 style={{
  //                   color: COLORS.secondaryText,
  //                 }}
  //               >
  //                 {variant.colourCode}
  //               </p>

  //             </button>

  //           );

  //         })}

  //       </div>

  //     </div>

  //     {/* Footer */}

  //     <div
  //       className="border-t  p-6 flex gap-4"
  //       style={{
  //         borderColor: "rgba(197,154,70,.2)",
  //       }}
  //     >

  //       <button
  //         onClick={closeColourPicker}
  //         className="flex-1 py-4 bg-red-500 text-white rounded-xl border font-semibold"
  //       >
  //         Cancel
  //       </button>

  //       <button
  //         onClick={handleAddToCart}
  //         disabled={!pickerSelectedVariant}
  //         className="flex-1 py-4 rounded-xl font-bold text-white disabled:opacity-50"
  //         style={{
  //           background: COLORS.accent,
  //         }}
  //       >
  //         <ShoppingCart
  //           size={18}
  //           className="inline mr-2"
  //         />
  //         Add To Cart
  //       </button>

  //     </div>

  //   </div>

  // </div>
  // <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
  //   <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
      
  //     {/* Header (Fixed at top) */}
  //     <div
  //       className="flex items-center justify-between p-6 border-b shrink-0"
  //       style={{ borderColor: "rgba(197,154,70,.2)" }}
  //     >
  //       <div>
  //         <p
  //           className="uppercase text-xs tracking-[.3em]"
  //           style={{ color: COLORS.accent }}
  //         >
  //           Choose Colour
  //         </p>

  //         <h2
  //           className="font-bold text-2xl mt-2"
  //           style={{ color: COLORS.primaryText }}
  //         >
  //           {colourPickerProduct.productName}
  //         </h2>
          
  //         {colourPickerProduct.productFeatures?.length > 0 && (
  //           <div className="flex flex-wrap gap-2 mt-4">
  //             {colourPickerProduct.productFeatures.map((feature) => (
  //               <span
  //                 key={feature}
  //                 className="px-3 py-1 rounded-full text-xs font-medium"
  //                 style={{
  //                   background: "rgba(197,154,70,.08)",
  //                   color: COLORS.accent,
  //                   border: "1px solid rgba(197,154,70,.25)",
  //                 }}
  //               >
  //                 {feature}
  //               </span>
  //             ))}
  //           </div>
  //         )}
  //       </div>

  //       <button
  //         onClick={closeColourPicker}
  //         className="p-3 rounded-xl hover:bg-gray-100"
  //       >
  //         <X size={22} />
  //       </button>
  //     </div>

  //     {/* Body (Scrolls internally when content overflows max height) */}
  //     <div className="p-8 overflow-y-auto flex-1">
        
  //       {/* Quantity Controls Section */}
  //       <div className="mb-6 p-4 rounded-2xl border bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: "rgba(197,154,70,.2)" }}>
  //         <div>
  //           <label className="text-sm font-semibold block" style={{ color: COLORS.primaryText }}>
  //             Amount of Bucket(s)
  //           </label>
  //           <p className="text-xs" style={{ color: COLORS.secondaryText }}>
  //             Select quantity of buckets required
  //           </p>
  //         </div>

  //         <div className="flex items-center gap-3">
  //           <button
  //             type="button"
  //             onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
  //             className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-white text-lg hover:bg-gray-100 transition-colors shadow-sm"
  //             style={{ borderColor: "rgba(197,154,70,.3)", color: COLORS.primaryText }}
  //           >
  //             -
  //           </button>
  //           <input
  //             type="number"
  //             min="1"
  //             value={quantity}
  //             onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
  //             className="w-16 h-10 text-center font-bold text-lg rounded-xl border bg-white focus:outline-none focus:ring-2 shadow-sm"
  //             style={{ borderColor: "rgba(197,154,70,.3)", color: COLORS.primaryText }}
  //           />
  //           <button
  //             type="button"
  //             onClick={() => setQuantity((prev) => prev + 1)}
  //             className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-white text-lg hover:bg-gray-100 transition-colors shadow-sm"
  //             style={{ borderColor: "rgba(197,154,70,.3)", color: COLORS.primaryText }}
  //           >
  //             +
  //           </button>
  //         </div>
  //       </div>

  //       {/* Colour Selection Grid */}
  //       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  //         {colourPickerProduct.variants.map((variant) => {
  //           const selected = pickerSelectedVariant === variant._id;

  //           return (
  //             <button
  //               key={variant._id}
  //               type="button"
  //               onClick={() => setPickerSelectedVariant(variant._id)}
  //               className={`rounded-2xl border transition-all duration-200 p-3 text-left ${
  //                 selected ? "scale-105 shadow-xl" : "hover:shadow-lg"
  //               }`}
  //               style={{
  //                 borderColor: selected ? COLORS.accent : "#ddd",
  //                 borderWidth: selected ? 3 : 1,
  //               }}
  //             >
  //               <div className="relative">
  //                 {variant.image?.url ? (
  //                   <img
  //                     src={variant.image.url}
  //                     alt={variant.colourName}
  //                     className="w-full h-32 object-cover rounded-xl"
  //                   />
  //                 ) : (
  //                   <div className="w-full h-32 rounded-xl bg-gray-200" />
  //                 )}

  //                 {selected && (
  //                   <div className="absolute top-2 right-2">
  //                     <div
  //                       className="w-8 h-8 rounded-full flex items-center justify-center text-white"
  //                       style={{ background: COLORS.accent }}
  //                     >
  //                       ✓
  //                     </div>
  //                   </div>
  //                 )}
  //               </div>

  //               <h3
  //                 className="mt-4 font-semibold"
  //                 style={{ color: COLORS.primaryText }}
  //               >
  //                 {variant.colourName}
  //               </h3>

  //               <p
  //                 className="text-xs mt-1"
  //                 style={{ color: COLORS.secondaryText }}
  //               >
  //                 {variant.colourCode}
  //               </p>
  //             </button>
  //           );
  //         })}
  //       </div>
  //     </div>

  //     {/* Footer (Fixed at bottom) */}
  //     <div
  //       className="border-t p-6 flex gap-4 shrink-0"
  //       style={{ borderColor: "rgba(197,154,70,.2)" }}
  //     >
  //       <button
  //         onClick={closeColourPicker}
  //         className="flex-1 py-4 bg-red-500 text-white rounded-xl border font-semibold hover:bg-red-600 transition-colors"
  //       >
  //         Cancel
  //       </button>

  //       <button
  //         onClick={handleAddToCart}
  //         disabled={!pickerSelectedVariant}
  //         className="flex-1 py-4 rounded-xl font-bold text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
  //         style={{ background: COLORS.accent }}
  //       >
  //         <ShoppingCart size={18} className="inline mr-2" />
  //         Add {quantity} Bucket{quantity > 1 ? "s" : ""} To Cart
  //       </button>
  //     </div>

  //   </div>
  // </div>

  <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
  {/* The whole modal is constrained to 90vh max height and scrolls as a single unit */}
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
    
    {/* Header */}
    <div
      className="flex items-center justify-between p-6 border-b"
      style={{ borderColor: "rgba(197,154,70,.2)" }}
    >
      <div>
        <p
          className="uppercase text-xs tracking-[.3em]"
          style={{ color: COLORS.accent }}
        >
          Choose Colour
        </p>

        <h2
          className="font-bold text-2xl mt-2"
          style={{ color: COLORS.primaryText }}
        >
          {colourPickerProduct.productName}
        </h2>
        
        {colourPickerProduct.productFeatures?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {colourPickerProduct.productFeatures.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(197,154,70,.08)",
                  color: COLORS.accent,
                  border: "1px solid rgba(197,154,70,.25)",
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={closeColourPicker}
        className="p-3 rounded-xl hover:bg-gray-100"
      >
        <X size={22} />
      </button>
    </div>

    {/* Body */}
    <div className="p-8">
      
      {/* Amount of Bucket(s) Section */}
      <div 
        className="mb-6 p-4 rounded-2xl border bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" 
        style={{ borderColor: "rgba(197,154,70,.2)" }}
      >
        <div>
          <label className="text-sm font-semibold block" style={{ color: COLORS.primaryText }}>
            Amount of Bucket(s)
          </label>
          <p className="text-xs" style={{ color: COLORS.secondaryText }}>
            Select quantity of buckets required
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-white text-lg hover:bg-gray-100 transition-colors shadow-sm"
            style={{ borderColor: "rgba(197,154,70,.3)", color: COLORS.primaryText }}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-10 text-center font-bold text-lg rounded-xl border bg-white focus:outline-none focus:ring-2 shadow-sm"
            style={{ borderColor: "rgba(197,154,70,.3)", color: COLORS.primaryText }}
          />
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold bg-white text-lg hover:bg-gray-100 transition-colors shadow-sm"
            style={{ borderColor: "rgba(197,154,70,.3)", color: COLORS.primaryText }}
          >
            +
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {colourPickerProduct.variants.map((variant) => {
          const selected = pickerSelectedVariant === variant._id;

          return (
            <button
              key={variant._id}
              type="button"
              onClick={() => setPickerSelectedVariant(variant._id)}
              className={`rounded-2xl border transition-all duration-200 p-3 text-left ${
                selected ? "scale-105 shadow-xl" : "hover:shadow-lg"
              }`}
              style={{
                borderColor: selected ? COLORS.accent : "#ddd",
                borderWidth: selected ? 3 : 1,
              }}
            >
              <div className="relative">
                {variant.image?.url ? (
                  <img
                    src={variant.image.url}
                    alt={variant.colourName}
                    className="w-full h-14 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-32 rounded-xl bg-gray-200" />
                )}

                {selected && (
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ background: COLORS.accent }}
                    >
                      ✓
                    </div>
                  </div>
                )}
              </div>

              <h3
                className="mt-4 font-semibold"
                style={{ color: COLORS.primaryText }}
              >
                {variant.colourName}
              </h3>

              <p
                className="text-xs mt-1"
                style={{ color: COLORS.secondaryText }}
              >
                {variant.colourCode}
              </p>
            </button>
          );
        })}
      </div>
    </div>

    {/* Footer */}
    <div
      className="border-t p-6 flex flex-col  gap-4 md:flex-row"
      style={{ borderColor: "rgba(197,154,70,.2)" }}
    >
      <button
        onClick={closeColourPicker}
        className="flex-1 py-4 bg-red-500 text-white rounded-xl border font-semibold hover:bg-red-600 transition-colors"
      >
        Cancel
      </button>

      <button
        onClick={handleAddToCart}
        disabled={!pickerSelectedVariant}
        className="flex-1 py-4 rounded-xl font-bold text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: COLORS.accent }}
      >
        <ShoppingCart size={18} className="inline mr-2" />
        Add {quantity} Bucket{quantity > 1 ? "s" : ""} To Cart
      </button>
    </div>

  </div>
</div>
)}
      <Footer />
    </main>
  );
}