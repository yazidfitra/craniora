import { Metadata } from "next";
import Link from "next/link";
import { Dices, Timer, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools | Craniora Academy",
};

export default function ToolsPage() {
  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8">
      <h2 className="font-[var(--font-heading)] text-4xl font-bold text-primary-container mb-2">
        Tools
      </h2>
      <p className="text-secondary text-base mb-8">
        Alat bantu untuk kegiatan kelas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/tools/draw-straw"
          className="bg-surface-card border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col"
        >
          <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center mb-6 text-primary-400 group-hover:scale-110 transition-transform">
            <Dices className="w-8 h-8" />
          </div>
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-2">
            Draw Straw
          </h3>
          <p className="text-sm text-secondary mb-6 flex-grow">
            Spin wheel untuk menentukan giliran, tugas, atau keputusan acak secara adil.
          </p>
          <div className="flex items-center justify-end mt-auto">
            <span className="text-primary-400 font-semibold flex items-center gap-1 text-sm">
              Buka <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard/tools/pomodoro"
          className="bg-surface-card border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col"
        >
          <div className="w-14 h-14 bg-error-container rounded-xl flex items-center justify-center mb-6 text-error group-hover:scale-110 transition-transform">
            <Timer className="w-8 h-8" />
          </div>
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-2">
            Pomodoro Timer
          </h3>
          <p className="text-sm text-secondary mb-6 flex-grow">
            Timer fokus belajar dengan metode Pomodoro. 25 menit fokus, 5 menit istirahat.
          </p>
          <div className="flex items-center justify-end mt-auto">
            <span className="text-primary-400 font-semibold flex items-center gap-1 text-sm">
              Buka <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </main>
  );
}
