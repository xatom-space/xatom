import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Toss is not configured. Set TOSS_SECRET_KEY.' },
        { status: 500 }
      );
    }

    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid payment confirmation payload.' }, { status: 400 });
    }

    const encrypted = Buffer.from(`${secretKey}:`).toString('base64');

    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encrypted}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await tossRes.json();

    if (!tossRes.ok) {
      return NextResponse.json(
        { error: data?.message || 'Payment confirmation failed.', code: data?.code },
        { status: tossRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: data?.orderId,
      method: data?.method,
      totalAmount: data?.totalAmount,
      approvedAt: data?.approvedAt,
    });
  } catch (error) {
    console.error('[TOSS_CONFIRM_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to confirm payment.' }, { status: 500 });
  }
}
