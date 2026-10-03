import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Route yang butuh sesi login (HANDOFF Bagian 5.C)
const AUTH_ROUTES = ["/cart", "/checkout", "/items/new", "/account", "/orders", "/seller/orders", "/admin"];
// Route khusus tamu — sudah login? lempar ke beranda
const GUEST_ROUTES = ["/login", "/register"];

function matches(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needAuth = matches(pathname, AUTH_ROUTES);
  const guestOnly = matches(pathname, GUEST_ROUTES);
  if (!needAuth && !guestOnly) return NextResponse.next();

  // pola resmi @supabase/ssr: cookie dibaca dari request, ditulis ke response
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // redirect memakai helper agar cookie hasil mutasi (mis. signOut) ikut terbawa —
  // kalau tidak, sesi blokir tidak pernah terhapus dan memicu loop redirect.
  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    const res = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (needAuth && !user) return redirectTo("/login");

  if (user) {
    // Aturan bisnis 6: user diblokir admin tidak boleh masuk route auth.
    const { data: profile } = await supabase
      .from("users")
      .select("is_blocked")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_blocked) {
      await supabase.auth.signOut();
      return redirectTo("/login", "?blokir=1");
    }

    if (guestOnly) return redirectTo("/");
  }

  return response;
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/items/new",
    "/account/:path*",
    "/orders/:path*",
    "/seller/orders/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
