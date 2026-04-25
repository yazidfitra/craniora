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
    const { title, description, category, difficulty, duration_minutes, questions } = body;

    if (!title?.trim()) return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
    if (!questions?.length) return NextResponse.json({ error: "Minimal 1 soal." }, { status: 400 });

    const authorName = user.user_metadata?.full_name || user.email || "Anonymous";

    // Create exam set
    const { data: examSet, error: setError } = await supabaseAdmin
      .from("exam_sets")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || "general",
        difficulty: difficulty || "medium",
        duration_minutes: duration_minutes || 60,
        question_count: questions.length,
        author_name: authorName,
      })
      .select()
      .single();

    if (setError) return NextResponse.json({ error: setError.message }, { status: 500 });

    // Insert questions
    const questionRows = questions.map((q: Record<string, string>, i: number) => ({
      exam_set_id: examSet.id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c || null,
      option_d: q.option_d || null,
      option_e: q.option_e || null,
      correct_answer: q.correct_answer,
      explanation: q.explanation || null,
      sort_order: i,
    }));

    const { error: qError } = await supabaseAdmin
      .from("exam_questions")
      .insert(questionRows);

    if (qError) return NextResponse.json({ error: qError.message }, { status: 500 });

    return NextResponse.json(examSet, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
