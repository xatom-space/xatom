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

const initialBankOrderForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  addressDetail: '',
  depositorName: '',
  memo: '',
};

const imageItems = [
  { src: '/p7.jpg', alt: 'verume detail 1' },
  { src: '/p8.jpg', alt: 'verume detail 2' },
  { src: '/p9.jpg', alt: 'verume detail 3' },
  { src: '/p10.jpg', alt: 'verume detail 4' },
  { src: '/p11.jpg', alt: 'verume detail 5' },
] as const;

const thankYouText = 'Thank You from xatom';
const thankYouStrokes = [
  'M10 18 C18 16 30 16 38 18 M24 18 C24 31 23 45 23 59',
  'M50 18 C49 32 48 45 48 59 C51 49 56 38 64 38 C72 38 72 49 70 59',
  'M98 40 C91 35 80 38 78 48 C76 60 90 63 97 51 C97 57 100 60 105 58',
  'M116 59 C117 50 118 43 119 38 C121 47 128 36 136 39 C143 42 142 51 140 59',
  'M154 18 C153 32 152 45 152 59 M153 49 C162 42 168 35 173 28 M160 45 C165 50 171 56 178 59',
  'M212 20 C218 31 224 38 229 42 C234 35 239 27 243 20 M229 42 C228 49 227 55 226 61',
  'M269 46 C269 38 255 36 252 46 C249 58 265 63 270 51 C271 49 271 47 269 46',
  'M284 38 C283 46 281 56 288 58 C295 60 301 49 303 38 C302 47 302 55 307 58',
  'M358 20 C348 18 345 28 346 39 C347 49 346 56 342 63 M337 39 C346 38 354 38 362 39',
  'M374 59 C375 50 376 43 377 38 C379 45 384 37 391 39',
  'M416 46 C416 38 402 36 399 46 C396 58 412 63 417 51 C418 49 418 47 416 46',
  'M431 59 C432 50 433 43 434 38 C437 47 442 38 447 39 C453 40 451 50 451 59 C454 47 459 38 465 39 C471 40 471 50 469 59',
  'M516 39 C523 45 530 53 537 59 M537 39 C530 45 523 53 516 59',
  'M566 40 C559 35 548 38 546 48 C544 60 558 63 565 51 C565 57 568 60 573 58',
  'M588 24 C587 37 586 50 586 60 M579 39 C588 38 597 38 605 39',
  'M629 46 C629 38 615 36 612 46 C609 58 625 63 630 51 C631 49 631 47 629 46',
  'M644 59 C645 50 646 43 647 38 C650 47 655 38 660 39 C666 40 664 50 664 59 C667 47 672 38 678 39 C684 40 684 50 682 59',
] as const;

