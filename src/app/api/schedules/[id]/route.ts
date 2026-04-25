import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE: Remove a schedule
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

// PUT: Update a schedule
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { subject, lecturer, day_of_week, start_time, end_time, room, notes, material_url } = body;

    if (!subject?.trim()) {
      return NextResponse.json(
        { error: "Nama mata kuliah wajib diisi." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("schedules")
      .update({
        subject: subject.trim(),
        lecturer: lecturer?.trim() || null,
        day_of_week,
        start_time,
        end_time,
        room: room?.trim() || null,
        notes: notes?.trim() || null,
        material_url: material_url?.trim() || null,
        material_name: material_url?.trim() ? "Link Materi" : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
