import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");

    let query = supabase
      .from("schedules")
      .select("*")
      .eq("user_id", user.id)
      .order("start_time", { ascending: true });

    if (day !== null) {
      query = query.eq("day_of_week", parseInt(day));
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      console.error("GET /api/schedules DB error:", dbError);
      return NextResponse.json(
        { error: dbError.message, code: dbError.code, hint: dbError.hint },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("GET /api/schedules catch:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

// POST: Create a new schedule
export async function POST(request: Request) {
  try {
    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const supabase = await createClient();

    const body = await request.json();
    const { subject, lecturer, day_of_week, start_time, end_time, room, notes, material_url, category } =
      body;

    if (!subject?.trim()) {
      return NextResponse.json(
        { error: "Nama mata kuliah wajib diisi." },
        { status: 400 }
      );
    }
    if (day_of_week === undefined || day_of_week < 0 || day_of_week > 6) {
      return NextResponse.json(
        { error: "Hari tidak valid." },
        { status: 400 }
      );
    }
    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "Waktu mulai dan selesai wajib diisi." },
        { status: 400 }
      );
    }

    const { data, error: dbError } = await supabase
      .from("schedules")
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        lecturer: lecturer?.trim() || null,
        day_of_week,
        start_time,
        end_time,
        room: room?.trim() || null,
        notes: notes?.trim() || null,
        material_url: material_url?.trim() || null,
        material_name: material_url?.trim() ? "Link Materi" : null,
        category: category || "KP",
      })
      .select()
      .single();

    if (dbError) {
      console.error("POST /api/schedules DB error:", dbError);
      return NextResponse.json(
        { error: dbError.message, code: dbError.code, hint: dbError.hint },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST /api/schedules catch:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
