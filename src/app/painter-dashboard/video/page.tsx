"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { painterUploadVerificationVideo } from "@/lib/painterApi";
import { 
  Video, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  Loader, 
  AlertCircle 
} from "lucide-react";

export default function UploadVerificationVideoPage() {
  const qc = useQueryClient();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up the preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Basic validation (e.g., 50MB limit)
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File is too large. Please select a video under ${MAX_SIZE_MB}MB.`);
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }

    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setVideoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("verificationVideo", file);
      return painterUploadVerificationVideo(formData);
    },
    onSuccess: () => {
      toast.success("Verification video uploaded successfully!");
      // Invalidate status queries so the app knows the video is submitted
      qc.invalidateQueries({ queryKey: ["painters-status"] });
      qc.invalidateQueries({ queryKey: ["painter-profile"] });
      
      // Clear form on success
      handleRemoveFile();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload video.");
    },
  });

  const handleSubmit = () => {
    if (!videoFile) {
      toast.error("Please select a video first.");
      return;
    }
    uploadMutation.mutate(videoFile);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-white flex items-center gap-2">
          <Video className="text-brand-accent" /> Identity Verification
        </h1>
        <p className="text-brand-mid text-sm mt-1">
          Upload a short video introducing yourself and stating your intention to join our platform.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-brand-card border border-brand-mid/30 rounded-xl p-6 shadow-sm">
        
        {/* Guidelines */}
        <div className="mb-6 bg-brand-black/40 border border-brand-mid/20 p-4 rounded-lg flex gap-3">
          <AlertCircle className="text-brand-accent shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-brand-lt-gray space-y-1.5">
            <p className="font-medium text-brand-white">Video Guidelines:</p>
            <ul className="list-disc pl-4 text-brand-mid space-y-1">
              <li>Ensure you are in a well-lit area.</li>
              <li>State your full name clearly.</li>
              <li>Show your face clearly to the camera.</li>
              <li>Keep the video under 60 seconds (Max size: 50MB).</li>
            </ul>
          </div>
        </div>

        {/* Upload Area / Preview */}
        {!videoFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-brand-mid/40 hover:border-brand-accent/60 bg-brand-black/20 hover:bg-brand-black/40 rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 bg-brand-card rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="text-brand-accent" size={24} />
            </div>
            <div className="text-center">
              <p className="text-brand-white font-medium mb-1">Click to browse or drag video here</p>
              <p className="text-brand-mid text-xs">Supports MP4, MOV, WEBM</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-brand-mid/30 bg-black aspect-video max-h-[400px] flex items-center justify-center">
              <video 
                src={previewUrl!} 
                controls 
                className="w-full h-full object-contain"
              />
              <button
                onClick={handleRemoveFile}
                disabled={uploadMutation.isPending}
                className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors z-10 disabled:opacity-50"
                title="Remove video"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-mid truncate max-w-[70%]">
                {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
          </div>
        )}

        {/* Hidden Input */}
        <input 
          type="file"
          ref={fileInputRef}
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Actions */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!videoFile || uploadMutation.isPending}
            className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent/90 text-brand-black font-semibold py-2.5 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {uploadMutation.isPending ? "Uploading..." : "Submit Video"}
          </button>
        </div>
      </div>
    </div>
  );
}