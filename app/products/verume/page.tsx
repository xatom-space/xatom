'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

const galleryItems = [
  { type: 'image', src: '/p7.jpg', alt: 'verume detail 1', eager: true },
  { type: 'image', src: '/p8.jpg', alt: 'verume detail 2', eager: true },
  { type: 'video', src: '/m1.mp4', poster: '/p8.jpg' },
  { type: 'image', src: '/p9.jpg', alt: 'verume detail 3', eager: true },
  { type: 'image', src: '/p10.jpg', alt: 'verume detail 4', eager: false },
  { type: 'image', src: '/p11.jpg', alt: 'verume detail 5', eager: false },
] as const;

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (
        method: 'CARD' | '카드',
        request: {
          amount: number;
          orderId: string;
          orderName: string;
          successUrl: string;
          failUrl: string;
          customerName?: string;
          customerEmail?: string;
        }
      ) => Promise<void> | void;
    };
  }
}

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

function loadTossScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.TossPayments) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[data-toss-sdk="true"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Toss SDK.')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    script.dataset.tossSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Toss SDK.'));
    document.body.appendChild(script);
  });
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

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY is not configured.');
      }

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
      if (!res.ok) throw new Error(data?.error || 'Checkout preparation failed.');

      await loadTossScript();
      if (!window.TossPayments) throw new Error('Toss SDK is not available.');

      const tossPayments = window.TossPayments(clientKey);
      const request = {
        amount: data.amount,
        orderId: data.orderId,
        orderName: data.orderName,
        successUrl: data.successUrl,
        failUrl: data.failUrl,
        customerName: 'xatom customer',
      };

      try {
        await tossPayments.requestPayment('CARD', request);
      } catch {
        await tossPayments.requestPayment('카드', request);
      }
    } catch (e: any) {
      setStatus(e?.message || 'Checkout failed.');
      setBuying(false);
    }
  }

  const CONTACT_TO = 'xatom.space@gmail.com';

  return (
    <main className="bg-white text-black">
      <header className="sticky top-0 z-30 bg-white">
        <nav className="section-shell flex h-24 items-center justify-between">
          <Link href="/" aria-label="Go to intro" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} priority />
          </Link>

          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.22em] md:gap-8 md:text-xs">
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

      <section className="section-shell py-12 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">Product</p>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/[0.03]">
              <Image
                src="/p6.jpg"
                alt="verumé"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">verumé</h1>
            <p className="mt-6 text-sm text-black/70">Objects for Spatial Density</p>

            <div className="mt-10 space-y-8 text-sm">
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

              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">· Light Module</p>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={lightModule}
                    onChange={(e) => setLightModule(e.target.checked)}
                  />
                  <span>선택</span>
                </label>

                <div className={`mt-4 flex items-center gap-4 ${lightModule ? '' : 'pointer-events-none opacity-40'}`}>
                  <button onClick={decLightQty} className="border border-black/20 px-3 py-1">
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{lightQty}</span>
                  <button onClick={incLightQty} className="border border-black/20 px-3 py-1">
                    +
                  </button>
                </div>
              </div>

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
                {status && <p className="mt-3 text-sm text-black/60">{status}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-6 md:mt-32 md:space-y-8">
          {galleryItems.map((item) =>
            item.type === 'image' ? (
              <div key={item.src} className="w-full bg-black/[0.03]">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading={item.eager ? 'eager' : 'lazy'}
                  fetchPriority={item.eager ? 'high' : 'auto'}
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            ) : (
              <div key={item.src} className="w-full bg-black">
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="block h-auto w-full"
                />
              </div>
            )
          )}
        </div>
      </section>

      <footer className="mt-24 pb-16 text-center text-sm font-light leading-tight text-neutral-400 md:mt-32">
        <div className="mb-5 flex justify-center">
          <Image
            src="/xatom-v3.png"
            alt="xatom footer logo"
            width={220}
            height={80}
            sizes="(max-width: 768px) 140px, 220px"
            className="h-auto w-[140px] md:w-[220px]"
            priority
          />
        </div>

        <div className="space-y-2">
          <p>
            © xatom - Contact.{' '}
            <a className="text-emerald-600" href={`mailto:${CONTACT_TO}`}>
              {CONTACT_TO}
            </a>{' '}
            | <span className="text-emerald-600">1800-2300</span>
          </p>
          <p>No Images may be reproduced without the permission of the company</p>
          <p className="text-neutral-500">2026 © All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
