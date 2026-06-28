// "use client";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "@/lib/adminApi";
// import { formatCurrency } from "@/lib/utils";
// import { Plus, Pencil, Trash2, X, Loader, Package, Search } from "lucide-react";
// import LoadingSkeleton from "../components/Loading";

// interface Product {
//   _id: string; productName: string; productCategory: string; productDescription: string;
//   productImages: string[]; colourCode: string; colourName: string; price: number;
//   stockQuantity: number; coverageInformation: string; productFeatures: string[];
//   status: "active" | "inactive";
// }

// const CATS = ["Interior","Exterior","Primer/Undercoat","Textured","Waterproof","Anti-Rust","Floor Coating"];



// const EMPTY_FORM = { productName:"", productCategory:"", productDescription:"", colourCode:"#C9A84C", colourName:"", price:0, stockQuantity:0, coverageInformation:"", productFeatures:"", status:"active" as "active"|"inactive" };

// function ProductFormModal({ product, onClose }: { product?: Product; onClose: () => void }) {
//   const qc = useQueryClient();
//   const isEdit = !!product;
//   const [form, setForm] = useState(product ? {
//     productName: product.productName, productCategory: product.productCategory,
//     productDescription: product.productDescription, colourCode: product.colourCode,
//     colourName: product.colourName, price: product.price, stockQuantity: product.stockQuantity,
//     coverageInformation: product.coverageInformation, productFeatures: product.productFeatures.join(", "),
//     status: product.status,
//   } : EMPTY_FORM);

//   const mutation = useMutation({
//     mutationFn: async () => {
//       const body = { ...form, productImages: [], productFeatures: form.productFeatures.split(",").map((f) => f.trim()).filter(Boolean), price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
//       return isEdit ? adminUpdateProduct(product!._id, body) : adminCreateProduct(body as Parameters<typeof adminCreateProduct>[0]);
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["products"] });
//       toast.success(isEdit ? "Product updated" : "Product created");
//       onClose();
//     },
//     onError: (err: Error) => toast.error(err.message || "Operation failed"),
//   });

//   const field = (name: keyof typeof form, label: string, type = "text", placeholder = "") => (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
//       <input name={name} type={type} value={form[name] as string} placeholder={placeholder}
//         onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
//         className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
//           <h3 className="font-display text-lg font-bold text-brand-white">{isEdit ? "Edit Product" : "Add New Product"}</h3>
//           <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"><X size={18} /></button>
//         </div>
//         <div className="p-5">
//           <div className="grid sm:grid-cols-2 gap-4">
//             {field("productName", "Product Name", "text", "e.g. Premium Emulsion")}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-brand-lt-gray text-xs font-medium">Category</label>
//               <select value={form.productCategory} onChange={(e) => setForm((p) => ({ ...p, productCategory: e.target.value }))}
//                 className="bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent">
//                 <option value="">Select category</option>
//                 {CATS.map((c) => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//             {field("colourName", "Colour Name", "text", "e.g. Cream White")}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-brand-lt-gray text-xs font-medium">Colour Code</label>
//               <div className="flex gap-2">
//                 <input type="color" value={form.colourCode} onChange={(e) => setForm((p) => ({ ...p, colourCode: e.target.value }))}
//                   className="w-10 h-9 rounded border border-brand-mid bg-brand-black cursor-pointer" />
//                 <input type="text" value={form.colourCode} onChange={(e) => setForm((p) => ({ ...p, colourCode: e.target.value }))}
//                   className="flex-1 bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
//               </div>
//               <input type="color" name="" id="" />
//             </div>
//             {field("price", "Price (₦)", "number", "0")}
//             {field("stockQuantity", "Stock Quantity", "number", "0")}
//             {field("coverageInformation", "Coverage Info", "text", "e.g. 12–14 m² per litre")}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-brand-lt-gray text-xs font-medium">Status</label>
//               <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "active"|"inactive" }))}
//                 className="bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent">
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//           <div className="mt-4 flex flex-col gap-1.5">
//             <label className="text-brand-lt-gray text-xs font-medium">Description</label>
//             <textarea value={form.productDescription} rows={3} onChange={(e) => setForm((p) => ({ ...p, productDescription: e.target.value }))} placeholder="Product description..."
//               className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent resize-none" />
//           </div>
//           <div className="mt-4 flex flex-col gap-1.5">
//             <label className="text-brand-lt-gray text-xs font-medium">Features (comma-separated)</label>
//             <input value={form.productFeatures} onChange={(e) => setForm((p) => ({ ...p, productFeatures: e.target.value }))} placeholder="Washable, Low VOC, Fast Dry"
//               className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
//           </div>
//           <div className="flex gap-3 mt-6">
//             <button onClick={onClose} className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm hover:border-brand-white hover:text-brand-white transition-colors">Cancel</button>
//             <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
//               className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50">
//               {mutation.isPending ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
//               {mutation.isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ProductsPage() {
//   const qc = useQueryClient();
//   const [showForm, setShowForm] = useState(false);
//   const [editProduct, setEditProduct] = useState<Product | undefined>();
//   const [search, setSearch] = useState("");
//   const [catFilter, setCatFilter] = useState("all");

