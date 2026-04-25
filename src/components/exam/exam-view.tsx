"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Timer,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle,
  Loader2,
  Grid3X3,
  Info,
} from "lucide-react";
import Image from "next/image";
import type { ExamSet, ExamQuestion, ExamAttempt } from "@/types/exam";

interface ExamViewProps {
  examId: string;
}

export default function ExamView({ examId }: ExamViewProps) {
  const router = useRouter();
  const [exam, setExam] = useState<ExamSet | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchExam = useCallback(async () => {
    const res = await fetch(`/api/exams/${examId}`);
    if (res.ok) {
      const data = await res.json();
      setExam(data.exam);
      setQuestions(data.questions);
      setAttempt(data.attempt);
      setAnswers(data.attempt?.answers || {});
      if (data.exam?.duration_minutes) {
        const started = new Date(data.attempt?.started_at).getTime();
        const duration = data.exam.duration_minutes * 60 * 1000;
        const remaining = Math.max(0, Math.floor((started + duration - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
    }
    setLoading(false);
  }, [examId]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || attempt?.is_completed) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, attempt?.is_completed]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    // Auto-save
    if (attempt) {
      fetch(`/api/exams/${examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: attempt.id,
          answers: { ...answers, [questionId]: answer },
        }),
      });
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleFinish = async () => {
    if (!attempt) return;
    setSubmitting(true);
    await fetch(`/api/exams/${examId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId: attempt.id,
        answers,
        finish: true,
      }),
    });
    setShowConfirm(false);
    router.push("/dashboard/tasks");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-400">Ujian tidak ditemukan atau belum ada soal.</p>
        <button
          onClick={() => router.push("/dashboard/tasks")}
          className="mt-4 text-primary-400 font-bold hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const options = [
    { key: "a", text: currentQ.option_a },
    { key: "b", text: currentQ.option_b },
    ...(currentQ.option_c ? [{ key: "c", text: currentQ.option_c }] : []),
    ...(currentQ.option_d ? [{ key: "d", text: currentQ.option_d }] : []),
    ...(currentQ.option_e ? [{ key: "e", text: currentQ.option_e }] : []),
  ];

  return (
    <>
      {/* Exam Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-primary-50 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
            {exam.category}
          </span>
          <span className="text-sm font-bold text-primary-container">
            {exam.title}
          </span>
        </div>
        <div className="flex items-center gap-3 bg-primary-container text-white px-4 py-2 rounded-xl shadow-md">
          <Timer className="w-5 h-5" />
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] uppercase font-bold tracking-tight opacity-70">
              Sisa Waktu
            </span>
            <span className="text-lg font-mono font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowNav(!showNav)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <Grid3X3 className="w-5 h-5 text-primary-container" />
        </button>
      </div>

      <div className="max-w-[1280px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Question Area */}
        <div className="flex-grow flex flex-col gap-6">
          {/* Progress */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-primary-50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary-container text-white rounded-lg text-sm font-bold">
                Soal {currentIndex + 1}
              </span>
              <span className="text-secondary font-medium text-sm">
                dari {questions.length} Soal
              </span>
            </div>
            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg border transition-colors ${
                flagged.has(currentQ.id)
                  ? "text-warning border-warning bg-warning/5"
                  : "text-slate-400 border-slate-200 hover:border-warning hover:text-warning"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Ragu-ragu
            </button>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl border border-primary-50 shadow-sm p-6 md:p-10 flex flex-col gap-8">
            <div className="space-y-4">
              <p className="font-[var(--font-heading)] text-xl font-semibold text-primary-container leading-relaxed">
                {currentQ.question_text}
              </p>
              {currentQ.image_url && (
                <div className="w-full max-h-[300px] rounded-xl overflow-hidden border border-primary-50 relative aspect-video">
                  <Image
                    src={currentQ.image_url}
                    alt="Gambar soal"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {options.map((opt) => {
                const selected = answers[currentQ.id] === opt.key;
                return (
                  <label
                    key={opt.key}
                    className={`group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.99] ${
                      selected
                        ? "border-primary-400 bg-primary-50/50"
                        : "border-primary-50 hover:border-primary-400 hover:bg-primary-50/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q_${currentQ.id}`}
                      className="w-5 h-5 text-primary-400 border-primary-50 focus:ring-primary-400"
                      checked={selected}
                      onChange={() => selectAnswer(currentQ.id, opt.key)}
                    />
                    <span className="ml-4 flex items-center gap-3">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                          selected
                            ? "bg-primary-400 text-white"
                            : "bg-primary-50 text-primary-container group-hover:bg-primary-400 group-hover:text-white"
                        }`}
                      >
                        {opt.key.toUpperCase()}
                      </span>
                      <span
                        className={`${selected ? "font-bold" : "font-medium"} text-primary-container`}
                      >
                        {opt.text}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between bg-white p-4 md:p-6 rounded-xl border border-primary-50 shadow-sm">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-primary-400 border-2 border-primary-400 hover:bg-primary-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Sebelumnya
            </button>
            <div className="flex gap-4">
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-success text-white shadow-lg shadow-success/20 active:scale-95 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  Selesai
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1)
                    )
                  }
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-primary-container text-white shadow-lg shadow-primary-container/20 active:scale-95 transition-all"
                >
                  Selanjutnya
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Question Navigator */}
        <aside
          className={`w-full lg:w-[320px] flex flex-col gap-6 ${
            showNav ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0" : "hidden lg:flex"
          }`}
        >
          {showNav && (
            <button
              onClick={() => setShowNav(false)}
              className="lg:hidden self-end text-sm text-primary-400 font-bold"
            >
              Tutup
            </button>
          )}
          <div className="bg-white rounded-xl border border-primary-50 shadow-sm overflow-hidden">
            <div className="bg-primary-50/50 p-4 border-b border-primary-50">
              <h3 className="font-[var(--font-heading)] text-xl font-semibold text-primary-container">
                Navigasi Soal
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = i === currentIndex;
                  const isFlagged = flagged.has(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(i);
                        setShowNav(false);
                      }}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        isFlagged
                          ? "bg-warning text-white"
                          : isCurrent
                            ? "border-2 border-primary-container text-primary-container shadow-[0_0_8px_rgba(0,27,70,0.2)]"
                            : isAnswered
                              ? "bg-primary-container text-white"
                              : "border border-primary-50 text-secondary hover:border-primary-container"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                  <span className="w-3 h-3 rounded bg-primary-container" />
                  Sudah Terjawab
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                  <span className="w-3 h-3 rounded bg-warning" />
                  Ragu-ragu
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                  <span className="w-3 h-3 rounded border border-primary-50" />
                  Belum Terjawab
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-primary-container rounded-xl p-6 text-white shadow-xl">
            <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-4">
              Informasi Ujian
            </p>
            <div className="flex justify-between items-end border-b border-white/10 pb-3 mb-3">
              <div>
                <p className="text-[10px] opacity-60">Terjawab</p>
                <p className="text-xl font-bold">
                  {answeredCount}/{questions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-60">Selesai</p>
                <p className="text-xl font-bold">
                  {questions.length > 0
                    ? Math.round((answeredCount / questions.length) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all"
                style={{
                  width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-[var(--font-heading)] text-[30px] font-semibold text-primary-container">
                Konfirmasi Selesai
              </h2>
              <p className="text-secondary font-medium">
                Apakah Anda yakin ingin mengakhiri ujian ini?
                {questions.length - answeredCount > 0 && (
                  <> Anda masih memiliki{" "}
                  <strong>{questions.length - answeredCount}</strong> soal yang
                  belum terjawab.</>
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-3 rounded-xl font-bold border-2 border-primary-50 text-secondary hover:bg-primary-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-bold bg-primary-container text-white hover:bg-primary-400 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Ya, Selesai"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
