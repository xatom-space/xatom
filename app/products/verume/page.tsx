'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

function formatKRW(n: number) {
  return new Intl.NumberFormat('ko-KR').format(n);
}

export default function VerumeProductPage() {
  const [qty, setQty] = useState(1);
  const [lightModule, setLightModule] = useState(false);

  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState('');

  const total = useMemo(() => {
    const objectTotal = OBJECT_PRICE * qty;
    const lightTotal = lightModule ? LIGHT_MODULE_PRICE * qty : 0;
    return objectTotal + lightTotal;
  }, [qty, lightModule]);

  const decQty = () => setQty((v) => Math.max(1, v - 1));
  const incQty = () => setQty((v) => Math.min(99, v + 1));

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
      {/* ✅ 헤더
          - 모바일: 로고 가운데
          - PC(md+): 로고 좌측 + 우측 여백 (home 리듬 유지)
      */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur">
        <nav className="section-shell relative flex h-50 items-center justify-center md:justify-between">
          {/* PC(md+): 좌측 로고 */}
          <Link href="/" aria-label="Go to intro" className="hidden items-center md:flex">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} priority />
          </Link>

          {/* 모바일: 가운데 로고 */}
          <Link href="/" aria-label="Go to intro (mobile)" className="flex items-center md:hidden">
            <Image src="/xatom-v1.png" alt="xatom logo" width={140} height={52} priority />
          </Link>

          {/* PC(md+): 우측 여백 */}
          <div className="hidden w-[160px] md:block" />
        </nav>
      </header>

      <section className="section-shell py-16 md:py-24">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Product</p>

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
            <h1 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">verumé</h1>

            <p className="mt-6 text-sm text-black/70">Objects for Spatial Density</p>

            <div className="mt-10 space-y-8 text-sm">
              {/* · Pieces */}
              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">· Pieces</p>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={decQty} className="border border-black/20 px-3 py-1">
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{qty}</span>
                  <button type="button" onClick={incQty} className="border border-black/20 px-3 py-1">
                    +
                  </button>
                </div>
              </div>

              {/* · Light Module + 체크박스(선택) */}
              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">· Light Module</p>

                {/* ✅ 체크박스 + '선택' 라벨 */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lightModule}
                    onChange={(e) => setLightModule(e.target.checked)}
                  />
                  <span>선택</span>
                </label>
              </div>

              {/* ✅ ₩ 248,000 (총 금액) -> ₩ 248,000 */}
              <div className="border-t border-black/20 pt-6 text-base font-medium">
                ₩ {formatKRW(total)}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={buying}
                  className="border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-black hover:text-white disabled:opacity-60"
                >
                  {buying ? 'Processing...' : 'Pay now'}
                </button>

                {status ? <p className="mt-3 text-sm text-black/60">{status}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}