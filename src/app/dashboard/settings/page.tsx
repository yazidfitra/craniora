import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Pengaturan | Craniora Academy",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 pt-8 space-y-8">
      <section className="space-y-1">
        <h1 className="font-[var(--font-heading)] text-primary-container text-4xl font-bold">
          Pengaturan
        </h1>
        <p className="text-secondary text-base">
          Kelola preferensi dan pengaturan akun Anda
        </p>
      </section>

      <div className="bg-surface-card rounded-2xl border border-primary-50 p-8 text-center shadow-sm">
        <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary-container mb-2">
          Halaman Pengaturan
        </h3>
        <p className="text-sm text-slate-400">
          Fitur pengaturan akan segera hadir.
        </p>
      </div>
    </main>
  );
}
