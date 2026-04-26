"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CalendarDays, Coffee } from "lucide-react";
import type { Schedule, ScheduleFormData } from "@/types/schedule";
import { DAY_NAMES } from "@/types/schedule";
import ScheduleCard from "./schedule-card";
import AddScheduleModal from "./add-schedule-modal";

export default function ScheduleView() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedules?day=${selectedDay}`);
      const data = await res.json();
      if (res.ok) {
        setSchedules(data);
      } else {
        console.error("Fetch schedules error:", data);
        setSchedules([]);
      }
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDay]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleAdd = async (data: ScheduleFormData, materialFile: File | null) => {
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error);
    }

    // Upload material file if provided
    if (materialFile) {
      const schedule = await res.json();
      if (schedule?.id) {
        const formData = new FormData();
        formData.append("file", materialFile);
        formData.append("folder", "schedule-materials");
        const uploadRes = await fetch("/api/upload-image", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          await fetch(`/api/schedules/${schedule.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, material_url: url }),
          });
        }
      }
    }

    await fetchSchedules();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal ini?")) return;

    const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Check if a schedule is currently active
  const isActive = (schedule: Schedule) => {
    if (selectedDay !== today) return false;
    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
    return currentTime >= schedule.start_time.slice(0, 5) &&
      currentTime <= schedule.end_time.slice(0, 5);
  };

  // Get today's date formatted
  const dateLabel = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <main className="pt-4 pb-10 px-4 md:px-8 max-w-[1280px] mx-auto">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-[var(--font-heading)] text-4xl font-bold text-primary-container mb-2">
                Jadwal Kuliah
              </h1>
              <p className="text-base text-secondary">{dateLabel}</p>
            </div>
          </div>
        </section>

        {/* Day Selector */}
        <section className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {DAY_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedDay === i
                    ? "bg-primary-container text-white shadow-md"
                    : "bg-secondary-container text-secondary hover:text-primary-container"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="font-[var(--font-heading)] text-xl font-semibold text-slate-400 mb-2">
                Tidak ada jadwal
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Belum ada jadwal untuk hari {DAY_NAMES[selectedDay]}.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-xl font-[var(--font-heading)] font-bold hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" />
                Tambah Jadwal
              </button>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl">
              {schedules.map((schedule, index) => {
                const showBreak =
                  index > 0 &&
                  schedule.start_time.slice(0, 5) >
                    schedules[index - 1].end_time.slice(0, 5);

                return (
                  <div key={schedule.id}>
                    {showBreak && (
                      <div className="relative pl-6 border-l-4 border-dashed border-slate-200 py-4 mb-6">
                        <div className="flex items-center gap-4 text-secondary italic text-sm">
                          <Coffee className="w-5 h-5" />
                          <span>Istirahat</span>
                        </div>
                      </div>
                    )}
                    <ScheduleCard
                      schedule={schedule}
                      isActive={isActive(schedule)}
                      onDelete={handleDelete}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Schedule Modal */}
      <AddScheduleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
        defaultDay={selectedDay}
      />
    </>
  );
}
