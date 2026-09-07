'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setOrderId(params.get('orderId') || '');
    setAmount(params.get('amount') || '');
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-black/50">
          Payment
        </p>

        <h1 className="mt-5 text-2xl font-semibold">
          결제 인증이 완료되었습니다
        </h1>

        <p className="mt-5 text-sm leading-6 text-black/60">
          안전한 결제 승인을 위해 주문 정보를 확인하고 있습니다.
        </p>

        {orderId ? (
          <div className="mt-8 border-t border-black/10 pt-6 text-sm">
            <p>주문번호: {orderId}</p>

            {amount ? (
              <p className="mt-2">
                결제금액: ₩ {Number(amount).toLocaleString('ko-KR')}
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-8 text-xs leading-5 text-black/40">
          현재는 결제 승인 기능을 준비 중입니다.
          실제 결제 승인은 아직 실행되지 않습니다.
        </p>

        <Link
          href="/products/verume"
          className="mt-8 inline-block border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
        >
          Back to Product
        </Link>
      </div>
    </main>
  );
}
