import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/profile-form";

export const metadata = {
  title: "Profil | Craniora Academy",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileData = {
    id: user.id,
    email: user.email || "",
    fullName: user.user_metadata?.full_name || "",
    nim: user.user_metadata?.nim || "",
    phone: user.user_metadata?.phone || "",
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  return (
    <main className="flex-1 p-6 md:p-10">
      <ProfileForm user={profileData} />
    </main>
  );
}
