import Link from 'next/link';

function formatKRW(amount) {
  if (typeof amount !== 'number') return '-';
  return new Intl.NumberFormat('ko-KR').format(amount);
}

async function confirmTossPayment({ paymentKey, orderId, amount }) {
  const secretKey = process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    return { error: 'Toss is not configured. Set TOSS_SECRET_KEY.' };
  }

  const encrypted = Buffer.from(`${secretKey}:`).toString('base64');

  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encrypted}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: 'no-store',
  });

  const data = await tossRes.json();

  if (!tossRes.ok) {
    return { error: data?.message || 'Payment confirmation failed.' };
  }

  return {
    orderId: data?.orderId,
    totalAmount: data?.totalAmount,
  };
}

export default async function SuccessPage({ searchParams }) {
  const params = (await searchParams) || {};
  const paymentKey = typeof params.paymentKey === 'string' ? params.paymentKey : '';
  const orderId = typeof params.orderId === 'string' ? params.orderId : '';
  const amountRaw = typeof params.amount === 'string' ? Number(params.amount) : NaN;
  const amount = Number.isFinite(amountRaw) ? amountRaw : NaN;

  let loadingLikeMessage = '';
  let error = '';
  let result = null;

  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    error = 'Invalid payment response. Missing payment parameters.';
  } else {
    const confirmed = await confirmTossPayment({ paymentKey, orderId, amount });
    if (confirmed?.error) {
      error = confirmed.error;
    } else {
      result = confirmed;
    }
  }

  if (!error && !result) {
    loadingLikeMessage = 'We are confirming your payment.';
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-offwhite">
      <div className="w-full max-w-xl border border-white/10 p-10 text-center">
        <p className="thin-title text-[10px] text-accent">Payment</p>

        {loadingLikeMessage ? (
          <>
            <h1 className="mt-4 text-3xl font-extralight tracking-[0.1em]">Checking</h1>
            <p className="mt-6 text-offwhite/70">{loadingLikeMessage}</p>
          </>
        ) : error ? (
          <>
            <h1 className="mt-4 text-3xl font-extralight tracking-[0.1em]">Failed</h1>
            <p className="mt-6 text-offwhite/70">{error}</p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-3xl font-extralight tracking-[0.1em]">Success</h1>
            <p className="mt-6 text-offwhite/70">Your payment is complete. Thank you for your order.</p>
            <p className="mt-4 text-sm text-offwhite/60">Order ID: {result?.orderId}</p>
            <p className="mt-1 text-sm text-offwhite/60">Amount: ₩ {formatKRW(result?.totalAmount)}</p>
          </>
        )}

        <Link href="/home" className="mt-10 inline-block border border-accent px-7 py-3 text-xs uppercase tracking-[0.2em] text-accent">
          Back Home
        </Link>
      </div>
    </main>
  );
}
