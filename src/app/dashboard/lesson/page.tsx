

// "use client";
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { 
//   adminGetAllMedia, 
//   adminCreateMedia,
//   adminUpdateMedia, 
//   adminDeleteMedia 
// } from "@/lib/adminApi"; 
// import { Plus, Trash2, Edit2, Loader, Image as ImageIcon, Video, X, FileText, UploadCloud, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";

// interface MediaItem {
//   _id: string;
//   title: string;
//   description: string;
//   images: string[];
//   video?: string;
//   createdAt: string;
// }

// export default function AdminLessonsPage() {
//   const qc = useQueryClient();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

//   // Form states
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [video, setVideo] = useState<File | null>(null);
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [existingVideo, setExistingVideo] = useState<string | undefined>(undefined);

//   // Clean up object URLs to prevent memory leaks when files change or modal closes
//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreviews]);

//   // Fetch all media items
//   const { data, isLoading } = useQuery({
//     queryKey: ["admin-all-media"],
//     queryFn: async () => {
//       const res = await adminGetAllMedia()
//       console.log('res',res)
//       return (res?.media ?? res?.data ?? []) as MediaItem[];
//     },
//   });

//   // Create / Update Mutation using your unified endpoint routes
//   const saveMutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       if (editingItem) {
//         return adminUpdateMedia(editingItem._id, formData);
//       } else {
//         return adminCreateMedia(formData);
//       }
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["admin-all-media"] });
//       toast.success(editingItem ? "Lesson modified successfully" : "New lesson workspace published", { id: "submit-lesson" });
//       setIsModalOpen(false);
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Operation failed to complete successfully", { id: "submit-lesson" });
//     },
//   });

//   // Delete Mutation
//   const deleteMutation = useMutation({
//     mutationFn: adminDeleteMedia,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["admin-all-media"] });
//       toast.success("Lesson deleted successfully");
//     },
//     onError: (err: any) => toast.error(err?.message || "Failed to delete lesson"),
//   });

//   // Open modal config setup
//   const openModal = (item: MediaItem | null = null) => {
//     // Clear old local preview strings
//     imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//     setImagePreviews([]);

//     if (item) {
//       setEditingItem(item);
//       setTitle(item.title);
//       setDescription(item.description);
//       setExistingImages(item.images || []);
//       setExistingVideo(item.video);
//       setImages([]);
//       setVideo(null);
//     } else {
//       setEditingItem(null);
//       setTitle("");
//       setDescription("");
//       setImages([]);
//       setVideo(null);
//       setExistingImages([]);
//       setExistingVideo(undefined);
//     }
//     setIsModalOpen(true);
//   };

//   // Handle selected image files and generate previews
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
//       setImages((prev) => [...prev, ...selectedFiles]);

//       // Map files to dynamic local blob preview strings
//       const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
//       setImagePreviews((prev) => [...prev, ...newPreviews]);
//     }
//   };

//   const removeNewImage = (index: number) => {
//     URL.revokeObjectURL(imagePreviews[index]);
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selected = e.target.files[0];
//       if (selected.size > 50 * 1024 * 1024) {
//         toast.error("Video file size exceeds maximum 50MB restriction limit!");
//         return;
//       }
//       setVideo(selected);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !description.trim()) {
//       toast.error("Please provide both title and description");
//       return;
//     }
//     if (!editingItem && images.length === 0) {
//       toast.error("Please add at least 1 lesson image.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
    
//     images.forEach((img) => formData.append("images", img));
//     if (video) formData.append("video", video);

//     if (editingItem) {
//       formData.append("existingImages", JSON.stringify(existingImages));
//       if (existingVideo) formData.append("existingVideo", existingVideo);
//     }

//     toast.loading(editingItem ? "Modifying lesson..." : "Uploading assets and publishing...", { id: "submit-lesson" });
//     saveMutation.mutate(formData);
//   };

