import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const paymentKey = body?.paymentKey;
    const orderId = body?.orderId;
    const amount = Number(body?.amount);

    if (
      typeof paymentKey !== 'string' ||
      typeof orderId !== 'string' ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        { error: '잘못된 결제 정보입니다.' },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: 'TOSS_SECRET_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const encodedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

    const tossResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encodedSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const result = await tossResponse.json();

    if (!tossResponse.ok) {
      return NextResponse.json(result, {
        status: tossResponse.status,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Toss payment confirm error:', error);

    return NextResponse.json(
      { error: '결제 승인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
