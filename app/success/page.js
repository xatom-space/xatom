import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-offwhite">
      <div className="w-full max-w-xl border border-white/10 p-10 text-center">
        <p className="thin-title text-[10px] text-accent">Payment</p>
        <h1 className="mt-4 text-3xl font-extralight tracking-[0.1em]">Success</h1>
        <p className="mt-6 text-offwhite/70">Your checkout is complete. Thank you for your order.</p>
        <Link href="/home" className="mt-10 inline-block border border-accent px-7 py-3 text-xs uppercase tracking-[0.2em] text-accent">
          Back Home
        </Link>
      </div>
    </main>
  );
}
