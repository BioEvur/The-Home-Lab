import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Session refresh is only needed where customer state is read.
  matcher: ['/account/:path*', '/wishlist', '/cart', '/auth/:path*'],
};
