import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS policies on storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "File dan userId wajib diisi." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File harus berupa gambar." },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 2MB." },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}.${fileExt}`;

    // Read file as ArrayBuffer and upload directly
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload gagal: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("avatars").getPublicUrl(filePath);

    // Update user metadata with avatar URL
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { avatar_url: publicUrl },
      }
    );

    if (updateError) {
      console.error("Update user error:", updateError);
      // Upload succeeded but metadata update failed - still return the URL
      return NextResponse.json({ publicUrl, warning: "Foto terupload tapi metadata gagal diupdate." });
    }

    return NextResponse.json({ publicUrl });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
