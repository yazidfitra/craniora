"use client";

import { useState, useEffect, useCallback } from "react";
import { Timer, CalendarClock, Pencil, X, Check, Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CountdownData {
  id: string;
  exam_name: string;
  exam_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface ExamCountdownProps {
  isAdmin: boolean;
  initialCountdown: CountdownData | null;
}

export default function ExamCountdown({
  isAdmin,
  initialCountdown,
}: ExamCountdownProps) {
  const [countdownData, setCountdownData] = useState<CountdownData | null>(
    initialCountdown
  );
  const [editing, setEditing] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [tempName, setTempName] = useState("");
  const [saving, setSaving] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  // Subscribe to Supabase Realtime for exam_countdowns changes
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("exam_countdowns_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "exam_countdowns",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setCountdownData(payload.new as CountdownData);
          } else if (payload.eventType === "DELETE") {
            setCountdownData(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!countdownData?.exam_date) return;

    const update = () => {
      const now = new Date().getTime();
      const target = new Date(countdownData.exam_date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [countdownData?.exam_date]);

  const handleSave = useCallback(async () => {
    if (!tempDate || !tempName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/countdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_name: tempName.trim(),
          exam_date: tempDate,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCountdownData(data);
        setEditing(false);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, [tempDate, tempName]);

  const handleClear = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/countdown", { method: "DELETE" });
      if (res.ok) {
        setCountdownData(null);
        setEditing(false);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, []);

  const startEdit = () => {
    setTempDate(
      countdownData?.exam_date
        ? new Date(countdownData.exam_date).toISOString().slice(0, 16)
        : ""
    );
    setTempName(countdownData?.exam_name || "");
    setEditing(true);
  };

  const isPast =
    countdownData?.exam_date &&
    new Date(countdownData.exam_date).getTime() <= Date.now();

  // Editing form (admin only)
  if (editing && isAdmin) {
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
              disabled={!tempDate || !tempName.trim() || saving}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-container text-white rounded-lg text-xs font-bold disabled:opacity-40"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Simpan
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-500"
            >
              Batal
            </button>
            {countdownData && (
              <button
                onClick={handleClear}
                disabled={saving}
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

  // Empty state
  if (!countdownData) {
    if (isAdmin) {
      return (
        <button
          onClick={startEdit}
          className="w-full bg-surface-card rounded-2xl border border-dashed border-outline-variant p-5 shadow-sm hover:border-primary-400 transition-colors text-center group"
        >
          <Timer className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-primary-400 transition-colors" />
          <p className="text-sm text-slate-400 group-hover:text-primary-container font-medium">
            Atur Countdown Ujian
          </p>
          <p className="text-[10px] text-slate-300 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Hanya admin
          </p>
        </button>
      );
    }
    // Non-admin sees nothing when no countdown is set
    return null;
  }

  // Active countdown display (visible to all users)
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
          {isAdmin && (
            <button
              onClick={startEdit}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Edit countdown (Admin)"
            >
              <Pencil className="w-3.5 h-3.5 text-white/60" />
            </button>
          )}
        </div>
        <p className="text-sm font-semibold mb-3 text-white/90">
          {countdownData.exam_name || "Ujian"}
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
