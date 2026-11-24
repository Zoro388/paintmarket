// "use client";
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   adminGetAllMedia,
//   adminCreateMedia,
//   adminUpdateMedia,
//   adminDeleteMedia,
// } from "@/lib/adminApi";
// import {
//   Plus, Trash2, Edit2, Loader, Image as ImageIcon, Video,
//   X, FileText, UploadCloud,
// } from "lucide-react";
// import toast from "react-hot-toast";

// interface MediaItem {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   images: string[];
//   video?: string;
//   createdAt: string;
// }

// // ── Modal ─────────────────────────────────────────────────────────────────────
// function LessonModal({
//   item,
//   onClose,
//   onSaved,
// }: {
//   item: MediaItem | null;
//   onClose: () => void;
//   onSaved: () => void;
// }) {
//   const isEdit = !!item;

//   const [title, setTitle]               = useState(item?.title ?? "");
//   const [description, setDescription]   = useState(item?.description ?? "");
//   const [category, setCategory]         = useState(item?.category ?? "");
//   const [images, setImages]             = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [video, setVideo]               = useState<File | null>(null);
//   const [existingImages, setExistingImages] = useState<string[]>(item?.images ?? []);
//   const [existingVideo, setExistingVideo]   = useState<string | undefined>(item?.video);

//   // Clean up blob URLs on unmount
//   useEffect(() => {
//     return () => { imagePreviews.forEach((u) => URL.revokeObjectURL(u)); };
//   }, []);  // eslint-disable-line

//   const mutation = useMutation({
//     mutationFn: (fd: FormData) =>
//       isEdit ? adminUpdateMedia(item!._id, fd) : adminCreateMedia(fd),
//     onSuccess: () => {
//       toast.success(isEdit ? "Training updated!" : "Training published!");
//       onSaved();
//       onClose();
//     },
//     onError: (err: Error) => {
//       toast.error(err?.message || "Upload failed — please try again");
//     },
//   });

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const picked = e.target.files ? Array.from(e.target.files) : [];
//     if (!picked.length) return;
//     setImages((prev) => [...prev, ...picked]);
//     setImagePreviews((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))]);
//     e.target.value = "";
//   };

//   const removeNewImage = (idx: number) => {
//     URL.revokeObjectURL(imagePreviews[idx]);
//     setImages((prev) => prev.filter((_, i) => i !== idx));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     if (f.size > 50 * 1024 * 1024) {
//       toast.error("Video must be under 50 MB");
//       return;
//     }
//     setVideo(f);
//     e.target.value = "";
//   };

//   // ── Key fix: build FormData and call mutate directly from a button onClick,
//   //    NOT inside onSubmit, so the form submit event doesn't interfere with
//   //    file inputs or cause a double-fire on slow uploads.
//   const handleSubmit = () => {
//     if (!title.trim())       { toast.error("Title is required"); return; }
//     if (!description.trim()) { toast.error("Description is required"); return; }
//     if (!category.trim())    { toast.error("Category is required"); return; }

//     const totalImages = existingImages.length + images.length;
//     if (totalImages === 0)   { toast.error("Please add at least one image"); return; }

//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("description", description);
//     fd.append("category", category);
//     images.forEach((img) => fd.append("images", img));
//     if (video) fd.append("video", video);

//     // Preserve existing server images/video on edit
//     if (isEdit) {
//       existingImages.forEach((url) => fd.append("existingImages", url));
//       if (existingVideo) fd.append("existingVideo", existingVideo);
//     }

//     mutation.mutate(fd);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg
//         overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">

//         {/* Header */}
//         <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
//           <h2 className="text-white font-bold text-lg">
//             {isEdit ? "Edit Training" : "Upload New Training"}
//           </h2>
//           <button type="button" onClick={onClose}
//             className="text-brand-subtle hover:text-white transition-colors">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-sm">

//           {/* Title */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
//               Training Title *
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g. Interior Painting Techniques"
//               className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
//                 p-2.5 focus:outline-none focus:border-brand-accent/50 transition-colors"
//             />
//           </div>

//           {/* Description */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
//               Description *
//             </label>
//             <textarea
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe what this Training covers..."
//               className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
//                 p-2.5 focus:outline-none focus:border-brand-accent/50 resize-none transition-colors"
//             />
//           </div>

