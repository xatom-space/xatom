import { createHmac, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const qty = Number(body?.qty);
    const lightModule = body?.lightModule === true;
    const requestedLightQty = Number(body?.lightQty);
    const lightQty = lightModule ? requestedLightQty : 0;

    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return NextResponse.json(
        { error: '잘못된 상품 수량입니다.' },
        { status: 400 }
      );
    }

    if (
      lightModule &&
      (!Number.isInteger(lightQty) || lightQty < 1 || lightQty > qty)
    ) {
      return NextResponse.json(
        { error: '잘못된 Light Module 수량입니다.' },
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

    // 결제금액은 브라우저 값이 아니라 서버에서 다시 계산합니다.
    const amount =
      OBJECT_PRICE * qty +
      LIGHT_MODULE_PRICE * lightQty;

    const timestamp = Date.now();
    const nonce = randomBytes(4).toString('hex');

    const payload =
      `XATOM-${qty}-${lightQty}-${timestamp}-${nonce}`;

    // 주문번호 위조를 방지하기 위한 서버 서명
    const signature = createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex')
      .slice(0, 16);

    const orderId = `${payload}-${signature}`;

    const orderName = lightModule
      ? `verumé ${qty}개 + Light Module ${lightQty}개`
      : `verumé ${qty}개`;

    return NextResponse.json({
      orderId,
      orderName,
      amount,
    });
  } catch (error) {
    console.error('Payment prepare error:', error);

    return NextResponse.json(
      { error: '결제 준비 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
