"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Medal,
  ArrowLeft,
  FileText,
  HelpCircle,
  Layers,
  Crown,
  Star,
} from "lucide-react";

interface ContributorStats {
  user_id: string;
  name: string;
  notes_count: number;
  exams_count: number;
  flashcards_count: number;
  total: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<ContributorStats[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        setCurrentUserId(data.currentUserId);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-slate-400">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
    if (rank === 2) return "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200";
    if (rank === 3) return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200";
    return "bg-white border-primary-50";
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => router.push("/dashboard/notes")}
        className="flex items-center gap-2 text-sm text-primary-400 font-semibold hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke CraniShare
      </button>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-8 text-white mb-8">
        <Trophy className="absolute top-4 right-4 w-24 h-24 text-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              CraniShare
            </span>
          </div>
          <h2 className="font-[var(--font-heading)] text-3xl font-bold mb-2">
            Leaderboard Kontributor
          </h2>
          <p className="text-white/80 text-sm max-w-lg">
            Mahasiswa yang paling aktif berbagi materi, bank soal, dan flashcards.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin" />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Belum ada kontributor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 0, 2].map((idx) => {
                const c = leaderboard[idx];
                if (!c) return null;
                const rank = idx + 1;
                const actualRank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                return (
                  <div
                    key={c.user_id}
                    className={`flex flex-col items-center p-4 rounded-xl border ${
                      actualRank === 1
                        ? "bg-gradient-to-b from-yellow-50 to-amber-50 border-yellow-200 -mt-4"
                        : actualRank === 2
                          ? "bg-gradient-to-b from-slate-50 to-gray-50 border-slate-200"
                          : "bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200"
                    }`}
                  >
                    <div className="mb-2">{getRankIcon(actualRank)}</div>
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
                        actualRank === 1
                          ? "bg-yellow-500"
                          : actualRank === 2
                            ? "bg-slate-400"
                            : "bg-amber-600"
                      }`}
                    >
                      {getInitials(c.name)}
                    </div>
                    <p className="font-[var(--font-heading)] text-sm font-bold text-primary-container text-center truncate w-full">
                      {c.name}
                    </p>
                    <p className="text-2xl font-bold text-primary-container mt-1">
                      {c.total}
                    </p>
                    <p className="text-[10px] text-secondary">kontribusi</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full List */}
          {leaderboard.map((c, idx) => {
            const rank = idx + 1;
            const isMe = c.user_id === currentUserId;
            return (
              <div
                key={c.user_id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${getRankBg(rank)} ${
                  isMe ? "ring-2 ring-primary-400/30" : ""
                }`}
              >
                {/* Rank */}
                <div className="w-10 flex items-center justify-center shrink-0">
                  {getRankIcon(rank)}
                </div>

                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-primary-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {getInitials(c.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-[var(--font-heading)] text-base font-bold text-primary-container truncate">
                      {c.name}
                    </p>
                    {isMe && (
                      <span className="text-[10px] bg-primary-400 text-white px-2 py-0.5 rounded-full font-bold">
                        Kamu
                      </span>
                    )}
                    {rank <= 3 && (
                      <Star className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <FileText className="w-3 h-3" /> {c.notes_count}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <HelpCircle className="w-3 h-3" /> {c.exams_count}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <Layers className="w-3 h-3" /> {c.flashcards_count}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="font-[var(--font-heading)] text-xl font-bold text-primary-container">
                    {c.total}
                  </p>
                  <p className="text-[10px] text-secondary">total</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
