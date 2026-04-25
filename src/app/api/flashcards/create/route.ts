import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, category, cards } = body;

    if (!title?.trim()) return NextResponse.json({ error: "Judul deck wajib diisi." }, { status: 400 });
    if (!cards?.length) return NextResponse.json({ error: "Minimal 1 kartu." }, { status: 400 });

    const authorName = user.user_metadata?.full_name || user.email || "Anonymous";

    // Create deck
    const { data: deck, error: deckError } = await supabaseAdmin
      .from("flashcard_decks")
      .insert({
        user_id: user.id,
        title: title.trim(),
        category: category || "general",
        card_count: cards.length,
        author_name: authorName,
      })
      .select()
      .single();

    if (deckError) return NextResponse.json({ error: deckError.message }, { status: 500 });

    // Insert cards
    const cardRows = cards.map((c: { front: string; back: string; image_url?: string }, i: number) => ({
      deck_id: deck.id,
      front_text: c.front,
      back_text: c.back,
      image_url: c.image_url || null,
      sort_order: i,
    }));

    const { error: cardError } = await supabaseAdmin
      .from("flashcards")
      .insert(cardRows);

    if (cardError) return NextResponse.json({ error: cardError.message }, { status: 500 });

    return NextResponse.json(deck, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
