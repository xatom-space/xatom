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
  const [bankOrderOpen, setBankOrderOpen] = useState(false);
  const [bankOrderForm, setBankOrderForm] = useState(initialBankOrderForm);
  const [bankOrderStatus, setBankOrderStatus] = useState('');
  const [bankOrderSubmitting, setBankOrderSubmitting] = useState(false);

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

  const handleBankOrderSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBankOrderStatus('');
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
      setStatus('Bank transfer order submitted.');
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
                  onClick={handleNaverPay}
                  className="w-full border border-[#03c75a] bg-[#03c75a] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
                >
                  Naver Pay
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBankOrderOpen(true);
                    setBankOrderStatus('');
                  }}
                  className="block w-full border border-black/20 px-8 py-3 text-center text-xs uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
                >
                  Bank Transfer Order
                </button>

                {status ? <p className="text-sm text-black/60">{status}</p> : null}
              </div>
            </div>
          </div>
        </div>

        {bankOrderOpen ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6 backdrop-blur-sm md:py-10">
            <div className="mx-auto max-w-2xl bg-white p-6 shadow-2xl md:p-8">
              <div className="flex items-start justify-between gap-6 border-b border-black/10 pb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/50">
                    Bank Transfer Order
                  </p>
                  <h2 className="mt-3 text-lg font-semibold tracking-[0.04em]">
                    계좌이체 주문
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBankOrderOpen(false)}
                  className="border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleBankOrderSubmit} className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-black/60">이름 *</span>
                    <input
                      required
                      value={bankOrderForm.name}
                      onChange={(e) => updateBankOrderForm('name', e.target.value)}
                      className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="text-black/60">연락처 *</span>
                    <input
                      required
                      value={bankOrderForm.phone}
                      onChange={(e) => updateBankOrderForm('phone', e.target.value)}
                      className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                    />
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="text-black/60">이메일</span>
                  <input
                    type="email"
                    value={bankOrderForm.email}
                    onChange={(e) => updateBankOrderForm('email', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">주소 *</span>
                  <input
                    required
                    value={bankOrderForm.address}
                    onChange={(e) => updateBankOrderForm('address', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">상세 주소</span>
                  <input
                    value={bankOrderForm.addressDetail}
                    onChange={(e) => updateBankOrderForm('addressDetail', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">입금자명 *</span>
                  <input
                    required
                    value={bankOrderForm.depositorName}
                    onChange={(e) => updateBankOrderForm('depositorName', e.target.value)}
                    className="mt-2 w-full border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <label className="block text-sm">
                  <span className="text-black/60">요청사항</span>
                  <textarea
                    rows={4}
                    value={bankOrderForm.memo}
                    onChange={(e) => updateBankOrderForm('memo', e.target.value)}
                    className="mt-2 w-full resize-none border border-black/15 px-3 py-3 outline-none focus:border-black"
                  />
                </label>

                <div className="grid gap-4 border-t border-black/10 pt-5 text-sm md:grid-cols-2">
                  <div className="space-y-2 text-black/70">
                    <p className="font-medium text-black">주문 상품</p>
                    <p>verumé × {qty}</p>
                    <p>Light Module × {lightModule ? lightQty : 0}</p>
                    <p className="font-medium text-black">₩ {formatKRW(total)}</p>
                  </div>

                  <div className="space-y-2 text-black/70">
                    <p className="font-medium text-black">판매자 계좌정보</p>
                    <p>{BANK_NAME}</p>
                    <p>{BANK_ACCOUNT}</p>
                    <p>{ACCOUNT_HOLDER}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={bankOrderSubmitting}
                    className="w-full border border-black bg-black px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bankOrderSubmitting ? 'Submitting...' : 'Submit Bank Transfer Order'}
                  </button>

                  {bankOrderStatus ? (
                    <p className="text-sm leading-relaxed text-black/60">{bankOrderStatus}</p>
                  ) : null}
                </div>
              </form>
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
            <span className="text-emerald-600">+82 10-4894-8030</span>
          </p>

          <p>
            엑스아톰 xatom
            <span className="mx-3">대표자 김대영</span>
            <span className="mx-3">사업자등록번호 107-29-32712</span>
          </p>

          <p>
            <span className="mx-3">통신판매신고번호 00-000-00</span>
            <span className="mx-3">부산광역시 남구 전포대로 133, 11층 101(DD-17)</span>
            <Link href="/terms" className="mx-3">
              TERMS OF USE
            </Link>
          </p>

          <p className="text-neutral-500">2026 © All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
