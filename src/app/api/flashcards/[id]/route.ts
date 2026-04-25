import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET deck with cards
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const { data: deck } = await supabase
      .from("flashcard_decks")
      .select("*")
      .eq("id", id)
      .single();

    const { data: cards } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", id)
      .order("sort_order", { ascending: true });

    const { data: progress } = await supabase
      .from("flashcard_progress")
      .select("flashcard_id, known")
      .eq("user_id", user.id);

    const progressMap: Record<string, boolean> = {};
    progress?.forEach((p) => { progressMap[p.flashcard_id] = p.known; });

    return NextResponse.json({ deck, cards: cards || [], progress: progressMap });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Update card progress (known/unknown)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await params; // deck id not needed for progress
    const { flashcardId, known } = await request.json();

    const { error } = await supabase
      .from("flashcard_progress")
      .upsert({
        user_id: user.id,
        flashcard_id: flashcardId,
        known,
        reviewed_at: new Date().toISOString(),
      }, { onConflict: "user_id,flashcard_id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove a flashcard deck (cascades to cards)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const { error } = await supabase
      .from("flashcard_decks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
