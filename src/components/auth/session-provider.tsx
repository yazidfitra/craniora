"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isChecking = useRef(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const supabase = getSupabase();

    const checkSession = async () => {
      if (isChecking.current) return;
      isChecking.current = true;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login?expired=true");
          return;
        }

        const expiresAt = session.expires_at;
        if (expiresAt) {
          const now = Math.floor(Date.now() / 1000);
          if (now >= expiresAt) {
            const { data, error } = await supabase.auth.refreshSession();
            if (error || !data.session) {
              await supabase.auth.signOut();
              router.push("/login?expired=true");
            }
          }
        }
      } catch {
        // Ignore - will retry next trigger
      } finally {
        isChecking.current = false;
      }
    };

    const debouncedCheck = () => {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(checkSession, 1500);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
              router.push("/login?expired=true");
            }
          });
        }, 500);
      }
      if (event === "TOKEN_REFRESHED") {
        router.refresh();
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        debouncedCheck();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(checkSession, 10 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      clearTimeout(debounceTimer.current);
    };
  }, [router]);

  return <>{children}</>;
}
