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

/** ✅ Hero를 제품 캐러셀(최대 5장)로 */
function ProductCarousel({ images }) {
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
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ✅ 한 영역(창) 높이 */}
      <div className="relative h-[58vh] w-full md:h-[72vh]">
        {/* track */}
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

        {/* 기존 hero 느낌 유지: 그라데이션 + 텍스트 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <p className="thin-title text-[10px] text-accent">Engineered calm</p>
          <h1 className="mt-3 text-3xl font-extralight tracking-[0.12em] md:text-6xl">XATOM OBJECT 01</h1>
        </div>

        {/* 좌/우 버튼 */}
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
    <main className="bg-ink text-offwhite">
      {/* ✅ 회색 경계선 제거: border-b 삭제 */}
      <header className="sticky top-0 z-30 bg-ink/90 backdrop-blur">
        {/* ✅ 로고 공간 높이 2배: h-20 -> h-50 */}
        <nav className="section-shell flex h-50 items-center justify-between">
          {/* ✅ 좌측 로고를 xatom-v1로 교체 */}
          <Link href="/" aria-label="Go to intro" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} priority />
          </Link>

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

      {/* ✅ 좌우 여백 제거: section-shell 제거하고 w-full로 */}
      <section id="hero" className="w-full py-14 md:py-24">
        <ProductCarousel images={productImages} />
      </section>

      {/* 아래는 기존 섹션 그대로 유지 */}
      <section id="about" className="section-shell py-20 md:py-28">
        <p className="thin-title text-[10px] text-accent">About</p>
        <p className="mt-6 max-w-3xl text-lg font-extralight leading-relaxed text-offwhite/90 md:text-2xl">
          xatom.space is a material-first studio exploring minimal objects at the boundary of
          architecture and product design. Every surface is reduced to essential form, while detail
          is tuned for tactile clarity.
        </p>
      </section>

      <section id="shop" className="section-shell py-20 md:py-28">
        <p className="thin-title text-[10px] text-accent">Shop</p>
        <div className="mt-8 grid gap-8 border border-white/10 p-6 md:grid-cols-2 md:p-10">
          <img src="/images/product.svg" alt="xatom product" className="h-[320px] w-full object-cover" />
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extralight tracking-[0.1em] md:text-4xl">Object 01</h2>
              <p className="mt-4 text-offwhite/70">Precision-built centerpiece in anodized finish.</p>
              <p className="mt-8 text-3xl font-thin tracking-[0.08em]">$290</p>
            </div>
            <button
              type="button"
              onClick={handleBuy}
              disabled={buying}
              className="mt-10 w-fit border border-accent px-8 py-3 text-xs uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-black disabled:opacity-60"
            >
              {buying ? 'Processing...' : 'Buy'}
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell py-20 md:py-28">
        <p className="thin-title text-[10px] text-accent">Contact</p>
        <form onSubmit={handleContactSubmit} className="mt-8 grid gap-5 border border-white/10 p-6 md:p-10">
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Message"
            className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-fit border border-accent px-8 py-3 text-xs uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-black disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {status ? <p className="text-sm text-offwhite/70">{status}</p> : null}
        </form>
      </section>
    </main>
  );
}