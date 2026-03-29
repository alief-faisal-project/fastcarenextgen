"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageGalleryManagerProps {
  readonly images: string[];
  readonly onImagesChange: (images: string[]) => void;
  readonly isLoading?: boolean;
  readonly onUpload: (file: File) => Promise<string>;
}

export default function ImageGalleryManager({
  images,
  onImagesChange,
  isLoading = false,
  onUpload,
}: ImageGalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPEG, PNG, WebP, dll)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await onUpload(file);
      const newImages = [...images, uploadedUrl];
      onImagesChange(newImages);
      toast.success("Gambar berhasil ditambahkan");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files?.[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success("Gambar dihapus");
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    onImagesChange(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <button
        type="button"
        onClick={() => document.getElementById("gallery-upload")?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        disabled={uploading || isLoading}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="gallery-upload"
          disabled={uploading || isLoading}
          aria-label="Upload gambar rumah sakit"
        />
        <div className="flex flex-col items-center space-y-2">
          <i className="fa-solid fa-cloud-arrow-up text-4xl text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              Klik untuk pilih gambar atau seret ke sini
            </p>
            <p className="text-sm text-muted-foreground">
              Format: JPG, PNG, WebP (Maks 5MB)
            </p>
          </div>
        </div>
      </button>

      {/* Image Gallery Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Galeri Gambar ({images.length})
            </h3>
            {images.length > 0 && (
              <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                Seret untuk mengubah urutan
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200"
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Move Up */}
                    {index > 0 && (
                      <button
                        onClick={() => moveImageUp(index)}
                        className="p-2 bg-white/90 hover:bg-white text-black rounded transition-colors"
                        title="Pindah ke atas"
                      >
                        <i className="fa-solid fa-arrow-up text-sm" />
                      </button>
                    )}

                    {/* Move Down */}
                    {index < images.length - 1 && (
                      <button
                        onClick={() => moveImageDown(index)}
                        className="p-2 bg-white/90 hover:bg-white text-black rounded transition-colors"
                        title="Pindah ke bawah"
                      >
                        <i className="fa-solid fa-arrow-down text-sm" />
                      </button>
                    )}

                    {/* Remove */}
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded transition-colors"
                      title="Hapus gambar"
                    >
                      <i className="fa-solid fa-trash text-sm" />
                    </button>
                  </div>
                </div>

                {/* Index Badge */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <i className="fa-solid fa-image text-3xl mb-3 block" />
          <p>Belum ada gambar. Unggah gambar pertama Anda.</p>
        </div>
      )}
    </div>
  );
}
