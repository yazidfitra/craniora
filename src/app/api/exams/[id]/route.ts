import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET exam with questions
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const { data: exam, error: examError } = await supabase
      .from("exam_sets")
      .select("*")
      .eq("id", id)
      .single();

    if (examError) return NextResponse.json({ error: examError.message }, { status: 404 });

    const { data: questions } = await supabase
      .from("exam_questions")
      .select("*")
      .eq("exam_set_id", id)
      .order("sort_order", { ascending: true });

    // Get or create attempt
    let { data: attempt } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("exam_set_id", id)
      .eq("is_completed", false)
      .single();

    if (!attempt) {
      const { data: newAttempt } = await supabase
        .from("exam_attempts")
        .insert({
          user_id: user.id,
          exam_set_id: id,
          total_questions: questions?.length || 0,
        })
        .select()
        .single();
      attempt = newAttempt;
    }

    return NextResponse.json({ exam, questions: questions || [], attempt });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT: Save answer or finish exam
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { attemptId, answers, finish } = body;

    const updateData: Record<string, unknown> = { answers };

    if (finish) {
      // Calculate score
      const { data: questions } = await supabase
        .from("exam_questions")
        .select("id, correct_answer")
        .eq("exam_set_id", id);

      let score = 0;
      questions?.forEach((q) => {
        if (answers[q.id] === q.correct_answer) score++;
      });

      updateData.score = score;
      updateData.total_questions = questions?.length || 0;
      updateData.is_completed = true;
      updateData.finished_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("exam_attempts")
      .update(updateData)
      .eq("id", attemptId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Remove an exam set (cascades to questions)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await supabase.from("exam_attempts").delete().eq("exam_set_id", id).eq("user_id", user.id);

    const { error } = await supabase
      .from("exam_sets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
