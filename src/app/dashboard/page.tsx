import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import QuickStats from "@/components/dashboard/quick-stats";
import Announcements from "@/components/dashboard/announcements";
import TodaySchedule from "@/components/dashboard/today-schedule";
import ExamCountdown from "@/components/dashboard/exam-countdown";
import type { Schedule } from "@/types/schedule";

export const metadata = {
  title: "Dashboard | Craniora Academy",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name || user.email || "Mahasiswa";
  const firstName = fullName.split(" ")[0];

  // Fetch today's schedules
  const todayDow = new Date().getDay();
  const { data: todaySchedules } = await supabase
    .from("schedules")
    .select("*")
    .eq("user_id", user.id)
    .eq("day_of_week", todayDow)
    .order("start_time", { ascending: true });

  const schedules: Schedule[] = todaySchedules || [];

  // Find next upcoming schedule
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
          <ExamCountdown />
          <TodaySchedule schedules={schedules} />
        </div>
      </section>
    </main>
  );
}
