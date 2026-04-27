"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import QuickStats from "@/components/dashboard/quick-stats";
import TodaySchedule from "@/components/dashboard/today-schedule";
import type { Schedule } from "@/types/schedule";

// Lazy load heavy components
const Announcements = dynamic(() => import("@/components/dashboard/announcements"));
const ExamCountdown = dynamic(() => import("@/components/dashboard/exam-countdown"));
const DailyQuote = dynamic(() => import("@/components/dashboard/daily-quote"));

interface CountdownData {
  id: string;
  exam_name: string;
  exam_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface DashboardContentProps {
  firstName: string;
  initialSchedules: Schedule[];
  isAdmin: boolean;
  initialCountdown: CountdownData | null;
}

export default function DashboardContent({
  firstName,
  initialSchedules,
  isAdmin,
  initialCountdown,
}: DashboardContentProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  // Subscribe to real-time schedule changes
  useEffect(() => {
    const supabase = createClient();
    const todayDow = new Date().getDay();

    const fetchSchedules = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", user.id)
        .eq("day_of_week", todayDow)
        .order("start_time", { ascending: true });

      if (data) {
        setSchedules(data);
      }
    };

    const channel = supabase
      .channel("dashboard_schedules_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "schedules",
        },
        () => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate next/active schedule
  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  const nextSchedule = schedules.find(
    (s) => s.start_time.slice(0, 5) > currentTime
  );
  const activeSchedule = schedules.find(
    (s) =>
      currentTime >= s.start_time.slice(0, 5) &&
      currentTime <= s.end_time.slice(0, 5)
  );

  const highlightSchedule = activeSchedule || nextSchedule || schedules[0];

  return (
    <main className="max-w-[1280px] mx-auto px-4 pt-8 space-y-8">
      {/* Personalized Greeting */}
      <section className="space-y-1">
        <h1 className="font-[var(--font-heading)] text-primary-container text-4xl font-bold">
          Halo, {firstName}!
        </h1>
        <p className="text-secondary text-base">
          {schedules.length > 0
            ? `Semangat belajar hari ini. Kamu memiliki ${schedules.length} jadwal.`
            : "Tidak ada jadwal hari ini. Selamat beristirahat!"}
        </p>
      </section>

      {/* Daily Quote */}
      <DailyQuote />

      {/* Quick Stats Bento Grid */}
      <QuickStats
        scheduleCount={schedules.length}
        nextScheduleTime={highlightSchedule?.start_time.slice(0, 5) || null}
        nextScheduleSubject={highlightSchedule?.subject || null}
      />

      {/* Announcements, Schedule & Countdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Announcements />
        <div className="space-y-6">
          <ExamCountdown isAdmin={isAdmin} initialCountdown={initialCountdown} />
          <TodaySchedule schedules={schedules} enableRealtime={false} />
        </div>
      </section>
    </main>
  );
}
