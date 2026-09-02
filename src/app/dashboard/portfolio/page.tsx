"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminGetPortfolio, adminCreatePortfolioProject, adminDeletePortfolioProject } from "@/lib/adminApi";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Star, X, Loader, ImageIcon, MapPin, Upload, User, Video } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  url: string;
  publicId?: string;
  id?: string;
}

interface PortfolioProject {
  _id: string;
  projectTitle: string;
  projectCategory: string;
  clientName: string;
  projectLocation: string;
  projectDescription: string;
  media: MediaItem[];   // ← new field from backend
  images?: string[];    // kept for backwards compat
  completionDate: string;
  featured: boolean;
}

const CATEGORIES = ["Residential", "Commercial", "Industrial", "Institutional"];

const EMPTY = {
  projectTitle: "", projectCategory: "", clientName: "", projectLocation: "",
  projectDescription: "", completionDate: "", featured: false,
};

const inputCls = "bg-brand-black border border-brand-mid text-brand-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent";

// ── Helper: get first image URL from media array ──────────────────────────────
function getFirstImage(proj: PortfolioProject): string | null {
  const img = proj.media?.find((m) => m.type === "image");
  if (img) return img.url;
  return proj.images?.[0] ?? null;
}

function getVideos(proj: PortfolioProject): MediaItem[] {
  return proj.media?.filter((m) => m.type === "video") ?? [];
}

function getAllImages(proj: PortfolioProject): string[] {
  const fromMedia = proj.media?.filter((m) => m.type === "image").map((m) => m.url) ?? [];
  if (fromMedia.length) return fromMedia;
  return proj.images ?? [];
}

