"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "@/lib/adminApi";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader, Package, Search } from "lucide-react";
import LoadingSkeleton from "../components/Loading";

interface Product {
  _id: string; productName: string; productCategory: string; productDescription: string;
  productImages: string[]; colourCode: string; colourName: string; price: number;
  stockQuantity: number; coverageInformation: string; productFeatures: string[];
  status: "active" | "inactive";
}

const CATS = ["Interior","Exterior","Primer/Undercoat","Textured","Waterproof","Anti-Rust","Floor Coating"];

const MOCK: Product[] = [
  { _id: "p1", productName: "Premium Interior Emulsion", productCategory: "Interior", productDescription: "High quality washable emulsion for interior walls.", productImages: [], colourCode: "#F5F0E8", colourName: "Cream White", price: 18500, stockQuantity: 240, coverageInformation: "12–14 m² per litre", productFeatures: ["Washable","Low VOC","Fast Dry"], status: "active" },
  { _id: "p2", productName: "WeatherShield Exterior Gloss", productCategory: "Exterior", productDescription: "Durable weather-resistant exterior paint.", productImages: [], colourCode: "#6B6B6B", colourName: "Mid Grey", price: 22000, stockQuantity: 180, coverageInformation: "10–12 m² per litre", productFeatures: ["UV Resistant","Waterproof","Anti-Fungal"], status: "active" },
  { _id: "p3", productName: "Luxury Matt Finish", productCategory: "Interior", productDescription: "Smooth matt finish for a sophisticated look.", productImages: [], colourCode: "#C9A84C", colourName: "Gold Sand", price: 25000, stockQuantity: 85, coverageInformation: "13–15 m² per litre", productFeatures: ["Luxury Finish","Scrubbable","Non-Reflective"], status: "active" },
  { _id: "p4", productName: "Anti-Rust Industrial Paint", productCategory: "Anti-Rust", productDescription: "Heavy duty corrosion protection for metal.", productImages: [], colourCode: "#8B0000", colourName: "Red Oxide", price: 32000, stockQuantity: 40, coverageInformation: "8–10 m² per litre", productFeatures: ["Rust Prevention","High Adhesion","Chemical Resistant"], status: "inactive" },
];

const EMPTY_FORM = { productName:"", productCategory:"", productDescription:"", colourCode:"#C9A84C", colourName:"", price:0, stockQuantity:0, coverageInformation:"", productFeatures:"", status:"active" as "active"|"inactive" };

function ProductFormModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!product;
  const [form, setForm] = useState(product ? {
    productName: product.productName, productCategory: product.productCategory,
    productDescription: product.productDescription, colourCode: product.colourCode,
    colourName: product.colourName, price: product.price, stockQuantity: product.stockQuantity,
    coverageInformation: product.coverageInformation, productFeatures: product.productFeatures.join(", "),
    status: product.status,
  } : EMPTY_FORM);

  const mutation = useMutation({
    mutationFn: async () => {
      const body = { ...form, productImages: [], productFeatures: form.productFeatures.split(",").map((f) => f.trim()).filter(Boolean), price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
      return isEdit ? adminUpdateProduct(product!._id, body) : adminCreateProduct(body as Parameters<typeof adminCreateProduct>[0]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEdit ? "Product updated" : "Product created");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || "Operation failed"),
  });

  const field = (name: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
      <input name={name} type={type} value={form[name] as string} placeholder={placeholder}
        onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
        className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-brand-white">{isEdit ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {field("productName", "Product Name", "text", "e.g. Premium Emulsion")}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Category</label>
              <select value={form.productCategory} onChange={(e) => setForm((p) => ({ ...p, productCategory: e.target.value }))}
                className="bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent">
                <option value="">Select category</option>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {field("colourName", "Colour Name", "text", "e.g. Cream White")}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Colour Code</label>
              <div className="flex gap-2">
                <input type="color" value={form.colourCode} onChange={(e) => setForm((p) => ({ ...p, colourCode: e.target.value }))}
                  className="w-10 h-9 rounded border border-brand-mid bg-brand-black cursor-pointer" />
                <input type="text" value={form.colourCode} onChange={(e) => setForm((p) => ({ ...p, colourCode: e.target.value }))}
                  className="flex-1 bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
              </div>
            </div>
            {field("price", "Price (₦)", "number", "0")}
            {field("stockQuantity", "Stock Quantity", "number", "0")}
            {field("coverageInformation", "Coverage Info", "text", "e.g. 12–14 m² per litre")}
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Status</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "active"|"inactive" }))}
                className="bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Description</label>
            <textarea value={form.productDescription} rows={3} onChange={(e) => setForm((p) => ({ ...p, productDescription: e.target.value }))} placeholder="Product description..."
              className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent resize-none" />
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Features (comma-separated)</label>
            <input value={form.productFeatures} onChange={(e) => setForm((p) => ({ ...p, productFeatures: e.target.value }))} placeholder="Washable, Low VOC, Fast Dry"
              className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm hover:border-brand-white hover:text-brand-white transition-colors">Cancel</button>
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50">
              {mutation.isPending ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
              {mutation.isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

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

  const list = data ?? [];
  const cats = ["all", ...Array.from(new Set(list.map((p) => p.productCategory)))];
  const filtered = list
    .filter((p) => catFilter === "all" || p.productCategory === catFilter)
    .filter((p) => !search || p.productName.toLowerCase().includes(search.toLowerCase()));

    if (isLoading) return <LoadingSkeleton />;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Products</h1>
          <p className="text-brand-mid text-sm mt-1">Manage your paint product catalogue</p>
        </div>
        <button onClick={() => { setEditProduct(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-brand-card border border-brand-mid/30 rounded-lg px-4 py-2.5 flex-1 max-w-sm">
          <Search size={14} className="text-brand-mid" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            className="bg-transparent text-brand-white text-sm placeholder-brand-mid outline-none flex-1" />
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${catFilter === c ? "bg-brand-accent text-brand-black" : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-brand-white"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader size={28} className="animate-spin text-brand-accent" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p._id} className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden hover:border-brand-accent/30 transition-all group">
              {/* Colour swatch */}
              <div className="h-24 relative" style={{ backgroundColor: p.colourCode }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === "active" ? "bg-green-700 text-green-100" : "bg-gray-700 text-gray-300"}`}>{p.status}</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-brand-white font-semibold text-sm leading-snug">{p.productName}</h3>
                  <p className="text-brand-mid text-xs mt-0.5">{p.productCategory} · {p.colourName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-accent font-bold">{formatCurrency(p.price)}</span>
                  <span className="text-brand-mid text-xs">{p.stockQuantity} in stock</span>
                </div>
                <p className="text-brand-mid text-xs">{p.coverageInformation}</p>
                {p.productFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.productFeatures.slice(0,3).map((f) => (
                      <span key={f} className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-1 border-t border-brand-mid/20">
                  <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 py-1.5 rounded-md text-xs transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => { if (confirm("Delete this product?")) deleteMutation.mutate(p._id); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-red-500 hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editProduct) && (
        <ProductFormModal product={editProduct} onClose={() => { setShowForm(false); setEditProduct(undefined); }} />
      )}
    </div>
  );
}