//           {/* Category */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
//               Category *
//             </label>
//             <input
//               type="text"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               placeholder="e.g. Surface Preparation"
//               className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
//                 p-2.5 focus:outline-none focus:border-brand-accent/50 transition-colors"
//             />
//           </div>

//           {/* Images */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
//               Images <span className="text-red-400">*</span>
//               <span className="text-brand-subtle ml-1 normal-case font-normal">(at least 1)</span>
//             </label>

//             <label className="border border-dashed border-brand-border hover:border-brand-accent/50
//               rounded-xl p-4 text-center bg-brand-raised/20 transition-all cursor-pointer block">
//               <UploadCloud className="text-brand-subtle mx-auto mb-1" size={22} />
//               <p className="text-xs text-brand-mid">Click to add images</p>
//               <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
//             </label>

//             {/* Previews */}
//             {(existingImages.length > 0 || imagePreviews.length > 0) && (
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {existingImages.map((src, i) => (
//                   <div key={`ex-${i}`}
//                     className="relative w-14 h-14 rounded-lg border border-brand-border overflow-hidden group">
//                     <img src={src} className="object-cover w-full h-full" alt="" />
//                     <button type="button"
//                       onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
//                       className="absolute top-0.5 right-0.5 bg-black/80 text-red-400
//                         p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
//                       <X size={10} />
//                     </button>
//                   </div>
//                 ))}
//                 {imagePreviews.map((src, i) => (
//                   <div key={`new-${i}`}
//                     className="relative w-14 h-14 rounded-lg border border-brand-accent/40 overflow-hidden group">
//                     <img src={src} className="object-cover w-full h-full" alt="" />
//                     <span className="absolute bottom-0 inset-x-0 bg-brand-accent text-brand-black
//                       text-[8px] font-bold text-center py-0.5 uppercase">New</span>
//                     <button type="button" onClick={() => removeNewImage(i)}
//                       className="absolute top-0.5 right-0.5 bg-black/80 text-red-400
//                         p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
//                       <X size={10} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Video */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
//               <span>Video <span className="font-normal normal-case text-brand-subtle">(optional, max 50 MB)</span></span>
//               {(video || existingVideo) && (
//                 <button type="button"
//                   onClick={() => { setVideo(null); setExistingVideo(undefined); }}
//                   className="text-red-400 hover:text-red-300 text-[11px] normal-case font-normal
//                     flex items-center gap-1 transition-colors">
//                   <Trash2 size={11} /> Remove video
//                 </button>
//               )}
//             </label>

//             <label className="border border-dashed border-brand-border hover:border-brand-accent/50
//               rounded-xl p-4 text-center bg-brand-raised/20 transition-all cursor-pointer block">
//               <Video className="text-brand-subtle mx-auto mb-1" size={22} />
//               <p className="text-xs text-brand-mid truncate px-2">
//                 {video
//                   ? `✓ ${video.name} (${(video.size / 1024 / 1024).toFixed(1)} MB)`
//                   : existingVideo
//                   ? "✓ Video already uploaded — click to replace"
//                   : "Click to select MP4 video (max 50 MB)"}
//               </p>
//               <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
//             </label>

//             {/* Progress note for video — shown while uploading */}
//             {mutation.isPending && video && (
//               <div className="flex items-center gap-2 text-brand-accent text-xs bg-brand-raised
//                 border border-brand-accent/20 rounded-lg px-3 py-2">
//                 <Loader size={12} className="animate-spin flex-shrink-0" />
//                 Uploading video — this may take a moment. Please wait…
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-4 bg-brand-raised/50 border-t border-brand-border/60 flex justify-end gap-2">
//           <button type="button" onClick={onClose}
//             disabled={mutation.isPending}
//             className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg text-xs
//               hover:text-white transition-colors disabled:opacity-40">
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={mutation.isPending}
//             className="flex items-center gap-2 px-5 py-2 bg-brand-accent text-brand-black
//               font-semibold rounded-lg text-xs hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
//           >
//             {mutation.isPending && <Loader size={13} className="animate-spin" />}
//             {mutation.isPending
//               ? video && !isEdit ? "Uploading…" : "Saving…"
//               : isEdit ? "Save Changes" : "Publish Training"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function AdminLessonsPage() {
//   const qc = useQueryClient();
//   const [modalItem, setModalItem] = useState<MediaItem | null | undefined>(undefined);
//   // undefined = closed, null = create new, MediaItem = editing

//   const { data, isLoading } = useQuery({
//     queryKey: ["admin-all-media"],
//     queryFn: async () => {
//       const res = await adminGetAllMedia();
//       return (res?.media ?? res?.data ?? []) as MediaItem[];
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: adminDeleteMedia,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["admin-all-media"] });
//       toast.success("Training deleted");
//     },
//     onError: (err: Error) => toast.error(err?.message || "Delete failed"),
//   });

//   const list = data ?? [];

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-white">Training</h1>
//           <p className="text-brand-mid text-sm mt-1">Upload and manage media training</p>
//         </div>
//         <button
//           onClick={() => setModalItem(null)}
//           className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
//             px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm"
//         >
//           <Plus size={16} /> Add New Training
//         </button>
//       </div>

//       {/* Grid */}
//       {isLoading ? (
//         <div className="py-20 flex justify-center">
//           <Loader className="animate-spin text-brand-accent" size={32} />
//         </div>
//       ) : list.length === 0 ? (
//         <div className="text-center py-20 border border-dashed border-brand-border/30 rounded-2xl">
//           <FileText className="text-brand-subtle mx-auto mb-3" size={40} />
//           <p className="text-brand-mid text-sm">No Trainings yet. Add your first one.</p>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {list.map((item) => (
//             <div key={item._id}
//               className="bg-brand-card border border-brand-border rounded-xl overflow-hidden
//                 flex flex-col hover:border-brand-accent/30 transition-all group">

//               {/* Thumbnail */}
//               <div className="h-40 bg-brand-raised relative overflow-hidden flex items-center justify-center">
//                 {item.images?.[0] ? (
//                   <img src={item.images[0]} alt={item.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
//                 ) : (
//                   <ImageIcon className="text-brand-subtle" size={28} />
//                 )}
//                 {/* Badges */}
//                 <div className="absolute top-2 right-2 flex gap-1">
//                   <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded
//                     backdrop-blur-sm flex items-center gap-1">
//                     <ImageIcon size={9} /> {item.images?.length ?? 0}
//                   </span>
//                   {item.video && (
//                     <span className="bg-brand-accent text-brand-black text-[10px] px-2 py-0.5
//                       rounded font-bold flex items-center gap-1">
//                       <Video size={9} /> Video
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Info */}
//               <div className="p-4 flex flex-col gap-2 flex-1">
//                 <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
//                 <p className="text-brand-mid text-xs line-clamp-2 flex-1">{item.description}</p>

