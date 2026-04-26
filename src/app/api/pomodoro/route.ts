import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch leaderboard + user stats
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Leaderboard: total minutes per user (all time)
    const { data: allSessions } = await supabaseAdmin
      .from("pomodoro_sessions")
      .select("user_id, duration_minutes");

    // Aggregate per user
    const userStats: Record<string, { minutes: number; count: number }> = {};
    allSessions?.forEach((s) => {
      if (!userStats[s.user_id]) userStats[s.user_id] = { minutes: 0, count: 0 };
      userStats[s.user_id].minutes += s.duration_minutes;
      userStats[s.user_id].count++;
    });

    // Get user names from auth
    const userIds = Object.keys(userStats);
    const leaderboard: { user_id: string; name: string; minutes: number; count: number }[] = [];

    if (userIds.length > 0) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });
      const nameMap: Record<string, string> = {};
      users?.users?.forEach((u) => {
        nameMap[u.id] = u.user_metadata?.full_name || u.email || "Anonymous";
      });

      userIds.forEach((uid) => {
        leaderboard.push({
          user_id: uid,
          name: nameMap[uid] || "Anonymous",
          minutes: userStats[uid].minutes,
          count: userStats[uid].count,
        });
      });
    }

    leaderboard.sort((a, b) => b.minutes - a.minutes);

    // User's today stats
    const { data: todaySessions } = await supabase
      .from("pomodoro_sessions")
      .select("duration_minutes")
      .eq("user_id", user.id)
      .gte("completed_at", todayStart.toISOString());

    const todayMinutes = todaySessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
    const todayCount = todaySessions?.length || 0;

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, 20),
      currentUserId: user.id,
      today: { minutes: todayMinutes, count: todayCount },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST: Save completed pomodoro session
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { duration_minutes, task } = await request.json();

    const { error } = await supabaseAdmin
      .from("pomodoro_sessions")
      .insert({
        user_id: user.id,
        duration_minutes: duration_minutes || 25,
        task: task?.trim() || null,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