//   const { data, isLoading } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       try {
//         const res = await adminGetProducts();
//         return (res?.products ?? res?.data ?? []) as Product[];
//       } catch { return []; }
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => adminDeleteProduct(id),
//     onSuccess: (_, id) => {
//       qc.setQueryData(["products"], (old: Product[] = []) => old.filter((p) => p._id !== id));
//       toast.success("Product deleted");
//     },
//     onError: (err: Error) => toast.error(err.message || "Delete failed"),
//   });

//   const list = data ?? [];
//   const cats = ["all", ...Array.from(new Set(list.map((p) => p.productCategory)))];
//   const filtered = list
//     .filter((p) => catFilter === "all" || p.productCategory === catFilter)
//     .filter((p) => !search || p.productName.toLowerCase().includes(search.toLowerCase()));

//     if (isLoading) return <LoadingSkeleton />;
//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-brand-white">Products</h1>
//           <p className="text-brand-mid text-sm mt-1">Manage your paint product catalogue</p>
//         </div>
//         <button onClick={() => { setEditProduct(undefined); setShowForm(true); }}
//           className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm">
//           <Plus size={16} /> Add Product
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 flex-1 max-w-sm">
//           <Search size={14} className="text-brand-mid" />
//           <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
//             className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" />
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {cats.map((c) => (
//             <button key={c} onClick={() => setCatFilter(c)}
//               className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${catFilter === c ? "bg-brand-accent text-brand-black" : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-brand-white"}`}>
//               {c}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Grid */}
//       {isLoading ? (
//         <div className="py-16 flex justify-center"><Loader size={28} className="animate-spin text-brand-accent" /></div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filtered.map((p) => (
//             <div key={p._id} className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden hover:border-brand-accent/30 transition-all group">
//               {/* Colour swatch */}
//               <div className="h-24 relative" style={{ backgroundColor: p.colourCode }}>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//                 <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === "active" ? "bg-green-700 text-green-100" : "bg-gray-700 text-gray-300"}`}>{p.status}</span>
//               </div>
//               <div className="p-4 flex flex-col gap-3">
//                 <div>
//                   <h3 className="text-brand-white font-semibold text-sm leading-snug">{p.productName}</h3>
//                   <p className="text-brand-mid text-xs mt-0.5">{p.productCategory} · {p.colourName}</p>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-brand-accent font-bold">{formatCurrency(p.price)}</span>
//                   <span className="text-brand-mid text-xs">{p.stockQuantity} in stock</span>
//                 </div>
//                 <p className="text-brand-mid text-xs">{p.coverageInformation}</p>
//                 {p.productFeatures.length > 0 && (
//                   <div className="flex flex-wrap gap-1">
//                     {p.productFeatures.slice(0,3).map((f) => (
//                       <span key={f} className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full">{f}</span>
//                     ))}
//                   </div>
//                 )}
//                 <div className="flex gap-2 pt-1 border-t border-brand-mid/20">
//                   <button onClick={() => { setEditProduct(p); setShowForm(true); }}
//                     className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 py-1.5 rounded-md text-xs transition-colors">
//                     <Pencil size={12} /> Edit
//                   </button>
//                   <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p._id); }}
//                     className="flex-1 flex items-center justify-center gap-1.5 text-red-500 hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors">
//                     <Trash2 size={12} /> Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {(showForm || editProduct) && (
//         <ProductFormModal product={editProduct} onClose={() => { setShowForm(false); setEditProduct(undefined); }} />
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetProducts, adminDeleteProduct } from "@/lib/adminApi";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader, Search, Upload, HelpCircle } from "lucide-react";
import LoadingSkeleton from "../components/Loading";
import endpointRoute from "@/lib/endpointRoute";

// ── Updated API functions — multipart/form-data (same pattern as tools) ────────
const adminCreateProduct = (fd: FormData) =>
  endpointRoute.post("/products", fd).then((r) => r.data);

const adminUpdateProduct = (id: string, fd: FormData) =>
  endpointRoute.put(`/products/${id}`, fd).then((r) => r.data);

// ─────────────────────────────────────────────────────────────────────────────

interface QA { question: string; answer: string }

interface Product {
  _id: string; productName: string; productCategory: string; productDescription: string;
  productImages: string[]; colourCode: string; colourName: string; hex?: string; price: number;
  stockQuantity: number; coverageInformation: string; productFeatures: string[];
  questions?: QA[]; status: "active" | "inactive";
}

const CATS = ["Interior","Exterior","Primer/Undercoat","Textured","Waterproof","Anti-Rust","Floor Coating"];

const inputCls = "w-full bg-brand-black border border-brand-mid text-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent";

// ── Product Form Modal ─────────────────────────────────────────────────────────
function ProductFormModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!product;
  const fileRef = useRef<HTMLInputElement>(null);

  // Basic fields
  const [productName, setProductName]           = useState(product?.productName ?? "");
  const [productCategory, setProductCategory]   = useState(product?.productCategory ?? "");
  const [productDescription, setProductDescription] = useState(product?.productDescription ?? "");
  const [colourName, setColourName]             = useState(product?.colourName ?? "");
  // hex is the actual hex value sent to server; colourCode is the display code (same thing here)
  const [hex, setHex]                           = useState(product?.hex ?? product?.colourCode ?? "#C9A84C");
  const [price, setPrice]                       = useState(String(product?.price ?? ""));
  const [stockQuantity, setStockQuantity]       = useState(String(product?.stockQuantity ?? ""));
  const [coverageInformation, setCoverageInformation] = useState(product?.coverageInformation ?? "");
  const [productFeatures, setProductFeatures]   = useState(product?.productFeatures.join(", ") ?? "");
  const [status, setStatus]                     = useState<"active"|"inactive">(product?.status ?? "active");

  // Images
  const [files, setFiles]       = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(product?.productImages ?? []);

  // Q&A
  const [questions, setQuestions] = useState<QA[]>(product?.questions ?? []);
  const [qaInput, setQaInput]     = useState({ question: "", answer: "" });

  const addQA = () => {
    if (!qaInput.question.trim() || !qaInput.answer.trim()) {
      toast.error("Both question and answer are required");
      return;
    }
    setQuestions((prev) => [...prev, { question: qaInput.question.trim(), answer: qaInput.answer.trim() }]);
    setQaInput({ question: "", answer: "" });
  };

  const removeQA = (idx: number) => setQuestions((prev) => prev.filter((_, i) => i !== idx));

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    if (!picked.length) return;
    setFiles((prev) => [...prev, ...picked]);
    setPreviews((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    if (previews[idx]?.startsWith("blob:")) {
      URL.revokeObjectURL(previews[idx]);
      const blobPreviews = previews.filter((p) => p.startsWith("blob:"));
      const blobIdx = blobPreviews.indexOf(previews[idx]);
      if (blobIdx !== -1) setFiles((prev) => prev.filter((_, i) => i !== blobIdx));
    }
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Mutation — multipart/form-data, same as tools
  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("productName",        productName);
      fd.append("productCategory",    productCategory);
      fd.append("productDescription", productDescription);
      fd.append("colourName",         colourName);
      fd.append("colourCode",         hex);       // colourCode = hex value
      fd.append("hex",                hex);       // also send as "hex" — backend uses this
      fd.append("price",              price);
      fd.append("stockQuantity",      stockQuantity);
      fd.append("coverageInformation",coverageInformation);
      fd.append("status",             status);
      // productFeatures — send as JSON string (matches what backend expects from screenshot)
      fd.append("productFeatures", JSON.stringify(
        productFeatures.split(",").map((f) => f.trim()).filter(Boolean)
      ));
      // questions — JSON stringified array as shown in screenshot
      if (questions.length > 0) {
        fd.append("questions", JSON.stringify(questions));
      }
      // productImages — repeated for each file (same field name repeated)
      files.forEach((file) => fd.append("productImages", file));

      return isEdit
        ? adminUpdateProduct(product!._id, fd)
        : adminCreateProduct(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEdit ? "Product updated" : "Product created");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || "Operation failed"),
  });

  const handleSubmit = () => {
    if (!productName.trim())     { toast.error("Product name is required"); return; }
    if (!productCategory)        { toast.error("Please select a category"); return; }
    if (!price || isNaN(Number(price))) { toast.error("Valid price is required"); return; }
    if (!isEdit && files.length === 0) { toast.error("Please upload at least one image"); return; }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl
        w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h3>
          <button onClick={onClose} className="text-brand-mid hover:text-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">

          {/* ── Section: Basic Info ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Product Name *</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Premium Emulsion" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Category *</label>
              <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}
                className={inputCls}>
                <option value="">Select category</option>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Price (₦) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Stock Quantity</label>
              <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Coverage Information</label>
              <input value={coverageInformation} onChange={(e) => setCoverageInformation(e.target.value)}
                placeholder="e.g. 12–14 m² per litre" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as "active"|"inactive")}
                className={inputCls}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ── Section: Colour ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Colour</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-subtle text-xs">Colour Name</label>
                <input value={colourName} onChange={(e) => setColourName(e.target.value)}
                  placeholder="e.g. Snow White" className={inputCls} />
              </div>
              {/* Hex picker + text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-subtle text-xs">
                  Hex Value{" "}
                  <span className="text-brand-mid">(sent to server as <code className="text-brand-accent text-[10px]">hex</code> & <code className="text-brand-accent text-[10px]">colourCode</code>)</span>
                </label>
                <div className="flex gap-2 items-center">
                  {/* Native color input — always returns a 6-digit lowercase hex e.g. #c9a84c */}
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="w-11 h-9 rounded border border-brand-mid bg-brand-black cursor-pointer p-0.5"
                    title="Pick a colour"
                  />
                  {/* Editable hex text — syncs with picker */}
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => {
                      const v = e.target.value;
                      setHex(v);
                    }}
                    placeholder="#C9A84C"
                    className={`${inputCls} flex-1 font-mono`}
                  />
                  {/* Live preview swatch */}
                  <div
                    className="w-9 h-9 rounded border border-brand-mid flex-shrink-0"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                </div>
                <p className="text-brand-subtle text-[11px]">
                  The browser color picker always returns a valid hex. You can also type one manually.
                </p>
              </div>
            </div>
          </div>

          {/* ── Section: Description ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Description</label>
            <textarea value={productDescription} rows={3}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Product description..."
              className={`${inputCls} resize-none`} />
          </div>

          {/* ── Section: Features ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Product Features{" "}
              <span className="text-brand-mid font-normal">(comma-separated → sent as JSON array)</span>
            </label>
            <input value={productFeatures} onChange={(e) => setProductFeatures(e.target.value)}
              placeholder="Fast Dry, Washable, Low Odour"
              className={inputCls} />
          </div>

          {/* ── Section: Images ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Product Images {!isEdit && <span className="text-red-400">*</span>}
              <span className="text-brand-mid font-normal ml-1">(field name: <code className="text-brand-accent text-[10px]">productImages</code>, repeated per file)</span>
            </label>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 border border-dashed border-brand-mid
                text-brand-mid hover:border-brand-accent hover:text-white rounded-md py-3 text-sm transition-colors">
              <Upload size={15} /> Click to upload images
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFileChange} />

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-1">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-brand-mid group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white
                        rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Section: Questions & Answers ── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <HelpCircle size={15} className="text-brand-accent" />
              <label className="text-brand-lt-gray text-xs font-medium">
                Questions &amp; Answers{" "}
                <span className="text-brand-mid font-normal">(sent as JSON string via <code className="text-brand-accent text-[10px]">questions</code> field)</span>
              </label>
            </div>

            {/* Existing Q&As */}
            {questions.length > 0 && (
              <div className="flex flex-col gap-2">
                {questions.map((qa, i) => (
                  <div key={i} className="bg-brand-raised border border-brand-mid/30 rounded-lg px-4 py-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">Q: {qa.question}</p>
                      <p className="text-brand-mid text-xs mt-0.5 truncate">A: {qa.answer}</p>
                    </div>
                    <button onClick={() => removeQA(i)}
                      className="text-brand-subtle hover:text-red-400 transition-colors flex-shrink-0 p-0.5">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new Q&A */}
            <div className="bg-brand-raised border border-brand-mid/20 rounded-lg p-4 flex flex-col gap-3">
              <p className="text-brand-subtle text-xs font-medium uppercase tracking-wider">Add a Q&amp;A</p>
              <div className="flex flex-col gap-2">
                <input
                  value={qaInput.question}
                  onChange={(e) => setQaInput((p) => ({ ...p, question: e.target.value }))}
                  placeholder="Question e.g. Can it be used outside?"
                  className={inputCls}
                />
                <input
                  value={qaInput.answer}
                  onChange={(e) => setQaInput((p) => ({ ...p, answer: e.target.value }))}
                  placeholder="Answer e.g. Yes"
                  className={inputCls}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addQA(); } }}
                />
              </div>
              <button type="button" onClick={addQA}
                className="flex items-center justify-center gap-2 border border-brand-accent/40
                  text-brand-accent hover:bg-brand-accent-muted py-2 rounded-md text-xs font-medium transition-colors">
                <Plus size={13} /> Add Question
              </button>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2 border-t border-brand-mid/20">
            <button onClick={onClose}
              className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm
                hover:border-white hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50">
              {mutation.isPending ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
              {mutation.isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm]     = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await adminGetProducts();
        return (res?.products ?? res?.data ?? []) as Product[];
      } catch { return []; }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteProduct(id),
    onSuccess: (_, id) => {
      qc.setQueryData(["products"], (old: Product[] = []) => old.filter((p) => p._id !== id));
      toast.success("Product deleted");
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  const list     = data ?? [];
  const cats     = ["all", ...Array.from(new Set(list.map((p) => p.productCategory)))];
  const filtered = list
    .filter((p) => catFilter === "all" || p.productCategory === catFilter)
    .filter((p) => !search || p.productName.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Products</h1>
          <p className="text-brand-mid text-sm mt-1">Manage your paint product catalogue</p>
        </div>
        <button onClick={() => { setEditProduct(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
            px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 flex-1 max-w-sm">
          <Search size={14} className="text-brand-mid" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="bg-transparent text-white text-sm placeholder-brand-mid outline-none flex-1" />
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors
                ${catFilter === c ? "bg-brand-accent text-brand-black" : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div key={p._id} className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden
            hover:border-brand-accent/30 transition-all group flex flex-col">
            {/* Colour swatch / first image */}
            <div className="h-24 relative overflow-hidden">
              {p.productImages?.length > 0 ? (
                <img src={p.productImages[0]} alt={p.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: p.colourCode ?? p.hex ?? "#333" }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold
                ${p.status === "active" ? "bg-green-700 text-green-100" : "bg-gray-700 text-gray-300"}`}>
                {p.status}
              </span>
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <h3 className="text-white font-semibold text-sm leading-snug">{p.productName}</h3>
                <p className="text-brand-mid text-xs mt-0.5">{p.productCategory} · {p.colourName}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-accent font-bold">{formatCurrency(p.price)}</span>
                <span className="text-brand-mid text-xs">{p.stockQuantity} in stock</span>
              </div>
              <p className="text-brand-mid text-xs">{p.coverageInformation}</p>
              {p.productFeatures?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.productFeatures.slice(0,3).map((f) => (
                    <span key={f} className="bg-brand-accent/10 border border-brand-accent/20
                      text-brand-accent text-[10px] px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {p.questions && p.questions.length > 0 && (
                <p className="text-brand-subtle text-[11px]">{p.questions.length} Q&amp;A{p.questions.length > 1 ? "s" : ""}</p>
              )}
              <div className="flex gap-2 pt-1 border-t border-brand-mid/20 mt-auto">
                <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid
                    hover:text-white hover:bg-brand-raised py-1.5 rounded-md text-xs transition-colors">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p._id); }}
                  className="flex-1 flex items-center justify-center gap-1.5 text-red-500
                    hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="py-16 text-center text-brand-mid text-sm">
          {search || catFilter !== "all" ? "No products match your filters" : "No products yet. Add your first one."}
        </div>
      )}

      {(showForm || editProduct) && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(undefined); }}
        />
      )}
    </div>
  );
}