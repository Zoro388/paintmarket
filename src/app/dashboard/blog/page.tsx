"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetBlogs, adminCreateBlog, adminUpdateBlog, adminDeleteBlog } from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader, FileText, Eye } from "lucide-react";

interface Blog {
  _id: string; title: string; shortDescription: string; content: string;
  author: string; status: "draft" | "published"; tags: string[];
  featuredImages: string[]; createdAt: string;
}

const MOCK: Blog[] = [
  { _id: "b1", title: "5 Tips for Choosing the Perfect Interior Paint Colour", shortDescription: "Picking the right colour can transform any room. Here's how to get it right.", content: "", author: "Paint Domain Team", status: "published", tags: ["Interior","Colour","Tips"], featuredImages: [], createdAt: "2025-06-01" },
  { _id: "b2", title: "Why Exterior Paint Quality Matters More Than You Think", shortDescription: "Your exterior paint is your home's first line of defence against the elements.", content: "", author: "Paint Domain Team", status: "published", tags: ["Exterior","Quality"], featuredImages: [], createdAt: "2025-05-20" },
  { _id: "b3", title: "The Complete Guide to Surface Preparation", shortDescription: "Great paint starts with great prep. Learn the steps pros never skip.", content: "", author: "Paint Domain Team", status: "draft", tags: ["Guide","Preparation"], featuredImages: [], createdAt: "2025-05-10" },
];

const EMPTY: Omit<Blog,"_id"|"createdAt"> = { title:"", shortDescription:"", content:"", author:"Paint Domain Team", status:"draft", tags:[], featuredImages:[] };

function BlogFormModal({ blog, onClose }: { blog?: Blog; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!blog;
  const [form, setForm] = useState(blog ? { title: blog.title, shortDescription: blog.shortDescription, content: blog.content, author: blog.author, status: blog.status, tags: blog.tags.join(", ") } : { ...EMPTY, tags: "" });

  const mutation = useMutation({
    mutationFn: async () => {
      const body = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), featuredImages: [] };
      return isEdit ? adminUpdateBlog(blog!._id, body) : adminCreateBlog(body as Parameters<typeof adminCreateBlog>[0]);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["blogs"] }); toast.success(isEdit ? "Post updated" : "Post created"); onClose(); },
    onError: (err: Error) => toast.error(err.message || "Failed"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-brand-white">{isEdit ? "Edit Blog Post" : "New Blog Post"}</h3>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {[["title","Title","text","Post title..."],["author","Author","text","Author name..."],["tags","Tags (comma-separated)","text","Interior, Tips, Colour..."]].map(([name,label,type,ph]) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">{label}</label>
              <input type={type} value={(form as Record<string,string>)[name]} placeholder={ph}
                onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent" />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Status</label>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "draft"|"published" }))}
              className="bg-brand-black border border-brand-mid text-brand-white px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Short Description</label>
            <textarea value={form.shortDescription} rows={2} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} placeholder="Brief summary..."
              className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Content</label>
            <textarea value={form.content} rows={8} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Full blog post content..."
              className="bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm hover:border-brand-white hover:text-brand-white transition-colors">Cancel</button>
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50">
              {mutation.isPending ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
              {mutation.isPending ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      try { const res = await adminGetBlogs(); return (res?.blogs ?? res?.data ?? []) as Blog[]; }
      catch { return MOCK; }
    },
    placeholderData: MOCK,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteBlog(id),
    onSuccess: (_, id) => { qc.setQueryData(["blogs"], (old: Blog[] = []) => old.filter((b) => b._id !== id)); toast.success("Post deleted"); },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  const list = data ?? MOCK;
  const filtered = statusFilter === "all" ? list : list.filter((b) => b.status === statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Blog Posts</h1>
          <p className="text-brand-mid text-sm mt-1">Manage content and articles</p>
        </div>
        <button onClick={() => { setEditBlog(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="flex gap-2">
        {["all","published","draft"].map((s) => {
          const count = s === "all" ? list.length : list.filter((b) => b.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${statusFilter === s ? "bg-brand-accent text-brand-black" : "bg-brand-card border border-brand-mid/30 text-brand-mid hover:text-brand-white"}`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader size={28} className="animate-spin text-brand-accent" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div key={b._id} className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden hover:border-brand-accent/30 transition-all flex flex-col">
              <div className="h-32 bg-gradient-to-br from-brand-black via-brand-card to-brand-black flex items-center justify-center">
                <FileText size={36} className="text-brand-accent/30" />
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-brand-white font-semibold text-sm leading-snug flex-1">{b.title}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.status === "published" ? "bg-green-700/40 text-green-400" : "bg-gray-700/40 text-gray-400"}`}>{b.status}</span>
                </div>
                <p className="text-brand-mid text-xs leading-relaxed flex-1">{b.shortDescription}</p>
                <div className="flex flex-wrap gap-1">
                  {b.tags.map((t) => <span key={t} className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
                <div className="flex items-center justify-between text-brand-mid text-xs border-t border-brand-mid/20 pt-3">
                  <span>{b.author}</span>
                  <span>{formatDate(b.createdAt)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditBlog(b); setShowForm(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid hover:text-brand-white hover:bg-brand-black/50 py-1.5 rounded-md text-xs transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(b._id); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-red-500 hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editBlog) && (
        <BlogFormModal blog={editBlog} onClose={() => { setShowForm(false); setEditBlog(undefined); }} />
      )}
    </div>
  );
}
