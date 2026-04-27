import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Enable edge runtime for faster cold starts
export const runtime = "edge";

export default async function Home() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Supabase connection error
  }

  redirect("/landing");
}
