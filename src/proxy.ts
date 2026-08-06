import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // 注入完整请求 URL 到 headers，供 Server Component 获取 searchParams
  res.headers.set('x-url', req.url);

  // Supabase 认证相关代码
  const cookieStore = {
    getAll() {
      return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
    },
    setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
      for (const { name, value, options } of cookiesToSet) {
        res.cookies.set(name, value, options);
      }
    },
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieEncoding: 'base64url',
    cookies: cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 未登录访问后台 → 跳转登录页
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 已登录访问登录页 → 跳转后台
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    // 匹配所有路径，排除 API、Next 内部资源与静态文件
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif|css|js|txt|xml|webmanifest|woff2?)$).*)',
  ],
};
