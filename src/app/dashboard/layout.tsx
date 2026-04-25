import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import SessionProvider from "@/components/auth/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name || user.email || "";
  const email = user.email || "";
  const avatarUrl = user.user_metadata?.avatar_url || null;

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background text-on-surface">
        <DashboardShell
          fullName={fullName}
          email={email}
          avatarUrl={avatarUrl}
        >
          {children}
        </DashboardShell>
      </div>
    </SessionProvider>
  );
}