// ── Create Modal ──────────────────────────────────────────────────────────────
function ProjectFormModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews]     = useState<{ url: string; type: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (mediaFiles.length === 0) throw new Error("Please upload at least one image or video");
      const fd = new FormData();
      fd.append("projectTitle",       form.projectTitle);
      fd.append("projectCategory",    form.projectCategory);
      fd.append("clientName",         form.clientName);
      fd.append("projectLocation",    form.projectLocation);
      fd.append("projectDescription", form.projectDescription);
      fd.append("completionDate",     form.completionDate);
      fd.append("featured",           String(form.featured));
      // Backend expects field name "media" repeated for each file
      mediaFiles.forEach((file) => fd.append("media", file));
      return adminCreatePortfolioProject(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success("Project added");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || "Failed"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...picked]);
    setPreviews((prev) => [
      ...prev,
      ...picked.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type.startsWith("video") ? "video" : "image",
        name: f.name,
      })),
    ]);
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url);
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl
        w-full max-w-xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-brand-white">Add Portfolio Project</h3>
          <button onClick={onClose} className="text-brand-mid hover:text-brand-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Project Title</label>
              <input value={form.projectTitle} placeholder="e.g. Duplex Project"
                onChange={(e) => setForm((p) => ({ ...p, projectTitle: e.target.value }))}
                className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Project Category</label>
              <select value={form.projectCategory}
                onChange={(e) => setForm((p) => ({ ...p, projectCategory: e.target.value }))}
                className={inputCls}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Client Name</label>
              <input value={form.clientName} placeholder="e.g. Timothy"
                onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Project Location</label>
              <input value={form.projectLocation} placeholder="e.g. Port Harcourt"
                onChange={(e) => setForm((p) => ({ ...p, projectLocation: e.target.value }))}
                className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Project Description</label>
            <textarea value={form.projectDescription} rows={3} placeholder="e.g. Complete painting"
              onChange={(e) => setForm((p) => ({ ...p, projectDescription: e.target.value }))}
              className={`${inputCls} resize-none`} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-brand-lt-gray text-xs font-medium">Completion Date</label>
              <input type="date" value={form.completionDate}
                onChange={(e) => setForm((p) => ({ ...p, completionDate: e.target.value }))}
                className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer pb-2.5">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="accent-brand-accent w-4 h-4" />
              <span className="text-brand-lt-gray text-sm">Featured project</span>
            </label>
          </div>

          {/* Media upload — images AND videos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Project Media <span className="text-brand-mid font-normal">(images &amp; videos — field name: <code className="text-brand-accent text-[10px]">media</code>)</span>
            </label>
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 border border-dashed border-brand-mid
                text-brand-mid hover:text-brand-white hover:border-brand-accent rounded-md py-4 text-sm transition-colors">
              <Upload size={15} /> Click to upload images or videos
            </button>
            {/* Accept both images and videos */}
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((item, idx) => (
                  <div key={idx} className="relative w-20 h-16 rounded-md overflow-hidden border border-brand-mid group flex-shrink-0">
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-brand-raised flex flex-col items-center justify-center gap-1">
                        <Video size={18} className="text-brand-accent" />
                        <span className="text-brand-mid text-[9px] truncate w-full text-center px-1">{item.name}</span>
                      </div>
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                    <button onClick={() => removeFile(idx)}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5
                        opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={11} />
                    </button>
                    {/* Type badge */}
                    <div className={`absolute bottom-0 left-0 right-0 text-[9px] font-bold text-center py-0.5
                      ${item.type === "video" ? "bg-brand-accent text-brand-black" : "bg-black/50 text-white"}`}>
                      {item.type === "video" ? "VIDEO" : "IMG"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm
                hover:border-brand-white hover:text-brand-white transition-colors">
              Cancel
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || mediaFiles.length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed">
              {mutation.isPending ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
              {mutation.isPending ? "Saving..." : "Add Project"}
            </button>
          </div>
          {mediaFiles.length === 0 && (
            <p className="text-red-400 text-xs text-center -mt-2">⚠ At least one image or video is required</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPortfolioPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      try {
        const res = await adminGetPortfolio();
        return (res?.projects ?? res?.data ?? res ?? []) as PortfolioProject[];
      } catch { return []; }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeletePortfolioProject(id),
    onSuccess: (_, id) => {
      qc.setQueryData(["portfolio"], (old: PortfolioProject[] = []) => old.filter((p) => p._id !== id));
      toast.success("Project removed");
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  const list = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-white">Portfolio Projects</h1>
          <p className="text-brand-mid text-sm mt-1">Showcase your completed work — images and videos</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
            px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader size={28} className="animate-spin text-brand-accent" /></div>
      ) : list.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-center">
          <ImageIcon size={40} className="text-brand-mid" />
          <p className="text-brand-mid text-sm">No portfolio projects yet</p>
          <button onClick={() => setShowForm(true)} className="text-brand-accent text-sm font-medium hover:underline">
            Add your first project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((proj) => {
            const thumbUrl  = getFirstImage(proj);
            const videos    = getVideos(proj);
            const imgCount  = getAllImages(proj).length;

            return (
              <div key={proj._id}
                className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden
                  hover:border-brand-accent/30 transition-all group">

                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-brand-black via-brand-card to-brand-black
                  flex items-center justify-center relative overflow-hidden">
                  {thumbUrl ? (
                    <img src={thumbUrl} alt={proj.projectTitle} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={36} className="text-brand-accent/20" />
                  )}

                  {/* Featured badge */}
                  {proj.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-accent
                      text-brand-black text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <Star size={9} fill="currentColor" /> Featured
                    </div>
                  )}

                  {/* Category badge */}
                  {proj.projectCategory && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full">
                      {proj.projectCategory}
                    </div>
                  )}

                  {/* Media count badges */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {imgCount > 0 && (
                      <span className="flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                        <ImageIcon size={9} /> {imgCount}
                      </span>
                    )}
                    {videos.length > 0 && (
                      <span className="flex items-center gap-1 bg-brand-accent text-brand-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Video size={9} /> {videos.length}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <h3 className="text-brand-white font-semibold leading-snug">{proj.projectTitle}</h3>
                    <div className="flex items-center gap-3 text-brand-mid text-xs mt-1.5 flex-wrap">
                      {proj.projectLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-brand-accent" />{proj.projectLocation}
                        </span>
                      )}
                      {proj.clientName && (
                        <span className="flex items-center gap-1">
                          <User size={11} className="text-brand-accent" />{proj.clientName}
                        </span>
                      )}
                    </div>
                  </div>

                  {proj.projectDescription && (
                    <p className="text-brand-mid text-xs leading-relaxed line-clamp-2">{proj.projectDescription}</p>
                  )}

                  <div className="flex items-center justify-between text-brand-mid text-xs border-t border-brand-mid/20 pt-3">
                    <span>{proj.completionDate ? `Completed ${formatDate(proj.completionDate)}` : "—"}</span>
                    <button
                      onClick={() => { if (confirm("Remove this project?")) deleteMutation.mutate(proj._id); }}
                      className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors">
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <ProjectFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}