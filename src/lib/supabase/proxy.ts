import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from './config';

const PUBLIC_ACCOUNT_ROUTES = ['/account/login', '/account/register', '/account/forgot-password', '/account/reset-password'];

/**
 * Refreshes the Supabase session cookie on each request and protects
 * /account routes. While Supabase is not configured, account pages render an
 * explicit setup state instead of redirecting.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith('/account') && !PUBLIC_ACCOUNT_ROUTES.some((r) => path.startsWith(r));

  if (isProtected && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = '/account/login';
    url.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }
  if (data.user && (path === '/account/login' || path === '/account/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/account';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return response;
}