//   return (
//     <div className="bg-brand-black min-h-screen text-white p-6 md:p-10">
//       <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border/40 pb-6 mb-8">
//         <div>
//           <p className="text-brand-accent text-xs font-semibold tracking-widest uppercase">Admin Panel</p>
//           <h1 className="font-display text-3xl font-bold mt-1">Manage Lessons Media</h1>
//         </div>
//         <button onClick={() => openModal(null)} className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-accent-lt transition-all">
//           <Plus size={16} /> Add New Lesson
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="py-20 flex justify-center"><Loader className="animate-spin text-brand-accent" size={32} /></div>
//       ) : !data || data.length === 0 ? (
//         <div className="text-center py-20 border border-dashed border-brand-border/30 rounded-2xl">
//           <FileText className="text-brand-subtle mx-auto mb-3" size={40} />
//           <p className="text-brand-mid text-sm">No media lesson catalogs available.</p>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <div key={item._id} className="bg-brand-card border border-brand-border rounded-xl p-5 flex flex-col justify-between">
//               <div>
//                 <div className="h-40 bg-brand-raised rounded-lg overflow-hidden mb-4 relative flex items-center justify-center">
//                   {item.images && item.images[0] ? (
//                     <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
//                   ) : (
//                     <ImageIcon className="text-brand-subtle" size={28} />
//                   )}
//                   <div className="absolute top-2 right-2 flex gap-1">
//                     <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
//                       <ImageIcon size={10} /> {item.images?.length || 0}
//                     </span>
//                     {item.video && (
//                       <span className="bg-brand-accent/90 text-brand-black text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
//                         <Video size={10} /> MP4
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <h3 className="font-bold text-base text-white truncate">{item.title}</h3>
//                 <p className="text-brand-mid text-xs line-clamp-2 mt-1 mb-4">{item.description}</p>
//               </div>

//               <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border/30">
//                 <button onClick={() => openModal(item)} className="p-2 text-brand-mid hover:text-white border border-brand-border rounded-lg bg-brand-raised hover:bg-brand-border/20 transition-all">
//                   <Edit2 size={14} />
//                 </button>
//                 <button onClick={() => { if(confirm("Delete lesson configuration?")) deleteMutation.mutate(item._id); }} className="p-2 text-red-400 hover:text-red-300 border border-brand-border rounded-lg bg-brand-raised hover:bg-red-950/20 transition-all">
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Upload & Edit Modal Overlay */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
//             <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
//               <h2 className="text-white font-bold text-lg">{editingItem ? "Edit Lesson Workspace" : "Upload New Media Lesson"}</h2>
//               <button type="button" onClick={() => setIsModalOpen(false)} className="text-brand-subtle hover:text-white"><X size={18} /></button>
//             </div>

//             <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-sm">
//               <div>
//                 <label className="block text-brand-mid text-xs font-semibold uppercase mb-1.5">Lesson Title</label>
//                 <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-brand-raised text-white border border-brand-border rounded-lg p-2.5 focus:outline-none focus:border-brand-accent/50" placeholder="e.g., Interior Painting Techniques" />
//               </div>

//               <div>
//                 <label className="block text-brand-mid text-xs font-semibold uppercase mb-1.5">Description</label>
//                 <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-brand-raised text-white border border-brand-border rounded-lg p-2.5 focus:outline-none focus:border-brand-accent/50定位 resize-none" placeholder="Provide step details..." />
//               </div>

//               {/* Images Picker and Dynamic Live Previews */}
//               <div>
//                 <label className="block text-brand-mid text-xs font-semibold uppercase mb-1.5">Images (At least 1 required)</label>
//                 <div className="border border-dashed border-brand-border hover:border-brand-accent/40 rounded-xl p-4 text-center bg-brand-raised/20 transition-all relative">
//                   <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
//                   <UploadCloud className="text-brand-subtle mx-auto mb-1" size={24} />
//                   <p className="text-xs text-brand-mid">Click to pick or drag images here</p>
//                 </div>
                
