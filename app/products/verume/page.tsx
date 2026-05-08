'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OBJECT_PRICE = 248000;
const LIGHT_MODULE_PRICE = 29000;

const BANK_NAME = '국민은행';
const BANK_ACCOUNT = '891237-00-004097';
const ACCOUNT_HOLDER = '엑스아톰 (XATOM)';
const CONTACT_TO = 'xatom.space@gmail.com';

const imageItems = [
  { src: '/p7.jpg', alt: 'verume detail 1' },
  { src: '/p8.jpg', alt: 'verume detail 2' },
  { src: '/p9.jpg', alt: 'verume detail 3' },
  { src: '/p10.jpg', alt: 'verume detail 4' },
  { src: '/p11.jpg', alt: 'verume detail 5' },
] as const;

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

function GalleryImage({
  src,
  alt,
  eager = false,
}: {
  src: string;
  alt: string;
  eager?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden bg-white">
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        className="block h-auto w-full"
      />
    </div>
  );
}

function ManagedVideoBlock({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const resetToStart = () => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
    };

    const handleLoadedMetadata = () => {
      resetToStart();
    };

    const handleEnded = () => {
      resetToStart();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    resetToStart();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  useEffect(() => {
    if (!wrapRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0.15
        );
        if (!inView) {
          video.pause();
        }
      },
      { threshold: [0, 0.15, 0.5] }
    );

    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden bg-white">
      <video
        key={src}
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="block h-auto w-full"
      />
    </div>
  );
}

export default function VerumeProductPage() {
  const [qty, setQty] = useState(1);
  const [lightModule, setLightModule] = useState(false);
  const [lightQty, setLightQty] = useState(1);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLightQty((current) => Math.min(current, qty));
  }, [qty]);

  const total = useMemo(() => {
    const objectTotal = OBJECT_PRICE * qty;
    const lightTotal = lightModule ? LIGHT_MODULE_PRICE * lightQty : 0;
    return objectTotal + lightTotal;
  }, [qty, lightModule, lightQty]);

  const decQty = () => setQty((v) => Math.max(1, v - 1));
  const incQty = () => setQty((v) => Math.min(99, v + 1));
  const decLightQty = () => setLightQty((v) => Math.max(1, v - 1));
  const incLightQty = () => setLightQty((v) => Math.min(qty, v + 1));

  const toggleLightModule = (checked: boolean) => {
    setLightModule(checked);
    if (checked) {
      setLightQty((current) => Math.min(Math.max(current, 1), qty));
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied.`);
    } catch {
      setStatus(`Failed to copy ${label.toLowerCase()}.`);
    }
  };

  const handleNaverPay = () => {
    const naverPayUrl = process.env.NEXT_PUBLIC_NAVER_PAY_ORDER_URL;

    if (!naverPayUrl) {
      setStatus('NEXT_PUBLIC_NAVER_PAY_ORDER_URL is not configured.');
      return;
    }

    const url = new URL(naverPayUrl);
    url.searchParams.set('productId', 'verume');
    url.searchParams.set('qty', String(qty));
    url.searchParams.set('lightModule', String(lightModule));
    url.searchParams.set('lightQty', String(lightModule ? lightQty : 0));
    url.searchParams.set('totalAmount', String(total));

    window.location.href = url.toString();
  };

  return (
    <main className="bg-white text-black">
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
            <h1 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">
              verumé
            </h1>
            <p className="mt-6 text-sm text-black/70">Objects for Spatial Density</p>

            <div className="mt-10 space-y-8 text-sm">
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

              <div className="border-t border-black/10 pt-6">
                <p className="mb-3 text-black/60">· Light Module</p>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={lightModule}
                    onChange={(e) => toggleLightModule(e.target.checked)}
                  />
                  <span>선택</span>
                </label>

                <div
                  className={`mt-4 flex items-center gap-4 ${
                    lightModule ? '' : 'pointer-events-none opacity-40'
                  }`}
                >
                  <button type="button" onClick={decLightQty} className="border border-black/20 px-3 py-1">
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{lightQty}</span>
                  <button type="button" onClick={incLightQty} className="border border-black/20 px-3 py-1">
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-black/20 pt-6 text-base font-medium">
                ₩ {formatKRW(total)}
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleNaverPay}
                  className="w-full border border-[#03c75a] bg-[#03c75a] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
                >
                  Naver Pay
                </button>

                <a
                  href="#bank-transfer"
                  className="block w-full border border-black/20 px-8 py-3 text-center text-xs uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
                >
                  Bank Transfer Guide
                </a>

                {status ? <p className="text-sm text-black/60">{status}</p> : null}
              </div>
            </div>
          </div>
        </div>

        <section id="bank-transfer" className="mt-20 border-t border-black/10 pt-10 md:mt-28">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">Bank Transfer</p>
              <h2 className="mt-4 text-lg font-semibold tracking-[0.04em]">Manual Transfer Guide</h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-black/70">
                <p>계좌이체로 주문하실 경우 아래 계좌로 입금해 주세요.</p>
                <p>입금자명은 주문자명과 동일하게 맞춰 주세요.</p>
                <p>입금 후 확인이 필요할 경우 아래 이메일로 주문 정보와 함께 연락해 주세요.</p>
              </div>
            </div>

            <div className="space-y-4 border border-black/10 p-6">
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Bank</p>
                  <p className="mt-1 text-sm font-medium">{BANK_NAME}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(BANK_NAME, 'Bank name')}
                  className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
                >
                  Copy
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Account</p>
                  <p className="mt-1 text-sm font-medium">{BANK_ACCOUNT}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(BANK_ACCOUNT, 'Account number')}
                  className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
                >
                  Copy
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Account Holder</p>
                  <p className="mt-1 text-sm font-medium">{ACCOUNT_HOLDER}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(ACCOUNT_HOLDER, 'Account holder')}
                  className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
                >
                  Copy
                </button>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-black/50">Contact</p>
                <a href={`mailto:${CONTACT_TO}`} className="mt-1 block text-sm font-medium text-emerald-700">
                  {CONTACT_TO}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-20 space-y-6 md:mt-32 md:space-y-8">
          <GalleryImage src={imageItems[0].src} alt={imageItems[0].alt} eager />
          <GalleryImage src={imageItems[1].src} alt={imageItems[1].alt} />
          <ManagedVideoBlock src="/m1.mp4" poster="/p8.jpg" />
          <GalleryImage src={imageItems[2].src} alt={imageItems[2].alt} />
          <GalleryImage src={imageItems[3].src} alt={imageItems[3].alt} />
          <GalleryImage src={imageItems[4].src} alt={imageItems[4].alt} />
        </div>
      </section>

      <footer className="mt-32 pb-16 text-center text-sm font-light leading-tight text-neutral-400">
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
            | <span className="text-emerald-600">+82 10-4894-8030</span>
          </p>
          <p>No Images may be reproduced without the permission of the company</p>
          <p className="text-neutral-500">2026 © All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
