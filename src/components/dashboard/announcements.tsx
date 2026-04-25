import { Bell } from "lucide-react";

export default function Announcements() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-[var(--font-heading)] text-primary-container text-xl font-semibold">
          Pengumuman Terbaru
        </h3>
      </div>

      <div className="bg-surface-card rounded-2xl border border-primary-50 p-8 text-center shadow-sm">
        <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-400">
          Belum ada pengumuman.
        </p>
      </div>
    </div>
  );
}
