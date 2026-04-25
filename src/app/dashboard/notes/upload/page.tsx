"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CloudUpload,
  FileText,
  X,
  Upload,
  Loader2,
  Lightbulb,
  Globe,
} from "lucide-react";

export default function UploadNotesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [pageCount, setPageCount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) {
      setError("Ukuran file maksimal 20MB.");
      return;
    }
    setFile(f);
    setError(null);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Judul wajib diisi."); return; }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category || "notes");
    formData.append("page_count", pageCount);
    if (file) formData.append("file", file);

    const res = await fetch("/api/materials", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal mengupload.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/notes");
  };

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="space-y-1 mb-8">
        <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container">
          Unggah Catatan
        </h2>
        <p className="text-sm text-on-surface-variant">
          Bagikan catatan belajar Anda dengan komunitas Craniora.
        </p>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-card rounded-xl border border-primary-50 shadow-sm p-6 space-y-6">
        {/* File Dropzone */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            File Catatan
          </label>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-xl">
              <FileText className="w-5 h-5 text-primary-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary-container font-medium truncate">{file.name}</p>
                <p className="text-[10px] text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-secondary-100/50 hover:bg-secondary-container transition-colors cursor-pointer hover:border-primary-400"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4 text-primary-400">
                <CloudUpload className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-primary-container text-center">
                Tarik file ke sini atau klik
              </p>
              <p className="text-sm text-slate-500 text-center mt-1">
                PDF, JPG, PNG, DOC, PPT (Maks. 20MB)
              </p>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            Judul Dokumen
          </label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none text-base"
            placeholder="Ringkasan Anatomi Kardiovaskular"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            Mata Kuliah / Subjek
          </label>
          <select
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none text-base bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="">Pilih Subjek</option>
            <option value="Anatomi">Anatomi</option>
            <option value="Fisiologi">Fisiologi</option>
            <option value="Biokimia">Biokimia</option>
            <option value="Farmakologi">Farmakologi</option>
            <option value="Patologi">Patologi Klinik</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            Deskripsi Singkat
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none text-base resize-none"
            placeholder="Jelaskan isi catatan Anda..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Page count */}
        <div className="space-y-2">
          <label className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            Jumlah Halaman
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none text-base"
            placeholder="12"
            value={pageCount}
            onChange={(e) => setPageCount(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Visibility */}
        <div className="flex items-center justify-between p-4 bg-secondary-100 rounded-lg">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary-container" />
            <div>
              <span className="text-base font-semibold text-primary-container">Publik</span>
              <p className="text-sm text-on-surface-variant">Izinkan mahasiswa lain melihat</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-11 h-6 rounded-full transition-colors relative ${isPublic ? "bg-primary-container" : "bg-slate-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-container text-white py-4 rounded-lg font-[var(--font-heading)] font-semibold text-xl flex items-center justify-center gap-2 hover:bg-primary-400 active:scale-[0.98] transition-all shadow-md disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          {loading ? "Mengupload..." : "Simpan & Unggah"}
        </button>
      </form>

      {/* Tip */}
      <div className="mt-6 bg-warning/5 border border-warning/20 rounded-xl p-4 flex gap-4">
        <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-on-surface-variant">
          Tip: Catatan yang terstruktur dengan poin-poin mendapatkan rating lebih tinggi dari komunitas.
        </p>
      </div>
    </main>
  );
}
