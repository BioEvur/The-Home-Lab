import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { shopifyConfig } from '@/lib/commerce/config';

/**
 * Shopify webhooks. Verifies the HMAC signature before doing anything.
 *  - products/create|update|delete, collections/*  → refresh cached catalogue
 *  - inventory_levels/update                        → refresh availability
 *  - orders/create                                  → acknowledged; order history is read live from Shopify
 */
export async function POST(request: Request) {
  if (!shopifyConfig.webhookSecret) return NextResponse.json({ message: 'Webhooks not configured.' }, { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get('x-shopify-hmac-sha256') ?? '';
  const digest = createHmac('sha256', shopifyConfig.webhookSecret).update(raw, 'utf8').digest('base64');
  const valid = signature.length === digest.length && timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  if (!valid) return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });

  const topic = request.headers.get('x-shopify-topic') ?? '';
  if (topic.startsWith('products/') || topic.startsWith('collections/') || topic.startsWith('inventory_levels/')) {
    revalidateTag('products', 'max');
  }
  return NextResponse.json({ received: true });
}
