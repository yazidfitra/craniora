import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("exam_sets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Get user's attempt progress for each exam
    const { data: attempts } = await supabase
      .from("exam_attempts")
      .select("exam_set_id, score, total_questions, is_completed")
      .eq("user_id", user.id);

    const progressMap: Record<string, { score: number; total: number; completed: boolean }> = {};
    attempts?.forEach((a) => {
      if (!progressMap[a.exam_set_id] || a.is_completed) {
        progressMap[a.exam_set_id] = {
          score: a.score || 0,
          total: a.total_questions || 0,
          completed: a.is_completed,
        };
      }
    });

    return NextResponse.json({ exams: data || [], progress: progressMap });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
