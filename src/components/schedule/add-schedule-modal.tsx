"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { DAY_NAMES } from "@/types/schedule";
import type { ScheduleFormData } from "@/types/schedule";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  defaultDay?: number;
}

export default function AddScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  defaultDay,
}: AddScheduleModalProps) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    subject: "",
    lecturer: "",
    day_of_week: defaultDay ?? new Date().getDay(),
    start_time: "08:00",
    end_time: "10:00",
    room: "",
    notes: "",
    material_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim()) {
      setError("Nama mata kuliah wajib diisi.");
      return;
    }
    if (formData.start_time >= formData.end_time) {
      setError("Waktu selesai harus setelah waktu mulai.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        subject: "",
        lecturer: "",
        day_of_week: defaultDay ?? new Date().getDay(),
        start_time: "08:00",
        end_time: "10:00",
        room: "",
        notes: "",
        material_url: "",
      });
      onClose();
    } catch {
      setError("Gagal menambahkan jadwal.");
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
            Tambah Jadwal
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
          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Mata Kuliah *
            </label>
            <input
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              placeholder="Anatomi Manusia Dasar"
              value={formData.subject}
              onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Dosen Pengampu
            </label>
            <input
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              placeholder="Dr. dr. Hendra Wijaya, Sp.An"
              value={formData.lecturer}
              onChange={(e) => setFormData((p) => ({ ...p, lecturer: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Hari *
            </label>
            <select
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              value={formData.day_of_week}
              onChange={(e) => setFormData((p) => ({ ...p, day_of_week: parseInt(e.target.value) }))}
              disabled={loading}
            >
              {DAY_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
                Jam Mulai *
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
                value={formData.start_time}
                onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
                Jam Selesai *
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
                value={formData.end_time}
                onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Ruangan
            </label>
            <input
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              placeholder="Ruang Kuliah Utama A"
              value={formData.room}
              onChange={(e) => setFormData((p) => ({ ...p, room: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="border-t border-slate-100 pt-2" />

          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Catatan Kecil
            </label>
            <textarea
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none resize-none"
              placeholder="Bawa jas lab, kumpulkan laporan sebelum kelas..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-secondary uppercase block font-bold tracking-wider">
              Link Materi Dosen
            </label>
            <input
              className="w-full px-4 py-3 bg-secondary-100 border-none rounded-xl text-base focus:ring-2 focus:ring-primary-400 transition-all outline-none"
              placeholder="https://drive.google.com/..."
              type="url"
              value={formData.material_url}
              onChange={(e) => setFormData((p) => ({ ...p, material_url: e.target.value }))}
              disabled={loading}
            />
            <p className="text-[10px] text-slate-400">Link Google Drive, Dropbox, atau URL lainnya</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-white py-4 rounded-xl font-[var(--font-heading)] font-bold text-base shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Tambah Jadwal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
