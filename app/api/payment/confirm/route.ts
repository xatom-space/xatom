import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;
const CONTACT_TO = 'xatom.space@gmail.com';
const ORDER_COOKIE = 'xatom_payment_order';
const MAX_ORDER_AGE = 30 * 60 * 1000;

type OrderData = {
  orderId: string;
  orderName: string;
  amount: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  addressDetail: string;
  memo: string;
  qty: number;
  lightModule: boolean;
  lightQty: number;
  createdAt: number;
  notified?: boolean;
};

function verifySignedOrderCookie(
  request: NextRequest,
  secretKey: string
): OrderData {
  const cookie = request.cookies.get(ORDER_COOKIE)?.value;

  if (!cookie) {
    throw new Error('주문정보를 찾을 수 없습니다.');
  }

  const separatorIndex = cookie.lastIndexOf('.');

  if (separatorIndex <= 0) {
    throw new Error('잘못된 주문정보입니다.');
  }

  const encodedData = cookie.slice(0, separatorIndex);
  const signature = cookie.slice(separatorIndex + 1);

  const expectedSignature = createHmac('sha256', secretKey)
    .update(encodedData)
    .digest('hex');

  if (
    signature.length !== expectedSignature.length ||
    !timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    throw new Error('주문정보 검증에 실패했습니다.');
  }

  const data = JSON.parse(
    Buffer.from(encodedData, 'base64url').toString('utf8')
  ) as OrderData;

  if (
    !data.orderId ||
    !data.name ||
    !data.phone ||
    !data.address ||
    !Number.isInteger(data.amount) ||
    !Number.isFinite(data.createdAt)
  ) {
    throw new Error('주문정보가 올바르지 않습니다.');
  }

  if (Date.now() - data.createdAt > MAX_ORDER_AGE) {
    throw new Error('결제 유효시간이 만료되었습니다.');
  }

  return data;
}

function createSignedOrderCookie(
  orderData: OrderData,
  secretKey: string
) {
  const encodedData = Buffer.from(
    JSON.stringify(orderData)
  ).toString('base64url');

  const signature = createHmac('sha256', secretKey)
    .update(encodedData)
    .digest('hex');

  return `${encodedData}.${signature}`;
}

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
        { error: '결제 서버 설정을 확인해 주세요.' },
        { status: 500 }
      );
    }

    // 결제 전에 저장해 둔 주문/배송정보 확인
    const orderData = verifySignedOrderCookie(request, secretKey);

    if (orderData.orderId !== orderId) {
      return NextResponse.json(
        { error: '주문번호가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // orderId 자체의 서버 서명도 검증
    const parts = orderId.split('-');

    if (parts.length !== 6 || parts[0] !== 'XATOM') {
      return NextResponse.json(
        { error: '유효하지 않은 주문번호입니다.' },
        { status: 400 }
      );
    }

    const [
      ,
      qtyText,
      lightQtyText,
      timestampText,
      nonce,
      signature,
    ] = parts;

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
        { error: '주문번호가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const orderPayload =
      `XATOM-${qty}-${lightQty}-${timestamp}-${nonce}`;

    const expectedOrderSignature = createHmac(
      'sha256',
      secretKey
    )
      .update(orderPayload)
      .digest('hex')
      .slice(0, 16);

    if (
      !timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedOrderSignature)
      )
    ) {
      return NextResponse.json(
        { error: '주문번호 검증에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 금액을 서버에서 다시 계산
    const expectedAmount =
      OBJECT_PRICE * qty +
      LIGHT_MODULE_PRICE * lightQty;

    if (
      amount !== expectedAmount ||
      orderData.amount !== expectedAmount ||
      orderData.qty !== qty ||
      orderData.lightQty !== lightQty
    ) {
      return NextResponse.json(
        { error: '결제금액이 주문금액과 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    const authorization = `Basic ${Buffer.from(
      `${secretKey}:`
    ).toString('base64')}`;

    // 토스 최종 승인
    const tossResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    let payment = await tossResponse.json();

    /*
     * 사용자가 성공 페이지를 새로고침한 경우 이미 승인된 결제일 수 있으므로
     * paymentKey로 다시 조회해서 정상 결제인지 확인합니다.
     */
    if (!tossResponse.ok) {
      const lookupResponse = await fetch(
        `https://api.tosspayments.com/v1/payments/${encodeURIComponent(
          paymentKey
        )}`,
        {
          headers: {
            Authorization: authorization,
          },
        }
      );

      if (!lookupResponse.ok) {
        return NextResponse.json(payment, {
          status: tossResponse.status,
        });
      }

      payment = await lookupResponse.json();
    }

    if (
      payment?.orderId !== orderId ||
      Number(payment?.totalAmount) !== amount
    ) {
      return NextResponse.json(
        { error: '토스 결제정보가 주문정보와 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    if (payment?.status !== 'DONE') {
      return NextResponse.json(
        { error: '결제가 아직 완료되지 않았습니다.' },
        { status: 409 }
      );
    }

    let notificationSent = orderData.notified === true;

    // 이미 메일을 보낸 주문이 아니면 판매자에게 주문 메일 전송
    if (!notificationSent) {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (!resendApiKey) {
        console.error('RESEND_API_KEY is not configured');
      } else {
        const resend = new Resend(resendApiKey);

        const fullAddress = [
          orderData.address,
          orderData.addressDetail,
        ]
          .filter(Boolean)
          .join(' ');

        const formattedAmount = new Intl.NumberFormat(
          'ko-KR'
        ).format(amount);

        const emailResult = await resend.emails.send({
          from:
            process.env.CONTACT_FROM_EMAIL ||
            'contact@xatom.space',
          to: CONTACT_TO,
          replyTo: orderData.email || CONTACT_TO,
          subject: `[xatom Card Payment] ${orderData.name}`,
          text: [
            '카드/간편결제 주문이 완료되었습니다.',
            '',
            '[주문자 정보]',
            `이름: ${orderData.name}`,
            `연락처: ${orderData.phone}`,
            `이메일: ${orderData.email || '미입력'}`,
            `배송주소: ${fullAddress}`,
            '',
            '[주문 정보]',
            `상품: ${orderData.orderName}`,
            `수량: ${orderData.qty}`,
            `Light Module: ${
              orderData.lightModule
                ? `선택 / ${orderData.lightQty}`
                : '미선택'
            }`,
            `결제금액: ₩ ${formattedAmount}`,
            `주문번호: ${orderId}`,
            '',
            '[결제 정보]',
            `결제수단: ${payment?.method || '미확인'}`,
            `승인시각: ${payment?.approvedAt || '미확인'}`,
            '',
            '[요청사항]',
            orderData.memo || '없음',
          ].join('\n'),
        });

        if (emailResult.error) {
          console.error(
            'card payment order email error',
            emailResult.error
          );
        } else {
          notificationSent = true;
        }
      }
    }

    const response = NextResponse.json({
      ...payment,
      orderNotificationSent: notificationSent,
    });

    /*
     * 성공 메일이 한 번 발송된 뒤 새로고침해도
     * 같은 주문 메일이 중복 발송되지 않도록 표시합니다.
     */
    if (notificationSent) {
      response.cookies.set({
        name: ORDER_COOKIE,
        value: createSignedOrderCookie(
          {
            ...orderData,
            notified: true,
          },
          secretKey
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch (error) {
    console.error('Toss payment confirm error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '결제 승인 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