//                 {/* Actions */}
//                 <div className="flex items-center gap-2 pt-3 border-t border-brand-border/30 mt-auto">
//                   <button
//                     onClick={() => setModalItem(item)}
//                     className="flex-1 flex items-center justify-center gap-1.5 text-brand-mid
//                       hover:text-white hover:bg-brand-raised py-1.5 rounded-md text-xs transition-colors"
//                   >
//                     <Edit2 size={12} /> Edit
//                   </button>
//                   <button
//                     onClick={() => { if (confirm("Delete this training?")) deleteMutation.mutate(item._id); }}
//                     className="flex-1 flex items-center justify-center gap-1.5 text-red-500
//                       hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors"
//                   >
//                     <Trash2 size={12} /> Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal — only mount when open */}
//       {modalItem !== undefined && (
//         <LessonModal
//           item={modalItem}
//           onClose={() => setModalItem(undefined)}
//           onSaved={() => qc.invalidateQueries({ queryKey: ["admin-all-media"] })}
//         />
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGetAllMedia,
  adminCreateMedia,
  adminUpdateMedia,
  adminDeleteMedia,
} from "@/lib/adminApi";
import {
  Plus,
  Trash2,
  Edit2,
  Loader,
  Image as ImageIcon,
  Video,
  X,
  FileText,
  UploadCloud,
  CheckCircle,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";

interface MediaItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  video?: string;
  createdAt: string;
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const formatFileSize = (bytes: number) => {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// ======================================================
// LESSON MODAL
// ======================================================

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

  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [category, setCategory] = useState(item?.category ?? "");

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [video, setVideo] = useState<File | null>(null);
  const [compressedVideo, setCompressedVideo] = useState<File | null>(null);
  const [compressedPreview, setCompressedPreview] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>(
    item?.images ?? []
  );

  const [existingVideo, setExistingVideo] = useState<string | undefined>(
    item?.video
  );

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  const [compressionInfo, setCompressionInfo] = useState<{
    original: number;
    compressed: number;
  } | null>(null);

  const ffmpegRef = useRef<any>(null);
  const ffmpegLoadedRef = useRef(false);

  // Clean up image preview URLs.
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up compressed video preview URL when replaced or modal closes.
  useEffect(() => {
    return () => {
      if (compressedPreview) {
        URL.revokeObjectURL(compressedPreview);
      }
    };
  }, [compressedPreview]);

  // ======================================================
  // FFMPEG INITIALIZATION
  // ======================================================

  const getFFmpeg = async () => {
    if (ffmpegRef.current && ffmpegLoadedRef.current) {
      return ffmpegRef.current;
    }

    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();

    ffmpeg.on("progress", ({ progress }: { progress: number }) => {
      if (Number.isFinite(progress)) {
        setCompressionProgress(
          Math.min(99, Math.max(0, Math.round(progress * 100)))
        );
      }
    });

    const coreURL = await toBlobURL(
      "/ffmpeg/ffmpeg-core.js",
      "text/javascript"
    );

    const wasmURL = await toBlobURL(
      "/ffmpeg/ffmpeg-core.wasm",
      "application/wasm"
    );

    await ffmpeg.load({
      coreURL,
      wasmURL,
    });

    ffmpegRef.current = ffmpeg;
    ffmpegLoadedRef.current = true;

    return ffmpeg;
  };

  // ======================================================
  // VIDEO COMPRESSION
  // ======================================================

  const compressVideo = async (originalFile: File): Promise<File> => {
    const ffmpeg = await getFFmpeg();
    const { fetchFile } = await import("@ffmpeg/util");

    const inputName = "lesson-input";
    const outputName = "lesson-compressed.mp4";

    setCompressionProgress(0);

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(originalFile));

      const result = await ffmpeg.exec([
        "-i",
        inputName,

        "-map",
        "0:v:0",

        "-map",
        "0:a?",

        "-vf",
        "scale=w='min(1280,iw)':h='min(720,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",

        "-fpsmax",
        "30",

        "-c:v",
        "libx264",

        "-preset",
        "veryfast",

        "-crf",
        "28",

        "-pix_fmt",
        "yuv420p",

        "-c:a",
        "aac",

        "-b:a",
        "96k",

        "-movflags",
        "+faststart",

        "-y",
        outputName,
      ]);

      if (result !== 0) {
        throw new Error("FFmpeg could not compress this video.");
      }

      const outputData = await ffmpeg.readFile(outputName);

      if (typeof outputData === "string") {
        throw new Error("Unable to read the compressed video.");
      }

      const outputBuffer = outputData.buffer.slice(
        outputData.byteOffset,
        outputData.byteOffset + outputData.byteLength
      ) as ArrayBuffer;

      const compressedBlob = new Blob([outputBuffer], {
        type: "video/mp4",
      });

      if (!compressedBlob.size) {
        throw new Error("Compression produced an empty video.");
      }

      const originalName = originalFile.name.replace(/\.[^/.]+$/, "");

      const compressedFile = new File(
        [compressedBlob],
        `${originalName}-compressed.mp4`,
        {
          type: "video/mp4",
          lastModified: Date.now(),
        }
      );

      setCompressionProgress(100);

      return compressedFile;
    } finally {
      // Remove temporary FFmpeg files from browser memory.
      try {
        await ffmpeg.deleteFile(inputName);
      } catch {
        // Ignore cleanup errors.
      }

      try {
        await ffmpeg.deleteFile(outputName);
      } catch {
        // Ignore cleanup errors.
      }
    }
  };

  // ======================================================
  // IMAGE UPLOAD
  // ======================================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];

    if (!picked.length) return;

    setImages((prev) => [...prev, ...picked]);

    setImagePreviews((prev) => [
      ...prev,
      ...picked.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx]);

    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ======================================================
  // SELECT VIDEO AND COMPRESS IMMEDIATELY
  // ======================================================

  const handleVideoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video must be under 50 MB.");
      e.target.value = "";
      return;
    }

    if (isCompressing || mutation.isPending) {
      e.target.value = "";
      return;
    }

    // Store the original locally.
    setVideo(file);

    // Clear previous compressed result.
    setCompressedVideo(null);
    setCompressedPreview("");
    setCompressionInfo(null);
    setCompressionProgress(0);

    // A newly selected video replaces the existing server video.
    setExistingVideo(undefined);

    // Start compression immediately.
    setIsCompressing(true);

    e.target.value = "";

    try {
      toast("Compressing video in your browser...", {
        icon: "🎬",
      });

      const compressed = await compressVideo(file);

      const previewURL = URL.createObjectURL(compressed);

      setCompressedVideo(compressed);
      setCompressedPreview(previewURL);

      setCompressionInfo({
        original: file.size,
        compressed: compressed.size,
      });

      const reduction =
        ((file.size - compressed.size) / file.size) * 100;

      if (reduction > 0) {
        toast.success(
          `Compression complete! Reduced by ${reduction.toFixed(1)}%.`
        );
      } else {
        toast.success("Video converted and prepared for upload.");
      }
    } catch (error) {
      console.error("Video compression error:", error);

      setCompressedVideo(null);
      setCompressionInfo(null);
      setCompressedPreview("");

      toast.error(
        error instanceof Error
          ? `Compression failed: ${error.message}`
          : "Video compression failed. Please try again."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  // ======================================================
  // REMOVE VIDEO
  // ======================================================

  const removeVideo = () => {
    setVideo(null);
    setCompressedVideo(null);
    setCompressedPreview("");
    setExistingVideo(undefined);
    setCompressionInfo(null);
    setCompressionProgress(0);
  };

  // ======================================================
  // REACT QUERY MUTATION
  // ======================================================

  const mutation = useMutation({
    mutationFn: (fd: FormData) =>
      isEdit
        ? adminUpdateMedia(item!._id, fd)
        : adminCreateMedia(fd),

    onSuccess: () => {
      toast.success(
        isEdit ? "Training updated!" : "Training published!"
      );

      onSaved();
      onClose();
    },

    onError: (err: Error) => {
      toast.error(err?.message || "Upload failed — please try again");
    },
  });

  // ======================================================
  // PUBLISH OR UPDATE LESSON
  // ======================================================

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }

    const totalImages = existingImages.length + images.length;

    if (totalImages === 0) {
      toast.error("Please add at least one image");
      return;
    }

    if (isCompressing || mutation.isPending) return;

    // Never upload the original uncompressed video.
    if (video && !compressedVideo) {
      toast.error(
        "Video compression is not complete. Please select the video again."
      );
      return;
    }

    const fd = new FormData();

    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("category", category.trim());

    images.forEach((image) => {
      fd.append("images", image);
    });

    // Only the compressed video is sent to the backend.
    if (compressedVideo) {
      fd.append("video", compressedVideo);
    }

    // Preserve existing server images and video when editing.
    if (isEdit) {
      existingImages.forEach((url) => {
        fd.append("existingImages", url);
      });

      if (existingVideo) {
        fd.append("existingVideo", existingVideo);
      }
    }

    mutation.mutate(fd);
  };

  const isBusy = mutation.isPending || isCompressing;

  // ======================================================
  // MODAL UI
  // ======================================================

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-lg
        overflow-hidden flex flex-col shadow-2xl max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-border/60 flex justify-between items-center bg-brand-raised/50">
          <h2 className="text-white font-bold text-lg">
            {isEdit ? "Edit Training" : "Upload New Training"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="text-brand-subtle hover:text-white transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-sm">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
              Training Title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Interior Painting Techniques"
              disabled={isBusy}
              className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
                p-2.5 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
              Description *
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this Training covers..."
              disabled={isBusy}
              className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
                p-2.5 focus:outline-none focus:border-brand-accent/50 resize-none transition-colors"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
              Category *
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Surface Preparation"
              disabled={isBusy}
              className="w-full bg-brand-raised text-white border border-brand-border rounded-lg
                p-2.5 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider">
              Images <span className="text-red-400">*</span>

              <span className="text-brand-subtle ml-1 normal-case font-normal">
                (at least 1)
              </span>
            </label>

            <label
              className={`border border-dashed border-brand-border hover:border-brand-accent/50
              rounded-xl p-4 text-center bg-brand-raised/20 transition-all block
              ${isBusy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <UploadCloud
                className="text-brand-subtle mx-auto mb-1"
                size={22}
              />

              <p className="text-xs text-brand-mid">
                Click to add images
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={isBusy}
                onChange={handleImageChange}
              />
            </label>

            {/* Image previews */}
            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-1">

                {existingImages.map((src, i) => (
                  <div
                    key={`ex-${i}`}
                    className="relative w-14 h-14 rounded-lg border border-brand-border overflow-hidden group"
                  >
                    <img
                      src={src}
                      className="object-cover w-full h-full"
                      alt=""
                    />

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        setExistingImages((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="absolute top-0.5 right-0.5 bg-black/80 text-red-400
                        p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {imagePreviews.map((src, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative w-14 h-14 rounded-lg border border-brand-accent/40 overflow-hidden group"
                  >
                    <img
                      src={src}
                      className="object-cover w-full h-full"
                      alt=""
                    />

                    <span
                      className="absolute bottom-0 inset-x-0 bg-brand-accent text-brand-black
                      text-[8px] font-bold text-center py-0.5 uppercase"
                    >
                      New
                    </span>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => removeNewImage(i)}
                      className="absolute top-0.5 right-0.5 bg-black/80 text-red-400
                        p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Video */}
          <div className="flex flex-col gap-2">

            <label className="text-brand-mid text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>
                Video{" "}
                <span className="font-normal normal-case text-brand-subtle">
                  (optional, max 50 MB)
                </span>
              </span>

              {(video || existingVideo) && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={removeVideo}
                  className="text-red-400 hover:text-red-300 text-[11px] normal-case font-normal
                    flex items-center gap-1 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={11} /> Remove video
                </button>
              )}
            </label>

            {/* Video selector */}
            <label
              className={`border border-dashed border-brand-border hover:border-brand-accent/50
              rounded-xl p-4 text-center bg-brand-raised/20 transition-all block
              ${isBusy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <Video
                className="text-brand-subtle mx-auto mb-1"
                size={22}
              />

              <p className="text-xs text-brand-mid truncate px-2">
                {video
                  ? `✓ ${video.name} (${formatFileSize(video.size)})`
                  : existingVideo
                  ? "✓ Video already uploaded — click to replace"
                  : "Click to select video (max 50 MB)"}
              </p>

              <input
                type="file"
                accept="video/*"
                hidden
                disabled={isBusy}
                onChange={handleVideoChange}
              />
            </label>

            {/* Compression progress */}
            {isCompressing && (
              <div className="bg-brand-raised border border-brand-accent/30 rounded-lg p-3 flex flex-col gap-2">

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-brand-accent font-semibold">
                    <Film size={14} />
                    Compressing video...
                  </span>

                  <span className="text-white font-semibold">
                    {compressionProgress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent rounded-full transition-all duration-300"
                    style={{
                      width: `${compressionProgress}%`,
                    }}
                  />
                </div>

                <p className="text-brand-subtle text-[10px]">
                  Processing locally in your browser. Nothing is being
                  uploaded. Please keep this page open.
                </p>
              </div>
            )}

            {/* Compression results and preview */}
            {compressionInfo && compressedVideo && (
              <div className="bg-brand-raised border border-brand-border rounded-lg p-3 flex flex-col gap-3">

                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                  <CheckCircle size={14} />
                  Video compression completed
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-brand-subtle">
                      Original size
                    </p>

                    <p className="text-white font-semibold">
                      {formatFileSize(compressionInfo.original)}
                    </p>
                  </div>

                  <div>
                    <p className="text-brand-subtle">
                      Compressed size
                    </p>

                    <p className="text-brand-accent font-semibold">
                      {formatFileSize(compressionInfo.compressed)}
                    </p>
                  </div>
                </div>

                {compressionInfo.compressed < compressionInfo.original ? (
                  <p className="text-green-400 text-xs">
                    Size reduced by{" "}
                    {(
                      ((compressionInfo.original -
                        compressionInfo.compressed) /
                        compressionInfo.original) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                ) : (
                  <p className="text-yellow-400 text-xs">
                    The converted video is not smaller than the original.
                    Review the preview before publishing.
                  </p>
                )}

                <div>
                  <p className="text-brand-mid text-xs mb-2">
                    Compressed video preview
                  </p>

                  <video
                    src={compressedPreview}
                    controls
                    preload="none"
                    playsInline
                    className="w-full rounded-lg max-h-56 bg-black"
                  />
                </div>

                <p className="text-brand-subtle text-[10px]">
                  This preview is stored locally in your browser.
                  It has not been uploaded.
                </p>
              </div>
            )}

            {/* Upload progress */}
            {mutation.isPending && (
              <div className="flex items-center gap-2 text-brand-accent text-xs bg-brand-raised
                border border-brand-accent/20 rounded-lg px-3 py-2"
              >
                <Loader
                  size={12}
                  className="animate-spin flex-shrink-0"
                />

                Uploading training to the server. Please wait...
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-raised/50 border-t border-brand-border/60 flex justify-end gap-2">

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="px-4 py-2 border border-brand-border text-brand-mid rounded-lg text-xs
              hover:text-white transition-colors disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            className="flex items-center gap-2 px-5 py-2 bg-brand-accent text-brand-black
              font-semibold rounded-lg text-xs hover:bg-brand-accent-lt transition-colors disabled:opacity-50"
          >
            {isBusy && (
              <Loader size={13} className="animate-spin" />
            )}

            {isCompressing
              ? "Compressing..."
              : mutation.isPending
              ? "Uploading..."
              : isEdit
              ? "Save Changes"
              : "Publish Training"}
          </button>

        </div>
      </div>
    </div>
  );
}

// ======================================================
// MAIN ADMIN LESSON PAGE
// ======================================================

export default function AdminLessonsPage() {
  const qc = useQueryClient();

  const [modalItem, setModalItem] = useState<
    MediaItem | null | undefined
  >(undefined);

  // undefined = closed
  // null = create new
  // MediaItem = editing

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
      qc.invalidateQueries({
        queryKey: ["admin-all-media"],
      });

      toast.success("Training deleted");
    },

    onError: (err: Error) => {
      toast.error(err?.message || "Delete failed");
    },
  });

  const list = data ?? [];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Training
          </h1>

          <p className="text-brand-mid text-sm mt-1">
            Upload and manage media training
          </p>
        </div>

        <button
          onClick={() => setModalItem(null)}
          className="flex items-center gap-2 bg-brand-accent text-brand-black font-semibold
            px-5 py-2.5 rounded-md hover:bg-brand-accent-lt transition-colors text-sm"
        >
          <Plus size={16} /> Add New Training
        </button>

      </div>

      {/* Training Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader
            className="animate-spin text-brand-accent"
            size={32}
          />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-brand-border/30 rounded-2xl">

          <FileText
            className="text-brand-subtle mx-auto mb-3"
            size={40}
          />

          <p className="text-brand-mid text-sm">
            No Trainings yet. Add your first one.
          </p>

        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {list.map((item) => (
            <div
              key={item._id}
              className="bg-brand-card border border-brand-border rounded-xl overflow-hidden
                flex flex-col hover:border-brand-accent/30 transition-all group"
            >

              {/* Thumbnail */}
              <div className="h-40 bg-brand-raised relative overflow-hidden flex items-center justify-center">

                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <ImageIcon
                    className="text-brand-subtle"
                    size={28}
                  />
                )}

                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">

                  <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded
                    backdrop-blur-sm flex items-center gap-1"
                  >
                    <ImageIcon size={9} />
                    {item.images?.length ?? 0}
                  </span>

                  {item.video && (
                    <span className="bg-brand-accent text-brand-black text-[10px] px-2 py-0.5
                      rounded font-bold flex items-center gap-1"
                    >
                      <Video size={9} /> Video
                    </span>
                  )}

                </div>
              </div>

              {/* Information */}
              <div className="p-4 flex flex-col gap-2 flex-1">

                <h3 className="font-bold text-sm text-white truncate">
                  {item.title}
                </h3>

                <p className="text-brand-mid text-xs line-clamp-2 flex-1">
                  {item.description}
                </p>

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
                    onClick={() => {
                      if (confirm("Delete this training?")) {
                        deleteMutation.mutate(item._id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 text-red-500
                      hover:text-red-400 hover:bg-red-900/10 py-1.5 rounded-md text-xs transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={12} /> Delete
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Modal */}
      {modalItem !== undefined && (
        <LessonModal
          item={modalItem}
          onClose={() => setModalItem(undefined)}
          onSaved={() =>
            qc.invalidateQueries({
              queryKey: ["admin-all-media"],
            })
          }
        />
      )}

    </div>
  );
}
