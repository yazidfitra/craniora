"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X as XIcon,
  CheckCircle,
  RotateCcw,
  Flag,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import type { FlashcardDeck, Flashcard } from "@/types/flashcard";

interface FlashcardStudyViewProps {
  deckId: string;
}

export default function FlashcardStudyView({
  deckId,
}: FlashcardStudyViewProps) {
  const router = useRouter();
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDeck = useCallback(async () => {
    const res = await fetch(`/api/flashcards/${deckId}`);
    if (res.ok) {
      const data = await res.json();
      setDeck(data.deck);
      setCards(data.cards);
      setProgressMap(data.progress);
    }
    setLoading(false);
  }, [deckId]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  const markCard = async (known: boolean) => {
    const card = cards[currentIndex];
    if (!card) return;

    setProgressMap((prev) => ({ ...prev, [card.id]: known }));

    await fetch(`/api/flashcards/${deckId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flashcardId: card.id, known }),
    });

    // Next card
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Deck tidak ditemukan atau kosong.</p>
        <button
          onClick={() => router.push("/dashboard/flashcards")}
          className="mt-4 text-primary-400 font-bold hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const knownCount = Object.values(progressMap).filter(Boolean).length;

  if (!currentCard) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Tidak ada kartu untuk ditampilkan.</p>
        <button onClick={() => router.push("/dashboard/flashcards")} className="mt-4 text-primary-400 font-bold hover:underline">Kembali</button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center min-h-[70vh]">
      {/* Back button */}
      <div className="w-full mb-6">
        <button
          onClick={() => router.push("/dashboard/flashcards")}
          className="flex items-center gap-2 text-sm text-primary-400 font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Deck
        </button>
      </div>

      {/* Header */}
      <div className="w-full mb-8 text-center space-y-4">
        <div>
          <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">
            {deck.category}
          </span>
          <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container">
            {deck.title}
          </h2>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-2 bg-secondary-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-400 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs font-bold text-on-surface-variant min-w-[80px]">
            Kartu {currentIndex + 1} dari {cards.length}
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="w-full aspect-[3/2] cursor-pointer mb-8"
        onClick={() => setFlipped(!flipped)}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-primary-container/5 blur-xl translate-y-4 rounded-xl" />
          <div className="relative w-full h-full bg-white border border-primary-50 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center">
            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary-50" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary-50" />

            {!flipped ? (
              <>
                {currentCard?.image_url && (
                  <div className="w-full max-w-sm aspect-video relative rounded-lg overflow-hidden mb-4">
                    <Image
                      src={currentCard?.image_url || ""}
                      alt="Card image"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className="font-[var(--font-heading)] text-3xl font-bold text-primary-container mb-4">
                  {currentCard?.front_text}
                </h3>
                <button className="mt-4 flex items-center gap-2 px-6 py-2 bg-secondary-100 text-primary-400 text-xs font-bold rounded-full hover:bg-secondary-container transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  Tap untuk Balik
                </button>
              </>
            ) : (
              <p className="text-base text-on-surface-variant leading-relaxed max-w-md">
                {currentCard?.back_text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Controls */}
      <div className="flex flex-col md:flex-row gap-4 w-full mb-8">
        <button
          onClick={() => markCard(false)}
          className="flex-1 group flex items-center justify-center gap-4 bg-white border-2 border-error-container text-error px-8 py-5 rounded-xl hover:bg-error-container/20 transition-all active:scale-95"
        >
          <XIcon className="w-8 h-8 group-hover:rotate-[-12deg] transition-transform" />
          <div className="text-left">
            <p className="font-bold font-[var(--font-heading)] text-lg">
              Belum Hafal
            </p>
            <p className="text-xs opacity-70">Review lagi nanti</p>
          </div>
        </button>
        <button
          onClick={() => markCard(true)}
          className="flex-1 group flex items-center justify-center gap-4 bg-primary-container text-white px-8 py-5 rounded-xl shadow-lg hover:bg-primary-400 transition-all active:scale-95"
        >
          <CheckCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <p className="font-bold font-[var(--font-heading)] text-lg">
              Sudah Hafal
            </p>
            <p className="text-xs opacity-70">Konsep dikuasai</p>
          </div>
        </button>
      </div>

      {/* Utility */}
      <div className="flex items-center gap-8 text-on-surface-variant">
        <button className="flex items-center gap-2 hover:text-primary-container transition-colors">
          <Flag className="w-4 h-4" />
          <span className="text-xs font-bold">Tandai</span>
        </button>
        <span className="text-xs text-secondary">
          Dikuasai: {knownCount}/{cards.length}
        </span>
      </div>
    </main>
  );
}
