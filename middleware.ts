import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          request.cookies
            .getAll()
            .map((c) => ({ name: c.name, value: c.value })),
        setAll: (cookies) => {
          cookies.forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Pages that require authentication
  const authRequiredPages = ["/tasks", "/calendar"];
  // Pages only for non-authenticated users
  const nonAuthPages = ["/", "/about", "/faq"];

  if (!user && authRequiredPages.some((page) => path.startsWith(page))) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (user && nonAuthPages.includes(path)) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
