import { NextResponse } from 'next/server';
import { getVariantStatuses } from '@/lib/commerce/checkout';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { variantIds?: unknown } | null;
  const ids = Array.isArray(body?.variantIds) ? body.variantIds.filter((id): id is string => typeof id === 'string').slice(0, 100) : [];
  if (!ids.length) return NextResponse.json({ variants: [] });
  try {
    return NextResponse.json({ variants: await getVariantStatuses(ids) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Could not check the basket.' }, { status: 502 });
  }
}
