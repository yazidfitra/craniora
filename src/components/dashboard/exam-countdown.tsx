"use client";

import { useState, useEffect } from "react";
import { Timer, CalendarClock, Pencil, X, Check } from "lucide-react";

interface ExamCountdownProps {
  initialExamDate?: string | null;
  initialExamName?: string | null;
}

export default function ExamCountdown({
  initialExamDate,
  initialExamName,
}: ExamCountdownProps) {
  const [examDate, setExamDate] = useState(initialExamDate || "");
  const [examName, setExamName] = useState(initialExamName || "");
  const [editing, setEditing] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [tempName, setTempName] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("craniora_exam");
    if (saved) {
      const parsed = JSON.parse(saved);
      setExamDate(parsed.date || "");
      setExamName(parsed.name || "");
    }
  }, []);

  useEffect(() => {
    if (!examDate) return;

    const update = () => {
      const now = new Date().getTime();
      const target = new Date(examDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [examDate]);

  const handleSave = () => {
    setExamDate(tempDate);
    setExamName(tempName);
    localStorage.setItem(
      "craniora_exam",
      JSON.stringify({ date: tempDate, name: tempName })
    );
    setEditing(false);
  };

  const handleClear = () => {
    setExamDate("");
    setExamName("");
    localStorage.removeItem("craniora_exam");
    setEditing(false);
  };

  const startEdit = () => {
    setTempDate(examDate);
    setTempName(examName);
    setEditing(true);
  };

  const isPast = examDate && new Date(examDate).getTime() <= Date.now();

  if (editing) {
    return (
      <div className="bg-surface-card rounded-2xl border border-primary-50 p-5 shadow-sm">
        <h4 className="font-[var(--font-heading)] text-sm font-bold text-primary-container mb-4 flex items-center gap-2">
          <CalendarClock className="w-4 h-4" />
          Atur Countdown Ujian
        </h4>
        <div className="space-y-3">
          <input
            className="w-full px-3 py-2.5 bg-secondary-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            placeholder="Nama ujian (UTS Anatomi, dll)"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          <input
            type="datetime-local"
            className="w-full px-3 py-2.5 bg-secondary-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none"
            value={tempDate}
            onChange={(e) => setTempDate(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!tempDate}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-container text-white rounded-lg text-xs font-bold disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" /> Simpan
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-500"
            >
              Batal
            </button>
            {examDate && (
              <button
                onClick={handleClear}
                className="px-3 py-2 border border-error/30 text-error rounded-lg text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!examDate) {
    return (
      <button
        onClick={startEdit}
        className="w-full bg-surface-card rounded-2xl border border-dashed border-outline-variant p-5 shadow-sm hover:border-primary-400 transition-colors text-center group"
      >
        <Timer className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-primary-400 transition-colors" />
        <p className="text-sm text-slate-400 group-hover:text-primary-container font-medium">
          Atur Countdown Ujian
        </p>
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-container to-primary-400 rounded-2xl p-5 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              Countdown
            </span>
          </div>
          <button
            onClick={startEdit}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
        <p className="text-sm font-semibold mb-3 text-white/90">
          {examName || "Ujian"}
        </p>
        {isPast ? (
          <p className="text-lg font-bold">Ujian sudah berlalu</p>
        ) : (
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-3xl font-bold leading-none">
                {countdown.days}
              </div>
              <div className="text-[10px] text-white/60 mt-1">Hari</div>
            </div>
            <div className="text-2xl font-light text-white/30">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold leading-none">
                {countdown.hours}
              </div>
              <div className="text-[10px] text-white/60 mt-1">Jam</div>
            </div>
            <div className="text-2xl font-light text-white/30">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold leading-none">
                {countdown.minutes}
              </div>
              <div className="text-[10px] text-white/60 mt-1">Menit</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
