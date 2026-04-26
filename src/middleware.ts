import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This refreshes the session if expired and sets new cookies
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user had a session cookie but it's now invalid (expired)
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  // Auth/public pages - redirect to dashboard if already logged in
  const authPages = ["/login", "/register", "/landing"];
  const isAuthPage = authPages.some(
    (page) => request.nextUrl.pathname === page
  );

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Protected pages - redirect to login if not logged in
  const protectedPages = ["/dashboard"];
  const isProtectedPage = protectedPages.some((page) =>
    request.nextUrl.pathname.startsWith(page)
  );

  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";

    // If user had auth cookies but session is gone -> session expired
    if (hasAuthCookie) {
      url.searchParams.set("expired", "true");
    }

    // Clear stale auth cookies
    const response = NextResponse.redirect(url);
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.startsWith("sb-")) {
        response.cookies.delete(cookie.name);
      }
    });

    return response;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
