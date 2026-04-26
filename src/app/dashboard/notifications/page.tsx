import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";

export const metadata = {
  title: "Notifikasi | Craniora Academy",
};

export default async function NotificationsPage() {
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
          Notifikasi
        </h1>
        <p className="text-secondary text-base">
          Lihat semua notifikasi dan pengumuman penting
        </p>
      </section>

      <div className="bg-surface-card rounded-2xl border border-primary-50 p-8 text-center shadow-sm">
        <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary-container mb-2">
          Belum Ada Notifikasi
        </h3>
        <p className="text-sm text-slate-400">
          Notifikasi akan muncul di sini ketika ada update penting.
        </p>
      </div>
    </main>
  );
}
