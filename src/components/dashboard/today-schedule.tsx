"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Schedule } from "@/types/schedule";

interface TodayScheduleProps {
  schedules: Schedule[];
}

export default function TodaySchedule({ schedules }: TodayScheduleProps) {
  const [dateLabel, setDateLabel] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
    );

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (s: Schedule) =>
    currentTime >= s.start_time.slice(0, 5) &&
    currentTime <= s.end_time.slice(0, 5);

  const isUpcoming = (s: Schedule) => s.start_time.slice(0, 5) > currentTime;

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-[var(--font-heading)] text-primary-container text-xl font-semibold">
          Jadwal Hari Ini
        </h3>
        <span className="text-secondary text-xs">{dateLabel}</span>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-primary-50 p-8 text-center shadow-sm">
          <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-4">
            Tidak ada jadwal hari ini.
          </p>
          <Link
            href="/dashboard/schedule"
            className="text-xs text-primary-400 font-bold hover:underline"
          >
            Kelola Jadwal
          </Link>
        </div>
      ) : (
        <div className="bg-surface-card rounded-2xl border border-primary-50 divide-y divide-primary-50 overflow-hidden shadow-sm">
          {schedules.map((schedule) => {
            const active = isActive(schedule);
            const upcoming = isUpcoming(schedule);
            const past = !active && !upcoming;

            return (
              <div
                key={schedule.id}
                className={`p-4 ${
                  active
                    ? "bg-primary-50/30 border-l-4 border-primary-container"
                    : ""
                } ${past ? "opacity-50" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`font-bold text-xs ${
                      active
                        ? "text-primary-container"
                        : past
                          ? "text-slate-400"
                          : "text-slate-400 font-medium"
                    }`}
                  >
                    {active
                      ? "Sedang Berlangsung"
                      : past
                        ? "Selesai"
                        : "Mendatang"}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      active
                        ? "bg-white px-2 py-0.5 rounded-full text-primary-container border border-primary-50"
                        : "text-slate-500"
                    }`}
                  >
                    {formatTime(schedule.start_time)} -{" "}
                    {formatTime(schedule.end_time)}
                  </span>
                </div>
                <h5
                  className={`font-[var(--font-heading)] text-base font-semibold ${
                    active ? "text-primary-container" : "text-slate-700"
                  }`}
                >
                  {schedule.subject}
                </h5>
                {schedule.room && (
                  <div
                    className={`flex items-center mt-2 text-[11px] ${
                      active ? "text-secondary" : "text-slate-400"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {schedule.room}
                  </div>
                )}
                {schedule.lecturer && (
                  <div
                    className={`flex items-center mt-1 text-[11px] ${
                      active ? "text-secondary" : "text-slate-400"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {schedule.lecturer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Link to full schedule */}
      <Link
        href="/dashboard/schedule"
        className="block text-center text-xs text-primary-400 font-bold hover:underline"
      >
        Lihat Semua Jadwal
      </Link>
    </div>
  );
}
