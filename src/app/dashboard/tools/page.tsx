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
  image?: string;
}

const inputCls =
  "w-full bg-brand-black border border-brand-mid/40 text-white placeholder-brand-mid px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-accent/60 transition-all";

// ── Create / Edit Modal ────────────────────────────────────────────────────────
function ToolFormModal({
  tool,
  onClose,
}: {
  tool?: Tool;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!tool;
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(tool?.name ?? "");
  const [description, setDescription] = useState(tool?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(tool?.image ?? "");

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      if (file) fd.append("image", file);
      return isEdit
        ? apiUpdateTool(tool!._id ?? tool!.id!, fd)
        : apiCreateTool(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      toast.success(isEdit ? "Tool updated" : "Tool created");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message || "Operation failed"),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-brand-card border border-brand-mid/40 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-brand-mid/20 sticky top-0 bg-brand-card z-10">
          <h3 className="font-display text-lg font-bold text-white">
            {isEdit ? "Edit Tool" : "Add New Tool"}
          </h3>
          <button onClick={onClose} className="text-brand-mid hover:text-white p-1 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-lt-gray text-xs font-medium">Tool Image</label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-full h-36 border border-dashed border-brand-mid/40 rounded-lg
                flex flex-col items-center justify-center gap-2 text-brand-mid
                hover:border-brand-accent/60 hover:text-white transition-colors overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <Upload size={22} />
                  <span className="text-xs">Click to upload image</span>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            {preview && (
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(""); }}
                className="text-brand-subtle text-xs hover:text-red-400 transition-colors text-left"
              >
                Remove image
              </button>
            )}
          </div>

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

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-brand-mid/40 text-brand-mid py-2.5 rounded-lg text-sm
                hover:border-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!name.trim() || !description.trim()) {
                  toast.error("Name and description are required");
                  return;
                }
                mutation.mutate();
              }}
              disabled={mutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black
                font-semibold py-2.5 rounded-lg text-sm hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDeleteTool(id),
    onSuccess: (_, id) => {
      qc.setQueryData(["tools"], (old: Tool[] = []) =>
        old.filter((t) => (t._id ?? t.id) !== id)
      );
      toast.success("Tool deleted");
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  const list = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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

      {/* Grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader size={28} className="animate-spin text-brand-accent" />
        </div>
      ) : list.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3">
          <Wrench size={40} className="text-brand-mid" />
          <p className="text-brand-mid text-sm">No tools added yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-brand-accent text-sm font-medium hover:underline"
          >
            Add your first tool
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((tool) => {
            const id = tool._id ?? tool.id!;
            return (
              <div
                key={id}
                className="bg-brand-card border border-brand-mid/30 rounded-xl overflow-hidden
                  hover:border-brand-accent/30 transition-all group flex flex-col"
              >
                {/* Image */}
                <div className="h-36 bg-brand-raised flex items-center justify-center overflow-hidden">
                  {tool.image ? (
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Wrench size={32} className="text-brand-mid/30" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-brand-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-brand-mid text-xs leading-relaxed line-clamp-2 flex-1">
                    {tool.description}
                  </p>
                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-brand-mid/20 mt-auto">
                    <button
                      onClick={() => { setEditTool(tool); setShowForm(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid
                        hover:text-white hover:bg-brand-raised py-1.5 rounded-md text-xs transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this tool?")) deleteMutation.mutate(id);
                      }}
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

      {/* Modal */}
      {(showForm || editTool) && (
        <ToolFormModal
          tool={editTool}
          onClose={() => { setShowForm(false); setEditTool(undefined); }}
        />
      )}
    </div>
  );
}