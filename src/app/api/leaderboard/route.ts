import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ContributorStats {
  user_id: string;
  name: string;
  notes_count: number;
  exams_count: number;
  flashcards_count: number;
  total: number;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch all contributions grouped by user
    const [matRes, examRes, fcRes] = await Promise.all([
      supabaseAdmin.from("shared_materials").select("user_id, author_name"),
      supabaseAdmin.from("exam_sets").select("user_id, author_name"),
      supabaseAdmin.from("flashcard_decks").select("user_id, author_name"),
    ]);

    const statsMap: Record<string, ContributorStats> = {};

    const addToStats = (
      items: { user_id: string; author_name: string | null }[] | null,
      field: "notes_count" | "exams_count" | "flashcards_count"
    ) => {
      items?.forEach((item) => {
        if (!statsMap[item.user_id]) {
          statsMap[item.user_id] = {
            user_id: item.user_id,
            name: item.author_name || "Anonymous",
            notes_count: 0,
            exams_count: 0,
            flashcards_count: 0,
            total: 0,
          };
        }
        if (item.author_name) statsMap[item.user_id].name = item.author_name;
        statsMap[item.user_id][field]++;
        statsMap[item.user_id].total++;
      });
    };

    addToStats(matRes.data, "notes_count");
    addToStats(examRes.data, "exams_count");
    addToStats(fcRes.data, "flashcards_count");

    // Sort by total descending
    const leaderboard = Object.values(statsMap).sort((a, b) => b.total - a.total);

    return NextResponse.json({
      leaderboard,
      currentUserId: user.id,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
