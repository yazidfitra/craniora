"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Clock,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Trash2,
} from "lucide-react";
import type { ExamSet } from "@/types/exam";
import { DIFFICULTY_LABELS } from "@/types/exam";

export default function ExamListView() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamSet[]>([]);
  const [progress, setProgress] = useState<
    Record<string, { score: number; total: number; completed: boolean }>
  >({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      const res = await fetch("/api/exams");
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams);
        setProgress(data.progress);
      }
      setLoading(false);
    };
    fetchExams();
  }, []);

  const categories = [...new Set(exams.map((e) => e.category))];

  const filtered = exams.filter((e) => {
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || e.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleDelete = async (examId: string) => {
    if (!confirm("Hapus bank soal ini beserta semua soalnya?")) return;
    const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
    if (res.ok) {
      setExams((prev) => prev.filter((e) => e.id !== examId));
    }
  };

  const getProgress = (examId: string) => {
    const p = progress[examId];
    if (!p) return 0;
    if (p.total === 0) return 0;
    return Math.round((p.score / p.total) * 100);
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <h2 className="font-[var(--font-heading)] text-4xl font-bold text-primary-container">
            Bank Soal Ujian
          </h2>
          <p className="text-secondary text-base">
            Review materi dan uji pengetahuan kamu.
          </p>
          <button
            onClick={() => router.push("/dashboard/tasks/create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-lg text-sm font-bold hover:bg-primary-400 transition-all mt-2"
          >
            <ArrowRight className="w-4 h-4" /> Kontribusi Soal
          </button>
        </div>
        <div className="w-full md:w-[400px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none transition-all text-sm shadow-sm"
              placeholder="Cari materi atau topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            !filterCategory
              ? "bg-primary-container text-white"
              : "bg-secondary-100 text-secondary border border-secondary-fixed hover:bg-secondary-fixed"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setFilterCategory(filterCategory === cat ? null : cat)
            }
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? "bg-primary-container text-white"
                : "bg-secondary-100 text-secondary border border-secondary-fixed hover:bg-secondary-fixed"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exam Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-[var(--font-heading)] text-xl font-semibold text-slate-400 mb-2">
            {exams.length === 0
              ? "Belum ada bank soal"
              : "Tidak ditemukan"}
          </h3>
          <p className="text-sm text-slate-400">
            {exams.length === 0
              ? "Belum ada bank soal."
              : "Coba kata kunci lain."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exam) => {
            const diff = DIFFICULTY_LABELS[exam.difficulty] || DIFFICULTY_LABELS.medium;
            const prog = getProgress(exam.id);
            const isCompleted = progress[exam.id]?.completed;

            return (
              <div
                key={exam.id}
                className="bg-white border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary-400">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${diff.bg} ${diff.color} text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded`}
                    >
                      {diff.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(exam.id); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-error hover:bg-error/5 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-2">
                  {exam.title}
                </h3>
                <p className="text-sm text-secondary mb-6 line-clamp-2 flex-grow">
                  {exam.description || "Latihan soal ujian."}
                </p>
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-center text-xs text-outline">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />{" "}
                      {exam.question_count} Soal
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {exam.duration_minutes} Menit
                    </span>
                  </div>
                  {prog > 0 && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Progress</span>
                        <span className="font-bold text-primary-400">
                          {prog}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? "bg-success" : "bg-primary-400"
                          }`}
                          style={{ width: `${prog}%` }}
                        />
                      </div>
                    </>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/tasks/${exam.id}/exam`)
                    }
                    className={`w-full py-3 rounded-lg text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isCompleted
                        ? "bg-success text-white"
                        : prog > 0
                          ? "bg-primary-container text-white"
                          : "border border-primary-container text-primary-container hover:bg-primary-50"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Review
                      </>
                    ) : prog > 0 ? (
                      "Lanjutkan"
                    ) : (
                      <>
                        Mulai <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
