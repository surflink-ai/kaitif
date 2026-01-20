import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Valid admin roles (USER < ADMIN < SUPERADMIN)
const ADMIN_ROLES = ["ADMIN", "SUPERADMIN"] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

function isAdminRole(role: string | null | undefined): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

export async function updateSession(request: NextRequest) {
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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              domain: process.env.NODE_ENV === 'production' ? '.kaitif.com' : undefined,
            })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes pattern
  const isDashboardRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname === "/";
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  if (isDashboardRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check for ADMIN or SUPERADMIN role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role;

    // Only ADMIN and SUPERADMIN can access the admin dashboard
    if (!isAdminRole(userRole)) {
      // Redirect unauthorized users (USER role or no role)
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Add role to response headers for client-side use
    supabaseResponse.headers.set("x-user-role", userRole);
  }

  if (isAuthRoute && user) {
    // Check if user has admin role before redirecting
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (isAdminRole(profile?.role)) {
      // If logged in with admin role, redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    // If logged in but not admin, stay on login page (will show unauthorized error)
  }

  return supabaseResponse;
}
