import {
  createHmac,
  timingSafeEqual,
} from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const paymentKey = body?.paymentKey;
    const orderId = body?.orderId;
    const amount = Number(body?.amount);

    if (
      typeof paymentKey !== 'string' ||
      typeof orderId !== 'string' ||
      !Number.isInteger(amount) ||
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

    // orderId 형식:
    // XATOM-{qty}-{lightQty}-{timestamp}-{nonce}-{signature}
    const parts = orderId.split('-');

    if (parts.length !== 6 || parts[0] !== 'XATOM') {
      return NextResponse.json(
        { error: '유효하지 않은 주문번호입니다.' },
        { status: 400 }
      );
    }

    const [, qtyText, lightQtyText, timestampText, nonce, signature] = parts;

    const qty = Number(qtyText);
    const lightQty = Number(lightQtyText);
    const timestamp = Number(timestampText);

    if (
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 99 ||
      !Number.isInteger(lightQty) ||
      lightQty < 0 ||
      lightQty > qty ||
      !Number.isFinite(timestamp) ||
      !/^[a-f0-9]{8}$/i.test(nonce) ||
      !/^[a-f0-9]{16}$/i.test(signature)
    ) {
      return NextResponse.json(
        { error: '주문정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // prepare API에서 생성한 주문번호인지 서명 검증
    const payload = `XATOM-${qty}-${lightQty}-${timestamp}-${nonce}`;

    const expectedSignature = createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex')
      .slice(0, 16);

    const signatureValid = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!signatureValid) {
      return NextResponse.json(
        { error: '주문번호 검증에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 실제 결제금액을 서버에서 다시 계산
    const expectedAmount =
      OBJECT_PRICE * qty +
      LIGHT_MODULE_PRICE * lightQty;

    if (amount !== expectedAmount) {
      return NextResponse.json(
        { error: '결제금액이 주문금액과 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 검증을 모두 통과한 경우에만 토스 최종 승인 요청
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