//                 {/* Unified Image Gallery Preview Row */}
//                 {(existingImages.length > 0 || imagePreviews.length > 0) && (
//                   <div className="mt-3">
//                     <p className="text-[11px] text-brand-subtle uppercase font-semibold mb-1.5 tracking-wider">Selected Images Preview:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {/* Existing Uploaded Cloudinary Images */}
//                       {existingImages.map((img, i) => (
//                         <div key={`existing-${i}`} className="relative w-14 h-14 rounded-lg border border-brand-border overflow-hidden bg-brand-raised">
//                           <img src={img} className="object-cover w-full h-full" alt="Uploaded asset preview" />
//                           <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/80 text-red-400 p-0.5 rounded hover:text-red-300">
//                             <X size={10} />
//                           </button>
//                         </div>
//                       ))}

//                       {/* Fresh Local Selected Image Previews */}
//                       {imagePreviews.map((blobUrl, i) => (
//                         <div key={`local-${i}`} className="relative w-14 h-14 rounded-lg border border-brand-accent/30 overflow-hidden bg-brand-raised animate-fade-in">
//                           <img src={blobUrl} className="object-cover w-full h-full" alt="Local file buffer preview" />
//                           <span className="absolute bottom-0 inset-x-0 bg-brand-accent text-brand-black text-[8px] font-bold text-center py-0.5 uppercase">New</span>
//                           <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0.5 right-0.5 bg-black/80 text-red-400 p-0.5 rounded hover:text-red-300">
//                             <X size={10} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Video Upload Field Dropzone */}
//               <div>
//                 <label className="block text-brand-mid text-xs font-semibold uppercase mb-1 flex justify-between items-center">
//                   <span>Video Feature (Max 1)</span>
//                   <span className="text-[10px] text-brand-subtle lowercase flex items-center gap-1"><AlertCircle size={10}/> max 50mb</span>
//                 </label>
//                 <div className="border border-dashed border-brand-border hover:border-brand-accent/40 rounded-xl p-4 text-center bg-brand-raised/20 transition-all relative">
//                   <input type="file" accept="video/*" onChange={handleVideoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
//                   <Video className="text-brand-subtle mx-auto mb-1" size={24} />
//                   <p className="text-xs text-brand-mid truncate px-2">{video ? video.name : existingVideo ? "Asset preserved on server" : "Click to select MP4 video container"}</p>
//                 </div>
//                 {(video || existingVideo) && (
//                   <button type="button" onClick={() => { setVideo(null); setExistingVideo(undefined); }} className="text-red-400 hover:text-red-300 text-xs mt-1.5 flex items-center gap-1 w-fit">
//                     <Trash2 size={12}/> Clear current video slot
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-4 bg-brand-raised/50 border-t border-brand-border/60 flex justify-end gap-2">
//               <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg text-xs hover:text-white transition-colors">Cancel</button>
//               <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 bg-brand-accent text-brand-black font-semibold rounded-lg text-xs hover:bg-brand-accent-lt transition-colors disabled:opacity-50">
//                 {saveMutation.isPending ? "Saving changes..." : editingItem ? "Save Modifications" : "Publish Lesson"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGetAllMedia,
  adminCreateMedia,
  adminUpdateMedia,
  adminDeleteMedia,
} from "@/lib/adminApi";
import {
  Plus, Trash2, Edit2, Loader, Image as ImageIcon, Video,
  X, FileText, UploadCloud, AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  video?: string;
  createdAt: string;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function LessonModal({
  item,
  onClose,
  onSaved,
}: {
  item: MediaItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!item;

  const [title, setTitle]               = useState(item?.title ?? "");
  const [description, setDescription]   = useState(item?.description ?? "");
  const [images, setImages]             = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [video, setVideo]               = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(item?.images ?? []);
  const [existingVideo, setExistingVideo]   = useState<string | undefined>(item?.video);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => { imagePreviews.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);  // eslint-disable-line

  const mutation = useMutation({
    mutationFn: (fd: FormData) =>
      isEdit ? adminUpdateMedia(item!._id, fd) : adminCreateMedia(fd),
    onSuccess: () => {
      toast.success(isEdit ? "Lesson updated!" : "Lesson published!");
      onSaved();
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Upload failed — please try again");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    if (!picked.length) return;
    setImages((prev) => [...prev, ...picked]);
    setImagePreviews((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50 MB");
      return;
    }
    setVideo(f);
    e.target.value = "";
  };

  // ── Key fix: build FormData and call mutate directly from a button onClick,
  //    NOT inside onSubmit, so the form submit event doesn't interfere with
  //    file inputs or cause a double-fire on slow uploads.
  const handleSubmit = () => {
    if (!title.trim())       { toast.error("Title is required"); return; }
    if (!description.trim()) { toast.error("Description is required"); return; }
    const totalImages = existingImages.length + images.length;
    if (totalImages === 0)   { toast.error("Please add at least one image"); return; }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    images.forEach((img) => fd.append("images", img));
    if (video) fd.append("video", video);

    // Preserve existing server images/video on edit
    if (isEdit) {
      existingImages.forEach((url) => fd.append("existingImages", url));
      if (existingVideo) fd.append("existingVideo", existingVideo);
    }

    mutation.mutate(fd);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg
        overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">

        {/* Header */}
        <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
          <h2 className="text-white font-bold text-lg">
            {isEdit ? "Edit Lesson" : "Upload New Lesson"}
          </h2>
          <button type="button" onClick={onClose}
            className="text-brand-subtle hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-sm">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">Lesson Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Interior Painting Techniques"
              className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
                p-2.5 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this lesson covers..."
              className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
                p-2.5 focus:outline-none focus:border-brand-accent/50 resize-none transition-colors"
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
              Images <span className="text-red-400">*</span>
              <span className="text-brand-subtle ml-1 normal-case font-normal">(at least 1)</span>
            </label>

            <label className="border border-dashed border-brand-border hover:border-brand-accent/50
              rounded-xl p-4 text-center bg-brand-raised/20 transition-all cursor-pointer block">
              <UploadCloud className="text-brand-subtle mx-auto mb-1" size={22} />
              <p className="text-xs text-brand-mid">Click to add images</p>
              <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
            </label>

            {/* Previews */}
            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-1">
                {existingImages.map((src, i) => (
                  <div key={`ex-${i}`}
                    className="relative w-14 h-14 rounded-lg border border-brand-border overflow-hidden group">
                    <img src={src} className="object-cover w-full h-full" alt="" />
                    <button type="button"
                      onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 bg-black/80 text-red-400
                        p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {imagePreviews.map((src, i) => (
                  <div key={`new-${i}`}
                    className="relative w-14 h-14 rounded-lg border border-brand-accent/40 overflow-hidden group">
                    <img src={src} className="object-cover w-full h-full" alt="" />
                    <span className="absolute bottom-0 inset-x-0 bg-brand-accent text-brand-black
                      text-[8px] font-bold text-center py-0.5 uppercase">New</span>
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-0.5 right-0.5 bg-black/80 text-red-400
                        p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Video <span className="font-normal normal-case text-brand-subtle">(optional, max 50 MB)</span></span>
              {(video || existingVideo) && (
                <button type="button"
                  onClick={() => { setVideo(null); setExistingVideo(undefined); }}
                  className="text-red-400 hover:text-red-300 text-[11px] normal-case font-normal
                    flex items-center gap-1 transition-colors">
                  <Trash2 size={11} /> Remove video
                </button>
              )}
            </label>

            <label className="border border-dashed border-brand-border hover:border-brand-accent/50
              rounded-xl p-4 text-center bg-brand-raised/20 transition-all cursor-pointer block">
              <Video className="text-brand-subtle mx-auto mb-1" size={22} />
              <p className="text-xs text-brand-mid truncate px-2">
                {video
                  ? `✓ ${video.name} (${(video.size / 1024 / 1024).toFixed(1)} MB)`
                  : existingVideo
                  ? "✓ Video already uploaded — click to replace"
                  : "Click to select MP4 video (max 50 MB)"}
              </p>
              <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
            </label>

            {/* Progress note for video — shown while uploading */}
            {mutation.isPending && video && (
              <div className="flex items-center gap-2 text-brand-accent text-xs bg-brand-raised
                border border-brand-accent/20 rounded-lg px-3 py-2">
                <Loader size={12} className="animate-spin flex-shrink-0" />
                Uploading video — this may take a moment. Please wait…
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-raised/50 border-t border-brand-border/60 flex justify-end gap-2">
          <button type="button" onClick={onClose}
            disabled={mutation.isPending}
            className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg text-xs
              hover:text-white transition-colors disabled:opacity-40">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-5 py-2 bg-brand-accent text-brand-black
              font-semibold rounded-lg text-xs hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
          >
            {mutation.isPending && <Loader size={13} className="animate-spin" />}
            {mutation.isPending
              ? video && !isEdit ? "Uploading…" : "Saving…"
              : isEdit ? "Save Changes" : "Publish Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminLessonsPage() {
  const qc = useQueryClient();
  const [modalItem, setModalItem] = useState<MediaItem | null | undefined>(undefined);
  // undefined = closed, null = create new, MediaItem = editing

  const { data, isLoading } = useQuery({
    queryKey: ["admin-all-media"],
    queryFn: async () => {
      const res = await adminGetAllMedia();
      return (res?.media ?? res?.data ?? []) as MediaItem[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteMedia,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-media"] });
      toast.success("Lesson deleted");
    },
    onError: (err: Error) => toast.error(err?.message || "Delete failed"),
  });

  const list = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Lessons</h1>
          <p className="text-brand-mid text-sm mt-1">Upload and manage media lessons</p>
        </div>
        <button
          onClick={() => setModalItem(null)}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
            px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm"
        >
          <Plus size={16} /> Add New Lesson
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader className="animate-spin text-brand-accent" size={32} />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-brand-border/30 rounded-2xl">
          <FileText className="text-brand-subtle mx-auto mb-3" size={40} />
          <p className="text-brand-mid text-sm">No lessons yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((item) => (
            <div key={item._id}
              className="bg-brand-card border border-brand-border rounded-xl overflow-hidden
                flex flex-col hover:border-brand-accent/30 transition-all group">

              {/* Thumbnail */}
              <div className="h-40 bg-brand-raised relative overflow-hidden flex items-center justify-center">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <ImageIcon className="text-brand-subtle" size={28} />
                )}
                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded
                    backdrop-blur-sm flex items-center gap-1">
                    <ImageIcon size={9} /> {item.images?.length ?? 0}
                  </span>
                  {item.video && (
                    <span className="bg-brand-accent text-brand-black text-[10px] px-2 py-0.5
                      rounded font-bold flex items-center gap-1">
                      <Video size={9} /> Video
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                <p className="text-brand-mid text-xs line-clamp-2 flex-1">{item.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-brand-border/30 mt-auto">
                  <button
                    onClick={() => setModalItem(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid
                      hover:text-white hover:bg-brand-raised py-1.5 rounded-md text-xs transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this lesson?")) deleteMutation.mutate(item._id); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-red-500
                      hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal — only mount when open */}
      {modalItem !== undefined && (
        <LessonModal
          item={modalItem}
          onClose={() => setModalItem(undefined)}
          onSaved={() => qc.invalidateQueries({ queryKey: ["admin-all-media"] })}
        />
      )}
    </div>
  );
}