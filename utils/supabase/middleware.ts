import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
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

  await supabase.auth.getUser();

  return response;
};
