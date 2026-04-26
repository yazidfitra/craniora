import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/dashboard-content";
import type { Schedule } from "@/types/schedule";

export const metadata = {
  title: "Dashboard | Craniora Academy",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const fullName = user.user_metadata?.full_name || user.email || "Mahasiswa";
  const firstName = fullName.split(" ")[0];

  // Fetch today's schedules, admin status, and countdown in parallel
  const todayDow = new Date().getDay();

  const [schedulesResult, adminResult, countdownResult] = await Promise.all([
    supabase
      .from("schedules")
      .select("*")
      .eq("user_id", user.id)
      .eq("day_of_week", todayDow)
      .order("start_time", { ascending: true }),
    supabaseAdmin
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single(),
    supabaseAdmin
      .from("exam_countdowns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const schedules: Schedule[] = schedulesResult.data || [];
  const isAdmin = !!adminResult.data;
  const countdownData = countdownResult.data || null;

  return (
    <DashboardContent
      firstName={firstName}
      initialSchedules={schedules}
      isAdmin={isAdmin}
      initialCountdown={countdownData}
    />
  );
}
