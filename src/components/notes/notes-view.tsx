"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileQuestion,
  FileText,
  Layers,
  ArrowRight,
  Eye,
  Download,
  Clock,
  Trash2,
  HelpCircle,
  Trophy,
} from "lucide-react";
import type { SharedMaterial, MaterialFormData } from "@/types/material";
import UploadMaterialModal from "./upload-material-modal";

interface RecentItem {
  id: string;
  type: "notes" | "exam" | "flashcard";
  title: string;
  author?: string;
  detail?: string;
  created_at: string;
  // notes-specific
  file_url?: string;
  views?: number;
  downloads?: number;
  // exam-specific
  question_count?: number;
  difficulty?: string;
  // flashcard-specific
  card_count?: number;
  category?: string;
}

export default function NotesView() {
  const router = useRouter();
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [materials, setMaterials] = useState<SharedMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [matRes, examRes, fcRes] = await Promise.all([
        fetch("/api/materials"),
        fetch("/api/exams"),
        fetch("/api/flashcards"),
      ]);

      const items: RecentItem[] = [];

      if (matRes.ok) {
        const mats: SharedMaterial[] = await matRes.json();
        setMaterials(mats);
        mats.forEach((m) =>
          items.push({
            id: m.id,
            type: "notes",
            title: m.title,
            author: m.author_name || undefined,
            detail: m.file_name || undefined,
            created_at: m.created_at,
            file_url: m.file_url || undefined,
            views: m.views,
            downloads: m.downloads,
            category: m.category,
          })
        );
      }

      if (examRes.ok) {
        const data = await examRes.json();
        (data.exams || []).forEach((e: { id: string; title: string; category: string; question_count: number; difficulty: string; created_at: string; author_name?: string }) =>
          items.push({
            id: e.id,
            type: "exam",
            title: e.title,
            author: e.author_name || undefined,
            detail: `${e.question_count} soal`,
            created_at: e.created_at,
            question_count: e.question_count,
            difficulty: e.difficulty,
            category: e.category,
          })
        );
      }

      if (fcRes.ok) {
        const data = await fcRes.json();
        (data.decks || []).forEach((d: { id: string; title: string; category: string; card_count: number; created_at: string; author_name?: string }) =>
          items.push({
            id: d.id,
            type: "flashcard",
            title: d.title,
            author: d.author_name || undefined,
            detail: `${d.card_count} kartu`,
            created_at: d.created_at,
            card_count: d.card_count,
            category: d.category,
          })
        );
      }

      // Sort by created_at descending
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentItems(items);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleUpload = async (data: MaterialFormData, file: File | null) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("page_count", data.page_count);
    if (file) formData.append("file", file);

    const res = await fetch("/api/materials", { method: "POST", body: formData });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error);
    }
    await fetchAll();
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Hapus materi ini?")) return;
    const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecentItems((prev) => prev.filter((i) => i.id !== id));
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Baru saja";
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "exam": return <HelpCircle className="w-6 h-6" />;
      case "flashcard": return <Layers className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "exam": return "Bank Soal";
      case "flashcard": return "Flashcard";
      default: return "Catatan";
    }
  };

  const typeBg = (type: string) => {
    switch (type) {
      case "exam": return "bg-warning/10";
      case "flashcard": return "bg-info/10";
      default: return "bg-primary-50";
    }
  };

  const handleItemClick = (item: RecentItem) => {
    switch (item.type) {
      case "exam": router.push(`/dashboard/tasks/${item.id}/exam`); break;
      case "flashcard": router.push(`/dashboard/flashcards/${item.id}`); break;
      case "notes":
        if (item.file_url) window.open(item.file_url, "_blank");
        break;
    }
  };

  // Count per type from materials only (for category card badge)
  const notesCount = materials.length;

  return (
    <>
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 pb-32">
        {/* Hero */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-primary-container p-8 md:p-12 text-white">
            <div className="relative z-10 md:max-w-2xl">
              <span className="inline-block px-3 py-1 bg-primary-400/30 rounded-full text-xs uppercase tracking-wider mb-4 border border-primary-400/20 font-medium">
                Knowledge Community
              </span>
              <h2 className="font-[var(--font-heading)] text-4xl font-bold mb-4">
                Berbagi Ilmu
              </h2>
              <p className="text-base text-primary-50/80 mb-8 max-w-lg leading-relaxed">
                Platform berbagi materi kuliah, bank soal, dan flashcards antar
                mahasiswa. Kontribusi kamu membantu teman-teman belajar lebih
                baik.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/dashboard/notes/upload")}
                  className="bg-secondary-fixed text-on-primary-container px-6 py-3 rounded-lg font-semibold hover:bg-white transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Upload Catatan
                </button>
                <button
                  onClick={() => router.push("/dashboard/notes/leaderboard")}
                  className="border border-white/20 hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Leaderboard
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
              <div className="absolute right-20 bottom-0 w-60 h-60 bg-blue-400 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <button
            onClick={() => router.push("/dashboard/tasks")}
            className="bg-surface-card border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col text-left"
          >
            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 text-primary-400 group-hover:scale-110 transition-transform duration-300">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-2">Bank Soal</h3>
            <p className="text-sm text-secondary mb-6 flex-grow">Latihan soal ujian dari berbagai mata kuliah dan tingkat kesulitan.</p>
            <div className="flex items-center justify-end mt-auto">
              <span className="text-primary-400 font-semibold flex items-center gap-1 text-sm">Buka <ArrowRight className="w-4 h-4" /></span>
            </div>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="bg-surface-card border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col text-left"
          >
            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 text-primary-400 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-2">Catatan Kuliah</h3>
            <p className="text-sm text-secondary mb-6 flex-grow">Catatan kuliah, rangkuman materi, dan slide dosen yang dibagikan mahasiswa.</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-bold text-info bg-info/10 px-2 py-1 rounded">{notesCount} Item</span>
              <span className="text-primary-400 font-semibold flex items-center gap-1 text-sm">Upload <ArrowRight className="w-4 h-4" /></span>
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/flashcards")}
            className="bg-surface-card border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col text-left"
          >
            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 text-primary-400 group-hover:scale-110 transition-transform duration-300">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-2">Flashcards</h3>
            <p className="text-sm text-secondary mb-6 flex-grow">Kartu belajar untuk menghafal terminologi medis dan interaksi obat.</p>
            <div className="flex items-center justify-end mt-auto">
              <span className="text-primary-400 font-semibold flex items-center gap-1 text-sm">Buka <ArrowRight className="w-4 h-4" /></span>
            </div>
          </button>
        </section>

        {/* Recent Content - ALL types */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container">
                Materi Terbaru
              </h2>
              <p className="text-sm text-secondary">
                Konten terbaru dari bank soal, flashcards, dan catatan.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin" />
            </div>
          ) : recentItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Belum ada konten yang dibagikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentItems.slice(0, 10).map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className="flex bg-white rounded-xl overflow-hidden border border-primary-50 hover:border-primary-400/30 transition-colors cursor-pointer"
                >
                  {/* Icon side */}
                  <div className={`w-28 ${typeBg(item.type)} flex items-center justify-center shrink-0 text-primary-400`}>
                    {typeIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary-400 uppercase tracking-tight">
                          {typeLabel(item.type)}
                        </span>
                        {item.category && (
                          <>
                            <span className="w-1 h-1 bg-secondary-500 rounded-full" />
                            <span className="text-xs text-secondary">{item.category}</span>
                          </>
                        )}
                        <span className="w-1 h-1 bg-secondary-500 rounded-full" />
                        <span className="text-xs text-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(item.created_at)}
                        </span>
                      </div>
                      <h4 className="font-[var(--font-heading)] text-base font-bold text-primary-container leading-tight mb-1 truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-secondary line-clamp-1">
                        {item.author && `${item.author} • `}
                        {item.detail || ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      {item.type === "notes" && (
                        <>
                          <span className="flex items-center gap-1 text-xs text-secondary">
                            <Eye className="w-3.5 h-3.5" /> {item.views || 0}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-secondary">
                            <Download className="w-3.5 h-3.5" /> {item.downloads || 0}
                          </span>
                          {item.file_url && (
                            <span className="text-xs text-primary-400 font-bold flex items-center gap-1">
                              Buka File <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(item.id); }}
                            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-error hover:bg-error/5 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {item.type === "exam" && (
                        <span className="text-xs text-primary-400 font-bold flex items-center gap-1">
                          Mulai Latihan <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {item.type === "flashcard" && (
                        <span className="text-xs text-primary-400 font-bold flex items-center gap-1">
                          Mulai Belajar <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <UploadMaterialModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUpload}
      />
    </>
  );
}
