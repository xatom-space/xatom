'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function formatKRW(n: number) {
  return new Intl.NumberFormat('ko-KR').format(n);
}

export default function VerumeProductPage() {
  const [qty, setQty] = useState(1);
  const [lightModule, setLightModule] = useState(false);
  const [lightQty, setLightQty] = useState(1);

  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState('');

  const total = useMemo(() => {
    const objectTotal = OBJECT_PRICE * qty;
    const lightTotal = lightModule ? LIGHT_MODULE_PRICE * lightQty : 0;
    return objectTotal + lightTotal;
  }, [qty, lightModule, lightQty]);

  const decQty = () => setQty((v) => Math.max(1, v - 1));
  const incQty = () => setQty((v) => Math.min(99, v + 1));

  const decLightQty = () => setLightQty((v) => Math.max(1, v - 1));
  const incLightQty = () => setLightQty((v) => Math.min(99, v + 1));

  async function handleBuy() {
    try {
      setBuying(true);
      setStatus('');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'verume',
          qty,
          lightModule,
          lightQty: lightModule ? lightQty : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || 'Checkout failed.');
      window.location.href = data.url;
    } catch (e: any) {
      setStatus(e?.message || 'Checkout failed.');
    } finally {
      setBuying(false);
    }
  }

  return (
    <main className="bg-white text-black">
      {/* ✅ Home과 동일한 Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur">
        <nav className="section-shell flex h-50 items-center justify-between">
          <Link href="/" aria-label="Go to intro" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} priority />
          </Link>

          <div className="flex items-center gap-5 text-xs tracking-[0.22em] uppercase md:gap-8">
            <Link href="/home#hero">Home</Link>
            <Link href="/home#about">About</Link>
            <Link href="/home#shop">Shop</Link>
            <Link href="/home#contact">Contact</Link>
            <a
              href="https://instagram.com/xatom.space"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </nav>
      </header>

      <section className="section-shell py-16 md:py-24">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">
          Product
        </p>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/p6.jpg"
              alt="verumé"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">
              verumé
            </h1>

            <p className="mt-6 text-sm text-black/70">
              Objects for Spatial Density
            </p>

            <div className="mt-10 space-y-8 text-sm">
              {/* · Pieces */}
              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">· Pieces</p>
                <div className="flex items-center gap-4">
                  <button onClick={decQty} className="border border-black/20 px-3 py-1">
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{qty}</span>
                  <button onClick={incQty} className="border border-black/20 px-3 py-1">
                    +
                  </button>
                </div>
              </div>

              {/* · Light Module */}
              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">· Light Module</p>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lightModule}
                    onChange={(e) => setLightModule(e.target.checked)}
                  />
                  <span>선택</span>
                </label>

                <div
                  className={`mt-4 flex items-center gap-4 ${
                    lightModule ? '' : 'opacity-40 pointer-events-none'
                  }`}
                >
                  <button onClick={decLightQty} className="border border-black/20 px-3 py-1">
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{lightQty}</span>
                  <button onClick={incLightQty} className="border border-black/20 px-3 py-1">
                    +
                  </button>
                </div>
              </div>

              {/* 총 금액 */}
              <div className="border-t border-black/20 pt-6 text-base font-medium">
                ₩ {formatKRW(total)}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-black hover:text-white disabled:opacity-60"
                >
                  {buying ? 'Processing...' : 'Pay now'}
                </button>

                {status && (
                  <p className="mt-3 text-sm text-black/60">{status}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}