const confettiPieces = [
  { left: '12%', color: '#2563eb', delay: '0.02s', duration: '1.45s', size: 9, drift: '-18px' },
  { left: '23%', color: '#a21caf', delay: '0.16s', duration: '1.65s', size: 7, drift: '14px' },
  { left: '36%', color: '#22c55e', delay: '0.06s', duration: '1.55s', size: 8, drift: '-10px' },
  { left: '47%', color: '#0ea5e9', delay: '0.22s', duration: '1.72s', size: 6, drift: '18px' },
  { left: '58%', color: '#7c3aed', delay: '0.1s', duration: '1.5s', size: 9, drift: '-14px' },
  { left: '69%', color: '#16a34a', delay: '0.28s', duration: '1.78s', size: 7, drift: '12px' },
  { left: '79%', color: '#db2777', delay: '0.14s', duration: '1.62s', size: 8, drift: '-16px' },
  { left: '88%', color: '#1d4ed8', delay: '0.24s', duration: '1.7s', size: 6, drift: '10px' },
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

function HandwrittenThankYou() {
  return (
    <div
      className="thank-you-script mt-4 md:mt-5"
      aria-label={thankYouText}
    >
      <svg
        className="thank-you-script__svg"
        viewBox="0 0 692 78"
        aria-hidden="true"
      >
        {thankYouStrokes.map((stroke, index) => (
          <g key={stroke}>
            <path
              className="thank-you-script__final"
              d={stroke}
              style={{ animationDelay: `${1.2 + index * 0.16}s` }}
            />
            <path
              className="thank-you-script__stroke"
              d={stroke}
              pathLength={100}
              style={{ animationDelay: `${0.5 + index * 0.16}s` }}
            />
          </g>
        ))}
      </svg>

      <style jsx>{`
        .thank-you-script {
          display: inline-block;
          width: min(70vw, 360px);
        }

        @media (min-width: 768px) {
          .thank-you-script {
            width: min(78vw, 560px);
          }
        }

        .thank-you-script__svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .thank-you-script__stroke,
        .thank-you-script__final {
          fill: transparent;
          stroke: #111;
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .thank-you-script__stroke {
          opacity: 1;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-thank-you-letter 0.78s cubic-bezier(0.44, 0.03, 0.2, 1) forwards;
        }

        .thank-you-script__final {
          opacity: 0;
          animation: keep-thank-you-letter 0.01s linear forwards;
        }

        @keyframes draw-thank-you-letter {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes keep-thank-you-letter {
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .thank-you-script__stroke {
            stroke-dashoffset: 0;
            animation: none;
          }

          .thank-you-script__final {
            opacity: 1;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function CompleteCheckIcon() {
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#7cff39] shadow-[0_0_18px_rgba(124,255,57,0.45)] md:h-24 md:w-24">
      <svg className="h-11 w-12 md:h-14 md:w-14" viewBox="0 0 64 54" fill="none" aria-hidden="true">
        <path
          d="M8 28 L23 43 L56 12"
          stroke="#050505"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CelebrationConfetti() {
  return (
    <div className="complete-confetti" aria-hidden="true">
      {confettiPieces.map((piece, index) => (
        <span
          key={`${piece.left}-${piece.color}`}
          className="complete-confetti__piece"
          style={{
            '--confetti-left': piece.left,
            '--confetti-color': piece.color,
            '--confetti-delay': piece.delay,
            '--confetti-duration': piece.duration,
            '--confetti-size': `${piece.size}px`,
            '--confetti-drift': piece.drift,
            '--confetti-spin': `${index % 2 === 0 ? 180 : -180}deg`,
          } as React.CSSProperties}
        />
      ))}

      <style jsx>{`
        .complete-confetti {
          pointer-events: none;
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .complete-confetti__piece {
          position: absolute;
          left: var(--confetti-left);
          top: -16px;
          width: var(--confetti-size);
          height: var(--confetti-size);
          background: var(--confetti-color);
          opacity: 0;
          animation: confetti-fall var(--confetti-duration) ease-in var(--confetti-delay) forwards;
        }

        @keyframes confetti-fall {
          0% {
            opacity: 0;
            transform: translate3d(0, -18px, 0) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--confetti-drift), min(58vh, 430px), 0) rotate(var(--confetti-spin));
          }
        }

        @media (max-width: 767px) {
          .complete-confetti__piece {
            width: calc(var(--confetti-size) * 0.85);
            height: calc(var(--confetti-size) * 0.85);
          }

          @keyframes confetti-fall {
            0% {
              opacity: 0;
              transform: translate3d(0, -16px, 0) rotate(0deg);
            }
            12% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translate3d(calc(var(--confetti-drift) * 0.7), min(54vh, 360px), 0) rotate(var(--confetti-spin));
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .complete-confetti__piece {
            animation: none;
          }
        }
      `}</style>
    </div>
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
  const [bankOrderOpen, setBankOrderOpen] = useState(false);
  const [bankOrderForm, setBankOrderForm] = useState(initialBankOrderForm);
  const [bankOrderStatus, setBankOrderStatus] = useState('');
  const [bankOrderSubmitting, setBankOrderSubmitting] = useState(false);
  const [bankOrderComplete, setBankOrderComplete] = useState(false);

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

  const updateBankOrderForm = (
    field: keyof typeof initialBankOrderForm,
    value: string
  ) => {
    setBankOrderForm((current) => ({ ...current, [field]: value }));
  };

  const handleBankOrderSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBankOrderStatus('');
    setBankOrderComplete(false);
    setBankOrderSubmitting(true);

    try {
      const res = await fetch('/api/bank-transfer-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bankOrderForm,
          productName: 'verumé',
          qty,
          lightModule,
          lightQty: lightModule ? lightQty : 0,
          totalAmount: total,
          bankName: BANK_NAME,
          bankAccount: BANK_ACCOUNT,
          accountHolder: ACCOUNT_HOLDER,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit order.');
      }

      setBankOrderStatus('주문 정보가 접수되었습니다. 입금 확인 후 안내드리겠습니다.');
      setBankOrderComplete(true);
      setBankOrderForm(initialBankOrderForm);
    } catch (error) {
      setBankOrderStatus(
        error instanceof Error
          ? error.message
          : '주문 접수에 실패했습니다. 이메일로 문의해 주세요.'
      );
    } finally {
      setBankOrderSubmitting(false);
    }
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
                  onClick={() => {
                    setBankOrderOpen(true);
                    setBankOrderStatus('');
                    setBankOrderComplete(false);
                  }}
                  className="block w-full border border-black/20 px-4 py-3 text-center text-[11px] uppercase tracking-[0.14em] text-black transition hover:bg-black hover:text-white md:px-8 md:text-xs md:tracking-[0.2em]"
                >
                  Bank Transfer Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {bankOrderOpen ? (
          <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-y-auto bg-black/35 p-5 backdrop-blur-md md:p-10">
            <div className="relative flex max-h-[82dvh] w-[88vw] max-w-2xl flex-col overflow-hidden bg-white shadow-2xl md:max-h-[calc(100dvh-5rem)] md:w-full">
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-black/10 p-5 pb-4 md:gap-6 md:p-8 md:pb-5">
                <div className="min-w-0">
                  <p className="break-words text-[10px] uppercase tracking-[0.24em] text-black/50 md:tracking-[0.35em]">
                    Bank Transfer Order
                  </p>
                  <h2 className="mt-3 text-lg font-semibold tracking-[0.04em]">
                    계좌이체 주문
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBankOrderOpen(false)}
                  className="shrink-0 border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.16em] md:tracking-[0.2em]"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={handleBankOrderSubmit}
                className="min-h-0 space-y-6 overflow-y-auto px-5 py-6 [&_input]:text-base [&_textarea]:text-base md:px-8 md:[&_input]:text-sm md:[&_textarea]:text-sm"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block min-w-0 text-sm">
                    <span className="text-black/60">이름 *</span>
                    <input
                      required
                      value={bankOrderForm.name}
                      onChange={(e) => updateBankOrderForm('name', e.target.value)}
                      className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                    />
                  </label>

                  <label className="block min-w-0 text-sm">
                    <span className="text-black/60">연락처 *</span>
                    <input
                      required
                      value={bankOrderForm.phone}
                      onChange={(e) => updateBankOrderForm('phone', e.target.value)}
                      className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                    />
                  </label>
                </div>

                <label className="block min-w-0 text-sm">
                  <span className="text-black/60">이메일</span>
                  <input
                    type="email"
                    value={bankOrderForm.email}
                    onChange={(e) => updateBankOrderForm('email', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block min-w-0 text-sm">
                  <span className="text-black/60">주소 *</span>
                  <input
                    required
                    value={bankOrderForm.address}
                    onChange={(e) => updateBankOrderForm('address', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block min-w-0 text-sm">
                  <span className="text-black/60">상세 주소</span>
                  <input
                    value={bankOrderForm.addressDetail}
                    onChange={(e) => updateBankOrderForm('addressDetail', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block min-w-0 text-sm">
                  <span className="text-black/60">입금자명 *</span>
                  <input
                    required
                    value={bankOrderForm.depositorName}
                    onChange={(e) => updateBankOrderForm('depositorName', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block min-w-0 text-sm">
                  <span className="text-black/60">요청사항</span>
                  <textarea
                    rows={4}
                    value={bankOrderForm.memo}
                    onChange={(e) => updateBankOrderForm('memo', e.target.value)}
                    className="mt-2 w-full resize-none border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <div className="grid min-w-0 gap-4 border-t border-black/10 pt-5 text-sm md:grid-cols-2">
                  <div className="min-w-0 space-y-2 text-black/70">
                    <p className="font-medium text-black">주문 상품</p>
                    <p>verumé × {qty}</p>
                    <p>Light Module × {lightModule ? lightQty : 0}</p>
                    <p className="font-medium text-black">₩ {formatKRW(total)}</p>
                  </div>

                  <div className="min-w-0 space-y-2 break-words text-black/70">
                    <p className="font-medium text-black">판매자 계좌정보</p>
                    <p>{BANK_NAME}</p>
                    <p>{BANK_ACCOUNT}</p>
                    <p>{ACCOUNT_HOLDER}</p>
                  </div>
                </div>

                <div className="border border-black/10 bg-black/[0.02] p-4 text-sm leading-relaxed text-black/65">
                  <p className="font-medium text-black">주문 전 안내</p>
                  <p className="mt-2">
                    본 제품은 주문 접수 후 제작이 진행되는 수제작 오브제로, 입금 및 주문 확인 이후에는 단순 변심에 의한 주문 취소와 환불이 어려운 점 양해 부탁드립니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={bankOrderSubmitting}
                    className="w-full border border-black bg-black px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-8 md:text-xs md:tracking-[0.2em]"
                  >
                    {bankOrderSubmitting ? 'Submitting...' : 'Submit Bank Transfer Order'}
                  </button>

                  {bankOrderStatus ? (
                    <p className="text-sm leading-relaxed text-black/60">{bankOrderStatus}</p>
                  ) : null}
                </div>
              </form>

              {bankOrderComplete ? (
                <button
                  type="button"
                  aria-label="주문 완료 창 닫기"
                  onClick={() => {
                    setBankOrderOpen(false);
                    setBankOrderComplete(false);
                    setBankOrderStatus('');
                  }}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-white px-6 text-center"
                >
                  <CelebrationConfetti />
                  <div>
                    <CompleteCheckIcon />
                    <p className="mt-6 text-lg font-medium tracking-[0.04em] text-black">
                      주문이 완료되었습니다
                    </p>
                    <HandwrittenThankYou />
                  </div>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-20 space-y-6 md:mt-32 md:space-y-8">
          <GalleryImage src={imageItems[0].src} alt={imageItems[0].alt} eager />
          <GalleryImage src={imageItems[1].src} alt={imageItems[1].alt} />
          <ManagedVideoBlock src="/m1.mp4" poster="/p8.jpg" />
          <GalleryImage src={imageItems[2].src} alt={imageItems[2].alt} />
          <GalleryImage src={imageItems[3].src} alt={imageItems[3].alt} />
          <GalleryImage src={imageItems[4].src} alt={imageItems[4].alt} />
        </div>
      </section>

      <footer className="mx-auto mt-32 w-full max-w-[1200px] px-5 pb-16 text-center text-xs font-light leading-snug text-neutral-400 md:px-12 md:text-sm md:leading-tight">
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

        <div className="mx-auto max-w-full space-y-1 [overflow-wrap:anywhere]">
          <p className="flex flex-wrap justify-center gap-x-2 gap-y-0.5">
            <span>© xatom - Contact.</span>
            <a className="text-emerald-600" href={`mailto:${CONTACT_TO}`}>
              {CONTACT_TO}
            </a>
            <span className="text-emerald-600">+82 10-4894-8030</span>
          </p>

          <p className="flex flex-wrap justify-center gap-x-4 gap-y-0.5">
            <span>엑스아톰 xatom</span>
            <span>대표자 김대영</span>
            <span>사업자등록번호 107-29-32712</span>
          </p>

          <p className="flex flex-wrap justify-center gap-x-4 gap-y-0.5">
            <span>통신판매신고번호 제 2026-부산남구-0305 호</span>
            <span>부산광역시 남구 전포대로 133, 11층 101(DD-17)</span>
            <Link href="/terms">
              TERMS OF USE
            </Link>
          </p>

          <p className="text-neutral-500">2026 © All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
