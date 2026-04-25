import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: decks, error } = await supabase
      .from("flashcard_decks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Get progress per deck
    const { data: progress } = await supabase
      .from("flashcard_progress")
      .select("flashcard_id, known, flashcards!inner(deck_id)")
      .eq("user_id", user.id);

    const deckProgress: Record<string, { known: number; total: number }> = {};
    progress?.forEach((p) => {
      const deckId = (p.flashcards as unknown as { deck_id: string }).deck_id;
      if (!deckProgress[deckId]) deckProgress[deckId] = { known: 0, total: 0 };
      deckProgress[deckId].total++;
      if (p.known) deckProgress[deckId].known++;
    });

    return NextResponse.json({ decks: decks || [], progress: deckProgress });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
