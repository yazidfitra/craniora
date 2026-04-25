"use client";

import { useState, useRef } from "react";
import { X, Loader2, Upload, FileText } from "lucide-react";
import type { MaterialFormData } from "@/types/material";

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormData, file: File | null) => Promise<void>;
}

export default function UploadMaterialModal({
  isOpen,
  onClose,
  onSubmit,
}: UploadMaterialModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<MaterialFormData>({
    title: "",
    description: "",
    category: "notes",
    page_count: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("Ukuran file maksimal 10MB.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData, file);
      setFormData({ title: "", description: "", category: "notes", page_count: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onClose();
    } catch {
      setError("Gagal mengupload materi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-primary-container">
            Bagikan Materi
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Judul *
            </label>
            <input
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              placeholder="Rangkuman Anatomi Sistem Saraf"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Deskripsi
            </label>
            <textarea
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none resize-none"
              placeholder="Deskripsi singkat tentang materi ini..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          {/* Category + Page Count */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
                Kategori *
              </label>
              <select
                className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    category: e.target.value as MaterialFormData["category"],
                  }))
                }
                disabled={loading}
              >
                <option value="notes">Catatan Kuliah</option>
                <option value="questions">Bank Soal</option>
                <option value="flashcards">Flashcards</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
                Jumlah Halaman
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
                placeholder="12"
                value={formData.page_count}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, page_count: e.target.value }))
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              File Materi
            </label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
              onChange={handleFileChange}
              disabled={loading}
            />
            {file ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-xl">
                <FileText className="w-5 h-5 text-primary-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary-container font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="p-1 rounded-lg hover:bg-white/50 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-outline-variant rounded-xl text-sm text-secondary hover:border-primary-400 hover:text-primary-400 transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload file (PDF, PPT, DOC, dll)
              </button>
            )}
            <p className="text-[10px] text-slate-400">Maksimal 10MB</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-white py-4 rounded-xl font-[var(--font-heading)] font-bold text-base shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengupload...
              </>
            ) : (
              "Bagikan Materi"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
