import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO = 'xatom.space@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || '').trim();
    const phone = String(body?.phone || '').trim();
    const email = String(body?.email || '').trim();
    const address = String(body?.address || '').trim();
    const addressDetail = String(body?.addressDetail || '').trim();
    const depositorName = String(body?.depositorName || '').trim();
    const memo = String(body?.memo || '').trim();
    const productName = String(body?.productName || 'verumé').trim();
    const qty = Number(body?.qty || 0);
    const lightModule = Boolean(body?.lightModule);
    const lightQty = Number(body?.lightQty || 0);
    const totalAmount = Number(body?.totalAmount || 0);
    const bankName = String(body?.bankName || '').trim();
    const bankAccount = String(body?.bankAccount || '').trim();
    const accountHolder = String(body?.accountHolder || '').trim();

    if (!name || !phone || !address || !depositorName || !qty || !totalAmount) {
      return NextResponse.json(
        { error: '필수 주문 정보를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    const formattedTotal = new Intl.NumberFormat('ko-KR').format(totalAmount);
    const fullAddress = [address, addressDetail].filter(Boolean).join(' ');

    const result = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'contact@xatom.space',
      to: CONTACT_TO,
      replyTo: email || CONTACT_TO,
      subject: `[xatom Bank Transfer Order] ${name}`,
      text: [
        '계좌이체 주문이 접수되었습니다.',
        '',
        '[주문자 정보]',
        `이름: ${name}`,
        `연락처: ${phone}`,
        `이메일: ${email || '미입력'}`,
        `주소: ${fullAddress}`,
        `입금자명: ${depositorName}`,
        '',
        '[주문 정보]',
        `상품: ${productName}`,
        `수량: ${qty}`,
        `Light Module: ${lightModule ? `선택 / ${lightQty}` : '미선택'}`,
        `총 결제금액: ₩ ${formattedTotal}`,
        '',
        '[판매자 계좌정보]',
        `은행: ${bankName}`,
        `계좌번호: ${bankAccount}`,
        `예금주: ${accountHolder}`,
        '',
        '[요청사항]',
        memo || '없음',
      ].join('\n'),
    });

    if (result.error) {
      console.error('bank transfer order send error', result.error);
      return NextResponse.json(
        { error: result.error.message || '주문 접수에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: result.data?.id ?? null,
    });
  } catch (error) {
    console.error('bank transfer order error', error);
    return NextResponse.json(
      { error: '주문 접수에 실패했습니다.' },
      { status: 500 }
    );
  }
}
