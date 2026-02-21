'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

function formatKRW(n: number) {
  return new Intl.NumberFormat('ko-KR').format(n) + '원';
}

export default function VerumeProductPage() {
  // 옵션 A: 수량
  const [qty, setQty] = useState(1);

  // 옵션 B: 라이트 모듈 선택/비선택
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

      // ✅ checkout으로 옵션 전달
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
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur">
        <nav className="section-shell flex h-50 items-center justify-between">
          <Link href="/home" className="text-xs tracking-[0.22em] uppercase text-black/60 hover:text-black">
            ← Back
          </Link>

          <Link href="/home" aria-label="Go to home" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} priority />
          </Link>

          <div className="w-[60px]" />
        </nav>
      </header>

      <section className="section-shell py-16 md:py-24">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Product</p>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image src="/p6.jpg" alt="verumé" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">verumé</h1>

            <div className="mt-6 space-y-2 text-sm text-black/70">
              <p>오브제 {formatKRW(OBJECT_PRICE)}</p>
              <p className="text-black/50">옵션 B · 라이트 모듈 {formatKRW(LIGHT_MODULE_PRICE)} (선택 시 수량만큼 추가)</p>
            </div>

            <div className="mt-10 space-y-8 text-sm">
              {/* 옵션 A - 수량 */}
              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">옵션 A · 수량</p>
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

              {/* 옵션 B - 라이트 모듈 */}
              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">옵션 B · 라이트 모듈</p>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lightModule}
                    onChange={(e) => setLightModule(e.target.checked)}
                  />
                  <span>{lightModule ? '선택' : '미선택'}</span>
                </label>
              </div>

              {/* 총 금액 */}
              <div className="border-t border-black/20 pt-6 text-base font-medium">
                총 금액 · {formatKRW(total)}
              </div>

              {/* 결제 버튼 */}
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