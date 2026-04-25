"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, Trash2 } from "lucide-react";
import type { FlashcardDeck } from "@/types/flashcard";

export default function FlashcardListView() {
  const router = useRouter();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [progress, setProgress] = useState<
    Record<string, { known: number; total: number }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      const res = await fetch("/api/flashcards");
      if (res.ok) {
        const data = await res.json();
        setDecks(data.decks);
        setProgress(data.progress);
      }
      setLoading(false);
    };
    fetchDecks();
  }, []);

  const handleDelete = async (deckId: string) => {
    if (!confirm("Hapus deck ini beserta semua kartunya?")) return;
    const res = await fetch(`/api/flashcards/${deckId}`, { method: "DELETE" });
    if (res.ok) {
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
        <h2 className="font-[var(--font-heading)] text-4xl font-bold text-primary-container">
          Flashcards
        </h2>
        <p className="text-secondary text-base">
          Kuasai materi dengan metode active recall.
        </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/flashcards/create")}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary-container text-white rounded-xl text-sm font-bold hover:bg-primary-400 transition-all shrink-0"
        >
          <ArrowRight className="w-4 h-4" /> Buat Deck Baru
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin" />
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-20">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-4">
            Belum ada deck flashcard.
          </p>
          <button
            onClick={() => router.push("/dashboard/flashcards/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white rounded-xl text-sm font-bold hover:bg-primary-400 transition-all"
          >
            Buat Deck Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const p = progress[deck.id];
            const knownPct =
              p && p.total > 0 ? Math.round((p.known / p.total) * 100) : 0;

            return (
              <div
                key={deck.id}
                className="bg-white border border-primary-50 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(deck.id); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-error hover:bg-error/5 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container mb-1">
                  {deck.title}
                </h3>
                <p className="text-sm text-secondary mb-4">
                  {deck.category} &bull; {deck.card_count} kartu
                </p>
                <div className="mt-auto space-y-3">
                  {knownPct > 0 && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Dikuasai</span>
                        <span className="font-bold text-primary-400">
                          {knownPct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-400 rounded-full"
                          style={{ width: `${knownPct}%` }}
                        />
                      </div>
                    </>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/flashcards/${deck.id}`)
                    }
                    className="w-full py-3 bg-primary-container text-white rounded-lg text-xs font-bold hover:bg-primary-400 transition-all flex items-center justify-center gap-2"
                  >
                    Mulai Belajar <ArrowRight className="w-4 h-4" />
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
