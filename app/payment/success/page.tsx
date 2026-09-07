'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type PaymentResult = {
  orderId?: string;
  orderName?: string;
  totalAmount?: number;
  method?: string;
  approvedAt?: string;
};

export default function PaymentSuccessPage() {
  const startedRef = useRef(false);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('결제를 확인하고 있습니다.');
  const [payment, setPayment] = useState<PaymentResult | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const confirmPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const paymentKey = params.get('paymentKey');
        const orderId = params.get('orderId');
        const amountText = params.get('amount');
        const amount = Number(amountText);

        if (
          !paymentKey ||
          !orderId ||
          !Number.isInteger(amount) ||
          amount <= 0
        ) {
          throw new Error('결제 정보가 올바르지 않습니다.');
        }

        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.error ||
              '결제 승인에 실패했습니다.'
          );
        }

        setPayment({
          orderId: result?.orderId,
          orderName: result?.orderName,
          totalAmount: result?.totalAmount,
          method: result?.method,
          approvedAt: result?.approvedAt,
        });

        setStatus('success');
        setMessage('결제가 완료되었습니다.');
      } catch (error) {
        console.error('Payment confirmation error:', error);

        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : '결제 승인 중 오류가 발생했습니다.'
        );
      }
    };

    confirmPayment();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-black/50">
          Payment
        </p>

        {status === 'loading' ? (
          <>
            <h1 className="mt-5 text-2xl font-semibold">
              결제를 처리하고 있습니다
            </h1>

            <p className="mt-5 text-sm text-black/60">
              창을 닫거나 새로고침하지 마세요.
            </p>
          </>
        ) : null}

        {status === 'success' ? (
          <>
            <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#0064FF] text-3xl font-bold text-white">
              ✓
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              결제가 완료되었습니다
            </h1>

            <p className="mt-4 text-sm text-black/60">
              주문해 주셔서 감사합니다.
            </p>

            <div className="mt-8 space-y-3 border-y border-black/10 py-6 text-left text-sm">
              {payment?.orderName ? (
                <div className="flex justify-between gap-6">
                  <span className="text-black/50">상품</span>
                  <span className="text-right">{payment.orderName}</span>
                </div>
              ) : null}

              {payment?.totalAmount ? (
                <div className="flex justify-between gap-6">
                  <span className="text-black/50">결제금액</span>
                  <span className="font-semibold">
                    ₩ {payment.totalAmount.toLocaleString('ko-KR')}
                  </span>
                </div>
              ) : null}

              {payment?.method ? (
                <div className="flex justify-between gap-6">
                  <span className="text-black/50">결제수단</span>
                  <span>{payment.method}</span>
                </div>
              ) : null}

              {payment?.orderId ? (
                <div className="flex justify-between gap-6">
                  <span className="text-black/50">주문번호</span>
                  <span className="break-all text-right text-xs">
                    {payment.orderId}
                  </span>
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {status === 'error' ? (
          <>
            <h1 className="mt-5 text-2xl font-bold">
              결제를 완료하지 못했습니다
            </h1>

            <p className="mt-5 text-sm leading-6 text-red-600">
              {message}
            </p>

            <p className="mt-3 text-xs leading-5 text-black/40">
              결제 내역을 확인한 뒤 다시 시도해 주세요.
            </p>
          </>
        ) : null}

        {status !== 'loading' ? (
          <Link
            href="/products/verume"
            className="mt-8 inline-block border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Back to Product
          </Link>
        ) : null}
      </div>
    </main>
  );
}
