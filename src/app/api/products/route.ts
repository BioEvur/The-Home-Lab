import { NextResponse } from 'next/server';
import { getProductsByHandles } from '@/lib/commerce';

/** Public product data for client-side lists (wishlist, recently viewed). */
export async function GET(request: Request) {
  const handles = (new URL(request.url).searchParams.get('handles') ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter((h) => /^[a-z0-9-]{1,120}$/.test(h))
    .slice(0, 60);
  if (!handles.length) return NextResponse.json({ products: [] });
  try {
    const products = await getProductsByHandles(handles);
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  } catch {
    return NextResponse.json({ message: 'Products are unavailable.' }, { status: 502 });
  }
}
