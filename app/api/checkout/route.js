import { NextResponse } from 'next/server';

const OBJECT_PRICE_KRW = 248000;
const LIGHT_MODULE_PRICE_KRW = 29000;
const MIN_QTY = 1;
const MAX_QTY = 99;

function toClampedQty(value, fallback = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, Math.floor(num)));
}

function randomOrderId() {
  const rand = Math.random().toString(36).slice(2, 12);
  return `xatom_${Date.now()}_${rand}`.slice(0, 64);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const qty = toClampedQty(body?.qty, 1);
    const lightModule = Boolean(body?.lightModule);
    const lightQty = lightModule ? toClampedQty(body?.lightQty, 1) : 0;

    const amount = OBJECT_PRICE_KRW * qty + (lightModule ? LIGHT_MODULE_PRICE_KRW * lightQty : 0);
    const orderId = randomOrderId();

    const origin =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return NextResponse.json({
      provider: 'toss',
      orderId,
      orderName: lightModule ? `verume + light module (${qty})` : `verume (${qty})`,
      amount,
      successUrl: `${origin}/success`,
      failUrl: `${origin}/cancel`,
      metadata: {
        productId: body?.productId || 'verume',
        qty,
        lightModule,
        lightQty,
      },
    });
  } catch (error) {
    console.error('[CHECKOUT_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to prepare checkout.' }, { status: 500 });
  }
}
