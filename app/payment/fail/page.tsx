'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentFailPage() {
  const [message, setMessage] = useState('결제가 완료되지 않았습니다.');
  const [code, setCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const errorMessage = params.get('message');
    const errorCode = params.get('code');

    if (errorMessage) setMessage(errorMessage);
    if (errorCode) setCode(errorCode);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-black/50">
          Payment
        </p>

        <h1 className="mt-5 text-2xl font-bold">
          결제가 완료되지 않았습니다
        </h1>

        <p className="mt-5 text-sm leading-6 text-black/60">
          {message}
        </p>

        {code ? (
          <p className="mt-3 text-xs text-black/40">
            오류 코드: {code}
          </p>
        ) : null}

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
