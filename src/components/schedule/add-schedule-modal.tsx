"use client";

import { useState, useRef } from "react";
import { X, Loader2, Plus, Trash2, Upload, FileText, Link as LinkIcon } from "lucide-react";
import { DAY_NAMES, SCHEDULE_CATEGORIES } from "@/types/schedule";
import type { ScheduleFormData } from "@/types/schedule";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData, materialFile: File | null) => Promise<void>;
  defaultDay?: number;
}

export default function AddScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  defaultDay,
}: AddScheduleModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ScheduleFormData>({
    subject: "",
    lecturer: "",
    day_of_week: defaultDay ?? new Date().getDay(),
    start_time: "08:00",
    end_time: "10:00",
    room: "",
    notes: "",
    material_url: "",
    category: "KP",
  });
  const [plenoLecturers, setPlenoLecturers] = useState<string[]>([""]);
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [materialMode, setMaterialMode] = useState<"link" | "file">("link");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPleno = formData.category === "Pleno";

  const addPlenoLecturer = () => setPlenoLecturers((prev) => [...prev, ""]);
  const removePlenoLecturer = (idx: number) => {
    if (plenoLecturers.length <= 1) return;
    setPlenoLecturers((prev) => prev.filter((_, i) => i !== idx));
  };
  const updatePlenoLecturer = (idx: number, value: string) => {
    setPlenoLecturers((prev) => prev.map((l, i) => (i === idx ? value : l)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Ukuran file maksimal 10MB."); return; }
    setMaterialFile(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim()) { setError("Nama mata kuliah wajib diisi."); return; }
    if (formData.start_time >= formData.end_time) { setError("Waktu selesai harus setelah waktu mulai."); return; }

    // Combine pleno lecturers into single string separated by ;
    const lecturerValue = isPleno
      ? plenoLecturers.filter((l) => l.trim()).join("; ")
      : formData.lecturer;

    setLoading(true);
    try {
      await onSubmit(
        { ...formData, lecturer: lecturerValue },
        materialMode === "file" ? materialFile : null
      );
      // Reset
      setFormData({
        subject: "", lecturer: "",
        day_of_week: defaultDay ?? new Date().getDay(),
        start_time: "08:00", end_time: "10:00",
        room: "", notes: "", material_url: "", category: "KP",
      });
      setPlenoLecturers([""]);
      setMaterialFile(null);
      setMaterialMode("link");
      onClose();
    } catch {
      setError("Gagal menambahkan jadwal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-primary-container">Tambah Jadwal</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"><X className="w-5 h-5" /></button>
        </div>

        {error && <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Kategori *</label>
            <select
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              disabled={loading}
            >
              {SCHEDULE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Mata Kuliah *</label>
            <input className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" placeholder="Anatomi Manusia Dasar" value={formData.subject || ""} onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))} disabled={loading} />
          </div>

          {/* Lecturer - different for Pleno */}
          {isPleno ? (
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Dosen / Narasumber (bisa lebih dari 1)</label>
              <div className="space-y-2">
                {plenoLecturers.map((lec, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 outline-none"
                      placeholder={`Narasumber ${idx + 1}`}
                      value={lec}
                      onChange={(e) => updatePlenoLecturer(idx, e.target.value)}
                      disabled={loading}
                    />
                    {plenoLecturers.length > 1 && (
                      <button type="button" onClick={() => removePlenoLecturer(idx)} className="p-2 text-error hover:bg-error/5 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addPlenoLecturer} className="flex items-center gap-2 text-sm text-primary-400 font-semibold hover:underline">
                  <Plus className="w-4 h-4" /> Tambah Narasumber
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Dosen Pengampu</label>
              <input className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" placeholder="Dr. dr. Hendra Wijaya, Sp.An" value={formData.lecturer || ""} onChange={(e) => setFormData((p) => ({ ...p, lecturer: e.target.value }))} disabled={loading} />
            </div>
          )}

          {/* Day */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Hari *</label>
            <select className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" value={formData.day_of_week} onChange={(e) => setFormData((p) => ({ ...p, day_of_week: parseInt(e.target.value) }))} disabled={loading}>
              {DAY_NAMES.map((name, i) => (<option key={i} value={i}>{name}</option>))}
            </select>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Jam Mulai *</label>
              <input type="time" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" value={formData.start_time || ""} onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))} disabled={loading} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Jam Selesai *</label>
              <input type="time" className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" value={formData.end_time || ""} onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))} disabled={loading} />
            </div>
          </div>

          {/* Room */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Ruangan</label>
            <input className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" placeholder="Ruang Kuliah Utama A" value={formData.room || ""} onChange={(e) => setFormData((p) => ({ ...p, room: e.target.value }))} disabled={loading} />
          </div>

          <div className="border-t border-slate-100 pt-2" />

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Catatan Kecil</label>
            <textarea className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none resize-none" placeholder="Bawa jas lab, kumpulkan laporan sebelum kelas..." rows={3} value={formData.notes || ""} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} disabled={loading} />
          </div>

          {/* Material Upload - Dual Mode */}
          <div className="space-y-3">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">Materi Dosen</label>
            {/* Mode toggle */}
            <div className="flex bg-secondary-100 p-1 rounded-lg">
              <button type="button" onClick={() => setMaterialMode("link")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${materialMode === "link" ? "bg-white text-primary-container shadow-sm" : "text-secondary"}`}>
                <LinkIcon className="w-3.5 h-3.5" /> Link URL
              </button>
              <button type="button" onClick={() => setMaterialMode("file")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${materialMode === "file" ? "bg-white text-primary-container shadow-sm" : "text-secondary"}`}>
                <Upload className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            {materialMode === "link" ? (
              <div className="space-y-1">
                <input className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none" placeholder="https://drive.google.com/..." type="url" value={formData.material_url || ""} onChange={(e) => setFormData((p) => ({ ...p, material_url: e.target.value }))} disabled={loading} />
                <p className="text-[10px] text-slate-400">Link Google Drive, Dropbox, atau URL lainnya</p>
              </div>
            ) : (
              <div className="space-y-1">
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.zip" className="hidden" onChange={handleFileChange} disabled={loading} />
                {materialFile ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-xl">
                    <FileText className="w-5 h-5 text-primary-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary-container font-medium truncate">{materialFile.name}</p>
                      <p className="text-[10px] text-secondary">{(materialFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={() => { setMaterialFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="p-1 text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-outline-variant rounded-xl text-sm text-secondary hover:border-primary-400 hover:text-primary-400 transition-all">
                    <Upload className="w-4 h-4" /> Upload file (PDF, PPT, DOC, dll)
                  </button>
                )}
                <p className="text-[10px] text-slate-400">Maksimal 10MB</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full bg-primary-container text-white py-4 rounded-xl font-[var(--font-heading)] font-bold text-base shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : "Tambah Jadwal"}
          </button>
        </form>
      </div>
    </div>
  );
}

