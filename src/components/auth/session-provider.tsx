"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isChecking = useRef(false);
  const lastCheck = useRef(0);
  const isIntentionalLogout = useRef(false);

  useEffect(() => {
    const supabase = getSupabase();

    // Minimum 30 seconds between checks to avoid spam
    const MIN_CHECK_INTERVAL = 30 * 1000;

    const checkSession = async () => {
      if (isChecking.current) return;
      if (isIntentionalLogout.current) return;

      // Throttle: don't check more than once per 30 seconds
      const now = Date.now();
      if (now - lastCheck.current < MIN_CHECK_INTERVAL) return;
      lastCheck.current = now;

      isChecking.current = true;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // No session at all
        if (!session) {
          router.push("/login?expired=true");
          return;
        }

        // Check if token is expired (not "about to expire" - let Supabase handle refresh)
        const expiresAt = session.expires_at;
        if (expiresAt) {
          const nowSec = Math.floor(Date.now() / 1000);
          // Only intervene if token expired more than 30 seconds ago
          // (gives Supabase time to auto-refresh)
          if (nowSec > expiresAt + 30) {
            // Try refresh one more time
            const { data, error } = await supabase.auth.refreshSession();
            if (error || !data.session) {
              await supabase.auth.signOut();
              router.push("/login?expired=true");
            }
          }
        }
      } catch {
        // Network error etc - don't logout, just retry later
      } finally {
        isChecking.current = false;
      }
    };

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && !isIntentionalLogout.current) {
        // Wait a bit to confirm it's not a transient state during token refresh
        setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            router.push("/login?expired=true");
          }
        }, 1000);
      }

      if (event === "TOKEN_REFRESHED") {
        // Token was refreshed successfully - update server components
        router.refresh();
      }
    });

    // Check session when user returns to the tab after being away
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Small delay to let browser settle
        setTimeout(checkSession, 2000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Periodic check every 30 minutes (not 10 - Supabase handles refresh automatically)
    // This is just a safety net for edge cases
    const interval = setInterval(checkSession, 30 * 60 * 1000);

    // Listen for intentional logout (from signout form)
    const handleBeforeUnload = () => {
      // If navigating to signout, mark as intentional
      if (pathname?.includes("signout")) {
        isIntentionalLogout.current = true;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [router, pathname]);

  return <>{children}</>;
}
