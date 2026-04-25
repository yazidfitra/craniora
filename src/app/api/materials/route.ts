import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch shared materials
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseAdmin
      .from("shared_materials")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}

// POST: Upload new shared material
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const pageCount = formData.get("page_count") as string;
    const file = formData.get("file") as File | null;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
    }

    const fullName = user.user_metadata?.full_name || user.email || "Anonymous";

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;

    // Upload file if provided
    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Ukuran file maksimal 10MB." }, { status: 400 });
      }

      const fileExt = file.name.split(".").pop() || "pdf";
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from("materials")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: `Upload gagal: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from("materials")
        .getPublicUrl(filePath);

      fileUrl = publicUrl;
      fileName = file.name;
      fileSize = file.size;
    }

    // Insert record
    const { data, error } = await supabaseAdmin
      .from("shared_materials")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || "notes",
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        author_name: fullName,
        page_count: pageCount ? parseInt(pageCount) : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
