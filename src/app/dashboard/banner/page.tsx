"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Plus, Edit2, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adminGetAllHeroBanners,
  adminCreateHeroBanner,
  adminUpdateHeroBanner,
  adminDeleteHeroBanner,
} from "../../../lib/adminApi"; 
import Image from "next/image";// Update import path accordingly

// --- Types ---
export interface HeroBanner {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  displayOrder?: number | null;
  imageUrl?: string;
  image?: {
    url: string;
    publicId?: string;
  } | string;
}

export interface BannerFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
//   displayOrder: string;
}

const initialFormState: BannerFormData = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  buttonLink: "",
//   displayOrder: "1",
};

export default function AdminBannerManager() {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BannerFormData>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // --- Fetch Banners with useQuery ---
  const {
    data: banners = [],
    isLoading,
    isError,
    error,
  } = useQuery<HeroBanner[]>({
    queryKey: ["heroBanners"],
    queryFn: async () => {
      const response = await adminGetAllHeroBanners();
      console.log("Raw API Response:", response)
      return Array.isArray(response) ? response : response?. heroes || [];
    },
  });
console.log('ban', banners)
  // --- Reset Form Helper ---
  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setImageFile(null);
    setPreviewUrl("");
  };

  // --- Create / Update Mutation ---
  const saveBannerMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      if (editingId) {
        return await adminUpdateHeroBanner(editingId, payload);
      }
      return await adminCreateHeroBanner(payload);
    },
    onSuccess: () => {
      toast.success(
        editingId ? "Hero banner updated successfully!" : "Hero banner created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      resetForm();
    },
    onError: (err: Error) => {
      console.error("Error submitting banner:", err);
      toast.error(err.message || "Failed to save banner. Please try again.");
    },
  });

  // --- Delete Mutation ---
  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await adminDeleteHeroBanner(id);
    },
    onSuccess: () => {
      toast.success("Hero banner deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
    },
    onError: (err: Error) => {
      console.error("Failed to delete banner:", err);
      toast.error(err.message || "Failed to delete banner.");
    },
  });

  // --- Event Handlers ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEdit = (banner: HeroBanner) => {
  const id = banner._id || banner.id;
  if (!id) return;

  setEditingId(id);
  setFormData({
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    description: banner.description || "",
    buttonText: banner.buttonText || "",
    buttonLink: banner.buttonLink || "",
    // displayOrder: String(banner.displayOrder ?? 1),
  });

  // Safely get a string URL regardless of whether 'image' is an object or string
  const imageUrl =
    typeof banner.image === "object"
      ? banner.image?.url
      : banner.imageUrl || banner.image || "";

  setPreviewUrl(imageUrl);
  setImageFile(null);
};

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("subtitle", formData.subtitle);
    payload.append("description", formData.description);
    payload.append("buttonText", formData.buttonText);
    payload.append("buttonLink", formData.buttonLink);
    // payload.append("displayOrder", formData.displayOrder);

    if (imageFile) {
      payload.append("image", imageFile);
    }

    saveBannerMutation.mutate(payload);
  };
  

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    deleteBannerMutation.mutate(id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-white">Hero Banner Management</h1>
        <p className="text-brand-mid text-sm">
          Create, update, and reorder homepage hero slides.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-brand-card border border-brand-mid/20 rounded-2xl p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-white">
              {editingId ? "Edit Hero Banner" : "Create Hero Banner"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-brand-accent hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-xs font-medium text-brand-mid block mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Premium Paint Collection"
                className="w-full bg-brand-black/50 border border-brand-mid/30 rounded-xl px-3.5 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-accent"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-xs font-medium text-brand-mid block mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. Bring Colour To Life"
                className="w-full bg-brand-black/50 border border-brand-mid/30 rounded-xl px-3.5 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-accent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-brand-mid block mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief summary..."
                className="w-full bg-brand-black/50 border border-brand-mid/30 rounded-xl px-3.5 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-accent resize-none"
              />
            </div>

            {/* Button Text & Button Link */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-brand-mid block mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  placeholder="e.g. Shop Now"
                  className="w-full bg-brand-black/50 border border-brand-mid/30 rounded-xl px-3.5 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-mid block mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  placeholder="e.g. /products"
                  className="w-full bg-brand-black/50 border border-brand-mid/30 rounded-xl px-3.5 py-2 text-sm text-brand-white focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            {/* Display Order */}
         

            {/* Image Upload */}
            <div>
              <label className="text-xs font-medium text-brand-mid block mb-1">
                Banner Image
              </label>
              <div className="border-2 border-dashed border-brand-mid/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer relative hover:border-brand-accent/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <Image width={100}
                  height={100}
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="text-brand-mid" size={24} />
                    <span className="text-xs text-brand-mid">
                      Click or drag image to upload
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saveBannerMutation.isPending}
              className="mt-2 bg-brand-accent text-brand-black font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {saveBannerMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                "Update Banner"
              ) : (
                <>
                  <Plus size={16} /> Create Banner
                </>
              )}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-brand-white">All Banners</h2>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-brand-accent" size={32} />
            </div>
          ) : isError ? (
            <div className="bg-brand-card border border-red-500/30 text-red-400 rounded-2xl p-8 text-center text-sm">
              Failed to load hero banners: {(error as Error)?.message || "Unknown error"}
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-brand-card border border-brand-mid/20 rounded-2xl p-8 text-center text-brand-mid">
              No hero banners found.
            </div>
          ) : (
            // <div className="grid gap-4">
            //   {banners.map((item) => {
            //     const bannerId = item._id || item.id;
            //     const isDeletingThis =
            //       deleteBannerMutation.isPending &&
            //       deleteBannerMutation.variables === bannerId;

            //     return (
            //       <div
            //         key={bannerId}
            //         className="bg-brand-card border border-brand-mid/20 rounded-2xl p-4 flex gap-4 items-center group"
            //       >
            //         <div className="w-24 h-20 bg-brand-black rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center">
            //           {item.imageUrl || item.image ? (
            //             <Image
            //             src={item.ur}
            //             width={100}
            //             height={100}

            //             //   src={item.imageUrl || item.image}
            //               alt={item.title}
            //               className="w-full h-full object-cover"
            //             />
            //           ) : (
            //             <ImageIcon className="text-brand-mid/40" size={24} />
            //           )}
            //           <span className="absolute top-1 left-1 bg-brand-black/80 text-brand-accent text-[10px] px-1.5 py-0.5 rounded font-mono">
            //             #{item.displayOrder ?? 1}
            //           </span>
            //         </div>

            //         <div className="flex-1 min-w-0">
            //           <h3 className="text-sm font-semibold text-brand-white truncate">
            //             {item.title}
            //           </h3>
            //           <p className="text-xs text-brand-accent truncate">
            //             {item.subtitle}
            //           </p>
            //           <p className="text-xs text-brand-mid line-clamp-1 mt-1">
            //             {item.description}
            //           </p>
            //         </div>

            //         <div className="flex items-center gap-2 border-l border-brand-mid/20 pl-4">
            //           <button
            //             type="button"
            //             onClick={() => handleEdit(item)}
            //             className="p-2 text-brand-mid hover:text-brand-accent transition-colors"
            //             title="Edit"
            //           >
            //             <Edit2 size={16} />
            //           </button>
            //           <button
            //             type="button"
            //             onClick={() => handleDelete(bannerId)}
            //             disabled={isDeletingThis}
            //             className="p-2 text-brand-mid hover:text-red-400 transition-colors disabled:opacity-50"
            //             title="Delete"
            //           >
            //             {isDeletingThis ? (
            //               <Loader2 size={16} className="animate-spin text-red-400" />
            //             ) : (
            //               <Trash2 size={16} />
            //             )}
            //           </button>
            //         </div>
            //       </div>
            //     );
            //   })}
            // </div>
            <div className="grid gap-4">
  {banners.map((item) => {
    const bannerId = item._id || item.id;
    const isDeletingThis =
      deleteBannerMutation.isPending &&
      deleteBannerMutation.variables === bannerId;

    // Correctly safely extract the Cloudinary URL from the image object or string
    const imageUrl =
      typeof item.image === "object" && item.image?.url
        ? item.image.url
        : typeof item.image === "string"
        ? item.image
        : item.imageUrl || "";

    return (
      <div
        key={bannerId}
        className="bg-brand-card border border-brand-mid/20 rounded-2xl p-4 flex gap-4 items-center group"
      >
        <div className="w-24 h-20 bg-brand-black rounded-lg overflow-hidden flex-shrink-0 relative flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title || "Hero banner"}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <ImageIcon className="text-brand-mid/40" size={24} />
          )}
          <span className="absolute top-1 left-1 bg-brand-black/80 text-brand-accent text-[10px] px-1.5 py-0.5 rounded font-mono z-10">
            #{item.displayOrder ?? 1}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-brand-white truncate">
            {item.title}
          </h3>
          <p className="text-xs text-brand-accent truncate">
            {item.subtitle}
          </p>
          <p className="text-xs text-brand-mid line-clamp-1 mt-1">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-2 border-l border-brand-mid/20 pl-4">
          <button
            type="button"
            onClick={() => handleEdit(item)}
            className="p-2 text-brand-mid hover:text-brand-accent transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(bannerId)}
            disabled={isDeletingThis}
            className="p-2 text-brand-mid hover:text-red-400 transition-colors disabled:opacity-50"
            title="Delete"
          >
            {isDeletingThis ? (
              <Loader2 size={16} className="animate-spin text-red-400" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    );
  })}
</div>
          )}
        </div>
      </div>
    </div>
  );
}

