'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** HERO 캐러셀 컴포넌트 (외부 라이브러리 없이) */
function HeroCarousel({ images, heightClass = 'h-[58vh] md:h-[72vh]' }) {
  const slides = useMemo(() => images.slice(0, 5), [images]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // auto-play
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((cur) => (cur + 1) % slides.length);
    }, 3500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  // keyboard
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    const dx = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;

    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    setPaused(false);
  };

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-black/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={`relative w-full ${heightClass}`}>
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={src} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt={`product-${i + 1}`}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* 그라데이션/텍스트는 기존 hero 느낌 유지(원하면 제거 가능) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* 좌우 버튼 */}
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 px-3 py-2 text-sm text-white backdrop-blur hover:bg-black/45"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 px-3 py-2 text-sm text-white backdrop-blur hover:bg-black/45"
            >
              →
            </button>
          </>
        ) : null}

        {/* 도트 */}
        {slides.length > 1 ? (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  'h-2 w-2 rounded-full border border-white/40 transition',
                  i === index ? 'bg-white' : 'bg-white/40',
                ].join(' ')}
              />
            ))}
          </div>
        ) : null}

        {/* 기존 hero 텍스트 위치 유지 */}
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/90">Engineered calm</p>
          <h1 className="mt-3 text-3xl font-extralight tracking-[0.12em] text-white md:text-6xl">
            XATOM OBJECT 01
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState('');

  const productImages = [
    '/products/p1.jpg',
    '/products/p2.jpg',
    '/products/p3.jpg',
    '/products/p4.jpg',
    '/products/p5.jpg',
  ];

  async function handleBuy() {
    try {
      setBuying(true);
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Checkout failed.');
      }

      window.location.href = data.url;
    } catch (error) {
      setStatus(error.message || 'Checkout failed.');
    } finally {
      setBuying(false);
    }
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setSending(true);
    setStatus('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Message send failed.');
      }

      event.currentTarget.reset();
      setStatus(data?.message || 'Message sent.');
    } catch (error) {
      const subject = encodeURIComponent('[xatom.space] Contact');
      const body = encodeURIComponent(`${payload.name}\n${payload.email}\n\n${payload.message}`);
      window.location.href = `mailto:${process.env.NEXT_PUBLIC_CONTACT_TO || 'hello@xatom.space'}?subject=${subject}&body=${body}`;
      setStatus(error.message || 'Contact fallback opened.');
    } finally {
      setSending(false);
    }
  }

  return (
    // ✅ 배경 흰색으로 변경 + 텍스트 블랙
    <main className="bg-white text-black">
      {/* ✅ 헤더: 좌측 상단 로고 + (원하면 기존 메뉴 유지 가능) */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          {/* ✅ 로고를 좌측 상단에 */}
          <Link href="/" aria-label="Go to intro" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={140} height={50} priority />
          </Link>

          {/* 기존 메뉴를 유지하려면 아래를 살리고, 아니면 삭제 */}
          <div className="flex items-center gap-5 text-xs tracking-[0.22em] uppercase md:gap-8">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#shop">Shop</a>
            <a href="#contact">Contact</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </nav>
      </header>

      {/* ✅ HERO: 기존 hero 이미지를 캐러셀로 교체 */}
      <section id="hero" className="mx-auto max-w-6xl px-6 py-14 md:py-24">
        <HeroCarousel images={productImages} />
      </section>

      {/* 기존 섹션 유지 */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">About</p>
        <p className="mt-6 max-w-3xl text-lg font-extralight leading-relaxed text-black/80 md:text-2xl">
          xatom.space is a material-first studio exploring minimal objects at the boundary of
          architecture and product design. Every surface is reduced to essential form, while detail
          is tuned for tactile clarity.
        </p>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Shop</p>
        <div className="mt-8 grid gap-8 border border-black/10 p-6 md:grid-cols-2 md:p-10">
          <img src="/images/product.svg" alt="xatom product" className="h-[320px] w-full object-cover" />
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extralight tracking-[0.1em] md:text-4xl">Object 01</h2>
              <p className="mt-4 text-black/60">Precision-built centerpiece in anodized finish.</p>
              <p className="mt-8 text-3xl font-thin tracking-[0.08em]">$290</p>
            </div>
            <button
              type="button"
              onClick={handleBuy}
              disabled={buying}
              className="mt-10 w-fit border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white disabled:opacity-60"
            >
              {buying ? 'Processing...' : 'Buy'}
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Contact</p>
        <form onSubmit={handleContactSubmit} className="mt-8 grid gap-5 border border-black/10 p-6 md:p-10">
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black"
          />
          <input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Message"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-fit border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {status ? <p className="text-sm text-black/60">{status}</p> : null}
        </form>
      </section>
    </main>
  );
}