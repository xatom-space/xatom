import { createHmac, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 주문자 정보
    const name = String(body?.name || '').trim();
    const phone = String(body?.phone || '').trim();
    const email = String(body?.email || '').trim();
    const address = String(body?.address || '').trim();
    const addressDetail = String(body?.addressDetail || '').trim();
    const memo = String(body?.memo || '').trim();

    // 상품 정보
    const qty = Number(body?.qty);
    const lightModule = body?.lightModule === true;
    const requestedLightQty = Number(body?.lightQty);
    const lightQty = lightModule ? requestedLightQty : 0;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: '이름, 연락처, 배송주소를 입력해 주세요.' },
        { status: 400 }
      );
    }

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

    // 결제금액은 반드시 서버에서 계산
    const amount =
      OBJECT_PRICE * qty +
      LIGHT_MODULE_PRICE * lightQty;

    const timestamp = Date.now();
    const nonce = randomBytes(4).toString('hex');

    const orderIdPayload =
      `XATOM-${qty}-${lightQty}-${timestamp}-${nonce}`;

    const orderIdSignature = createHmac('sha256', secretKey)
      .update(orderIdPayload)
      .digest('hex')
      .slice(0, 16);

    const orderId = `${orderIdPayload}-${orderIdSignature}`;

    const orderName = lightModule
      ? `verumé ${qty}개 + Light Module ${lightQty}개`
      : `verumé ${qty}개`;

    /*
     * 결제 완료 후 confirm API에서 주문자 정보를 사용할 수 있도록
     * 서버 서명이 적용된 HttpOnly 쿠키에 임시 보관합니다.
     */
    const orderData = {
      orderId,
      orderName,
      amount,
      name,
      phone,
      email,
      address,
      addressDetail,
      memo,
      qty,
      lightModule,
      lightQty,
      createdAt: timestamp,
    };

    const encodedOrderData = Buffer.from(
      JSON.stringify(orderData)
    ).toString('base64url');

    const cookieSignature = createHmac('sha256', secretKey)
      .update(encodedOrderData)
      .digest('hex');

    const response = NextResponse.json({
      orderId,
      orderName,
      amount,
    });

    response.cookies.set({
      name: 'xatom_payment_order',
      value: `${encodedOrderData}.${cookieSignature}`,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30,
    });

    return response;
  } catch (error) {
    console.error('Payment prepare error:', error);

    return NextResponse.json(
      { error: '결제 준비 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
