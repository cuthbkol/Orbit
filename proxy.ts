import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    if (["/login", "/auth/callback", "/reset-password"].includes(request.nextUrl.pathname)) return NextResponse.next({ request })
    const destination = request.nextUrl.clone()
    destination.pathname = "/login"
    return NextResponse.redirect(destination)
  }

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const isLogin = request.nextUrl.pathname === "/login"
  const isAuthCallback = request.nextUrl.pathname === "/auth/callback"
  const isResetPassword = request.nextUrl.pathname === "/reset-password"
  if (!user && !isLogin && !isAuthCallback && !isResetPassword) {
    const destination = request.nextUrl.clone()
    destination.pathname = "/login"
    destination.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(destination)
  }
  if (user && isLogin) {
    const destination = request.nextUrl.clone()
    destination.pathname = "/"
    destination.search = ""
    return NextResponse.redirect(destination)
  }
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
