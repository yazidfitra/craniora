import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .single();
  return !!data;
}

// GET: Fetch the active countdown (latest one)
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("exam_countdowns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || null);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST: Create or update countdown (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(user.id))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat mengatur countdown." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { exam_name, exam_date } = body;

    if (!exam_name?.trim()) {
      return NextResponse.json(
        { error: "Nama ujian wajib diisi." },
        { status: 400 }
      );
    }
    if (!exam_date) {
      return NextResponse.json(
        { error: "Tanggal ujian wajib diisi." },
        { status: 400 }
      );
    }

    // Delete all existing countdowns, then insert new one (only 1 active at a time)
    await supabaseAdmin.from("exam_countdowns").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const { data, error } = await supabaseAdmin
      .from("exam_countdowns")
      .insert({
        exam_name: exam_name.trim(),
        exam_date,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE: Remove countdown (admin only)
export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(user.id))) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat menghapus countdown." },
        { status: 403 }
      );
    }

    await supabaseAdmin.from("exam_countdowns").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
