import Link from 'next/link';

export default async function CancelPage({ searchParams }) {
  const params = (await searchParams) || {};
  const code = typeof params.code === 'string' ? params.code : '';
  const message = typeof params.message === 'string' ? params.message : '';

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-offwhite">
      <div className="w-full max-w-xl border border-white/10 p-10 text-center">
        <p className="thin-title text-[10px] text-accent">Payment</p>
        <h1 className="mt-4 text-3xl font-extralight tracking-[0.1em]">Canceled</h1>
        <p className="mt-6 text-offwhite/70">Your checkout was canceled. You can try again any time.</p>
        {code && <p className="mt-4 text-sm text-offwhite/60">Code: {code}</p>}
        {message && <p className="mt-1 text-sm text-offwhite/60">Message: {message}</p>}
        <Link href="/home#shop" className="mt-10 inline-block border border-accent px-7 py-3 text-xs uppercase tracking-[0.2em] text-accent">
          Return to Shop
        </Link>
      </div>
    </main>
  );
}
