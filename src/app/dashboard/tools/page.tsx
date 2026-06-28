

"use client";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiCreateTool, apiGetTools, apiDeleteTool, apiUpdateTool } from "@/lib/adminApi";
import { Plus, Trash2, Pencil, X, Loader, Wrench, Upload } from "lucide-react";

interface Tool {
  _id: string;
  id?: string;
  name: string;
  description: string;
  images?: string[];
}

const inputCls =
  "w-full bg-brand-black border border-brand-mid text-white placeholder-brand-mid px-3 py-2 rounded-md text-sm focus:outline-none focus:border-brand-accent";

// ── Create / Edit Modal ── follows the SAME pattern as ProductFormModal ────────
function ToolFormModal({ tool, onClose }: { tool?: Tool; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!tool;
  const fileRef = useRef<HTMLInputElement>(null);
console.log('tool',tool)
  // Plain controlled state — same as product form
  const [name, setName] = useState(tool?.name ?? "");
  const [description, setDescription] = useState(tool?.description ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(tool?.images ?? []);

  console.log('name', name, "description", description, "previews", previews)

  // Mutation reads directly from state at call time
  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);

      // Append each selected file under the exact key "images" expected by your backend
      files.forEach((file) => {
        fd.append("images", file);
      });

      // Keep existing images on update if no new ones are added
      if (isEdit && files.length === 0) {
        const existingUrls = previews.filter((p) => p && !p.startsWith("blob:"));
        existingUrls.forEach((url) => fd.append("images", url));
      }

      // ✅ FIX: Extract ID dynamically with safe optional checks
      // const targetId = tool?._id || tool?.id;
      // if (isEdit && !targetId) {
      //   throw new Error("Cannot update tool: Missing valid ID parameters");
      // }

      // return isEdit
      //   ? apiUpdateTool(targetId, fd)
      //   : apiCreateTool(fd);
      // Extract ID dynamically with safe optional checks
      const targetId =
       tool?._id || tool?.id;
      if (isEdit && !targetId) {
        throw new Error("Cannot update tool: Missing valid ID parameters");
      }

      return isEdit
        ? apiUpdateTool(targetId!, fd) 
        : apiCreateTool(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      toast.success(isEdit ? "Tool updated" : "Tool created");
      onClose();
    },
    onError: (err: Error) => { 
      toast.error(err.message || "Operation failed");
      console.error("Backend Error Details:", err);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    if (!picked.length) return;
    setFiles((prev) => [...prev, ...picked]);
    setPreviews((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))]);
    e.target.value = ""; // allow re-selecting same file
  };

  const removeImage = (idx: number) => {
    // Revoke blob URL to avoid memory leak
    if (previews[idx]?.startsWith("blob:")) {
      URL.revokeObjectURL(previews[idx]);
      // Find its position among blob-only previews to remove the matching file
      const blobPreviews = previews.filter((p) => p && p.startsWith("blob:"));
      const blobIdx = blobPreviews.indexOf(previews[idx]);
      if (blobIdx !== -1) setFiles((prev) => prev.filter((_, i) => i !== blobIdx));
    }
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Inline validation on click
  const handleSubmit = () => {
    if (!name.trim()) { toast.error("Tool name is required"); return; }
    if (!description.trim()) { toast.error("Description is required"); return; }
    console.log("Raw files being sent to backend:", files);

    // Create mode requires at least one brand new file
    if (!isEdit && files.length === 0) { 
      toast.error("Please upload at least one image"); 
      return; 
    }
    
    // Edit mode requires either an existing preview OR a new file
    if (isEdit && previews.length === 0 && files.length === 0) {
      toast.error("An edited tool must retain or add at least one image");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid rounded-xl shadow-2xl
        w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-5 border-b border-brand-mid/30 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-white">
            {isEdit ? "Edit Tool" : "Add New Tool"}
          </h3>
          <button onClick={onClose} className="text-brand-mid hover:text-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Tool Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paint Roller"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what this tool is used for..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">
              Images {!isEdit && <span className="text-red-400">*</span>}
            </label>

            {/* Upload trigger */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 border border-dashed border-brand-mid
                text-brand-mid hover:border-brand-accent hover:text-white rounded-md py-3 text-sm transition-colors"
            >
              <Upload size={15} /> Click to upload images
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-1">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-brand-mid group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white
                        rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-brand-mid text-brand-mid py-2.5 rounded-md text-sm
                hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                font-semibold py-2.5 rounded-md text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? <Loader size={15} className="animate-spin" /> : <Plus size={15} />}
              {mutation.isPending ? "Saving..." : isEdit ? "Update Tool" : "Add Tool"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editTool, setEditTool] = useState<Tool | undefined>();

  const { data, isLoading } = useQuery<Tool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await apiGetTools();
      return (res?.tools ?? res?.data ?? []) as Tool[];
    },
  });
  console.log('data', data);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDeleteTool(id),
    onSuccess: (_, id) => {
      qc.setQueryData(["tools"], (old: Tool[] = []) =>
        old.filter((t) => t && (t._id || t.id) !== id)
      );
      toast.success("Tool deleted");
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  // Safe filter out null/undefined elements before mapping
  const list = (data ?? []).filter((t) => t && (t._id || t.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Tools</h1>
          <p className="text-brand-mid text-sm mt-1">Manage tools shown to users on the platform</p>
        </div>
        <button
          onClick={() => { setEditTool(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
            px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm"
        >
          <Plus size={16} /> Add Tool
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader size={28} className="animate-spin text-brand-accent" />
        </div>
      ) : list.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3">
          <Wrench size={40} className="text-brand-mid" />
          <p className="text-brand-mid text-sm">No tools added yet</p>
          <button onClick={() => setShowForm(true)} className="text-brand-accent text-sm font-medium hover:underline">
            Add your first tool
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((tool) => {
            // ✅ FIX: Guard against missing tools or fields elegantly
            if (!tool) return null;
            const id = tool._id || tool.id;
            if (!id) return null;

            const hasImages = tool.images && tool.images.length > 0;
            return (
              <div key={id} className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden
                hover:border-brand-accent/30 transition-all group flex flex-col">
                <div className="h-36 bg-brand-raised flex items-center justify-center overflow-hidden relative">
                  {hasImages
                    ? <img src={tool.images?.[0]} alt={tool.name ?? ""} className="w-full h-full object-cover" />
                    : <Wrench size={32} className="text-brand-mid/30" />
                  }
                  {hasImages && tool.images!.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      +{tool.images!.length - 1} more
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-brand-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-brand-mid text-xs leading-relaxed line-clamp-2 flex-1">{tool.description}</p>
                  <div className="flex gap-2 pt-2 border-t border-brand-mid/20 mt-auto">
                    <button
                      onClick={() => { if (tool) { setEditTool(tool); setShowForm(true); } }}
                      className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid
                        hover:text-white hover:bg-brand-raised py-1.5 rounded-md text-xs transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this tool?")) deleteMutation.mutate(id); }}
                      className="flex-1 flex items-center justify-center gap-1.5 text-red-500
                        hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showForm || editTool) && (
        <ToolFormModal
          tool={editTool}
          onClose={() => { setShowForm(false); setEditTool(undefined); }}
        />
      )}
    </div>
  );
}