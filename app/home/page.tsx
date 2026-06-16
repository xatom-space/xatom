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

function ProductCarousel({ images }: { images: { desktopSrc: string; mobileSrc: string }[] }) {
  const slides = useMemo(() => images.slice(0, 5), [images]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = (i: number) => {
    setIndex(() => {
      const len = slides.length || 1;
      return ((i % len) + len) % len;
    });
  };

  const next = () => {
    setIndex((cur) => {
      const len = slides.length || 1;
      return (cur + 1) % len;
    });
  };

  const prev = () => {
    setIndex((cur) => {
      const len = slides.length || 1;
      return (cur - 1 + len) % len;
    });
  };

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const t = setInterval(() => {
      setIndex((cur) => (cur + 1) % slides.length);
    }, 3500);

    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slides.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
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

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative aspect-video w-full">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={`${src.desktopSrc}-${i}`} className="relative h-full w-full shrink-0">
              <picture>
                <source media="(max-width: 767px)" srcSet={src.mobileSrc} />
                <img
                  src={src.desktopSrc}
                  alt={`product-${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`go-to-${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-black' : 'bg-black/30'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [ipExpanded, setIpExpanded] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const productImages = [
    { desktopSrc: '/p1-home-desktop.jpg?v=20260515', mobileSrc: '/p1-home-mobile.jpg?v=20260515' },
    { desktopSrc: '/p2-home-desktop.jpg?v=20260515', mobileSrc: '/p2-home-mobile.jpg?v=20260515' },
    { desktopSrc: '/p3-home-desktop.jpg?v=20260515', mobileSrc: '/p3-home-mobile.jpg?v=20260515' },
    { desktopSrc: '/p4-home-desktop.jpg?v=20260515', mobileSrc: '/p4-home-mobile.jpg?v=20260515' },
    { desktopSrc: '/p5-home-desktop.jpg?v=20260515', mobileSrc: '/p5-home-mobile.jpg?v=20260515' },
  ];
  const CONTACT_TO = 'xatom.space@gmail.com';

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus('');

    const formEl = formRef.current ?? e.currentTarget;
    const formData = new FormData(formEl);

    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
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

      formRef.current?.reset();
      setStatus(`Message sent to ${CONTACT_TO}.`);
    } catch (error: any) {
      setStatus(error?.message || 'Send failed. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const aboutEn = `xatom is a company that creates new value and possibilities through design.
We design objects and furniture for spaces while also developing products and intellectual property that play a key role in future industries.

We believe that good design is more than creating beautiful forms. It is a process of solving problems, improving experiences, and creating new opportunities. Guided by this philosophy, xatom focuses on transforming ideas into tangible value—from product planning and design to the development of intellectual property.

We explore ways to expand the possibilities of design by connecting form and function, technology and market.
So that an idea that begins with a single object can become a product, an intellectual property, and ultimately a new possibility for industry.

xatom designs a new dimension.`;

  const aboutKo = `xatom은 디자인을 통해 새로운 가치와 가능성을 만들어가는 기업입니다.
우리는 공간을 위한 오브제와 가구를 디자인하는 동시에, 미래산업분야에서 핵심적인 역할을 하는 제품과 지식재산(IP)을 개발합니다.

좋은 디자인은 단순히 아름다운 형태를 만드는 것이 아니라 문제를 해결하고, 경험을 개선하며, 새로운 기회를 창출하는 과정이라고 믿습니다.
이러한 생각을 바탕으로 xatom은 제품 기획부터 디자인, 지식재산 개발에 이르기까지 아이디어를 실질적인 가치로 발전시키는 데 집중합니다.

우리는 형태와 기능, 기술과 시장을 연결하며 디자인이 더 넓은 가능성으로 확장될 수 있는 방법을 탐구합니다.
하나의 오브제에서 시작된 아이디어가 제품이 되고, 지식재산이 되고, 새로운 산업의 가능성으로 이어질 수 있도록.

xatom은 새로운 차원을 디자인합니다.`;

  return (
    <main lang="ko" className="bg-white text-black">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur">
        <nav className="section-shell flex min-h-[64px] items-center justify-between py-2 md:h-50 md:min-h-0 md:py-0">
          <Link href="/" aria-label="Go to intro" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} className="h-auto w-[120px] md:w-[160px]" priority />
          </Link>
          <div className="grid grid-cols-[auto_auto_auto_auto] grid-rows-2 items-center justify-items-start gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.18em] md:hidden">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#ip" className="-ml-2">IP</a>
            <a href="https://instagram.com/xatom.space" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#shop" className="col-start-1 row-start-2">Shop</a>
            <a href="#contact" className="col-start-2 row-start-2">Contact</a>
          </div>

          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.22em] md:flex">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#ip">IP</a>
            <a href="#shop">Shop</a>
            <a href="#contact">Contact</a>
            <a href="https://instagram.com/xatom.space" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </nav>
      </header>

      <section id="hero" className="w-full scroll-mt-[96px] py-14 md:scroll-mt-[120px] md:py-24">
        <ProductCarousel images={productImages} />
      </section>

      <section id="about" className="section-shell scroll-mt-[96px] py-20 md:scroll-mt-[120px] md:py-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">About</p>

        <div className="mt-8 max-w-4xl md:max-w-7xl">
          <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">xatom</h2>

          <div
            className="mt-6 text-justify text-sm font-light leading-relaxed text-black/80 [hyphens:auto] [text-align-last:left] md:!text-[21px] md:font-extralight"
            style={{ textAlign: undefined, textJustify: undefined }}
          >
            <p
              className={aboutExpanded ? 'whitespace-pre-line' : 'overflow-hidden whitespace-pre-line'}
              style={
                aboutExpanded
                  ? undefined
                  : {
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 4,
                    }
              }
            >
              {aboutEn}
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setAboutExpanded((v) => !v)}
                className="text-xs uppercase tracking-[0.22em] text-emerald-700 transition hover:text-black"
              >
                {aboutExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>

            {!aboutExpanded ? (
              <div className="relative mt-4">
                <p
                  className="overflow-hidden whitespace-pre-line text-black/35 blur-[0.6px]"
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                    textAlign: 'left',
                    textJustify: 'auto',
                  }}
                >
                  {aboutKo}
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                <p className="whitespace-pre-line">{aboutKo}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="ip" className="section-shell scroll-mt-[96px] py-20 md:scroll-mt-[120px] md:py-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">IP</p>

        <div className="mt-8 max-w-4xl md:max-w-7xl">
          <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">Intellectual Property</h2>
          <div className="mt-6 max-w-4xl text-justify text-sm font-light leading-relaxed text-black/70 [hyphens:auto] [text-align-last:left] md:text-base">
            <p>XATOM은 새로운 산업으로 확장될 수 있는 제품 컨셉, 디자인 시스템, 그리고 독자적인 IP를 개발합니다.</p>
            <p className="mt-5">기업과의 기술협력 및 라이선싱 파트너십을 통해 혁신적인 아이디어를 시장으로 연결합니다. 우리는 IP의 가치를 확장하여 새로운 산업과 비즈니스를 창출합니다.</p>
            <p className="mt-5 text-xs font-medium tracking-[0.18em] text-black/60 md:text-sm">특허 | 디자인권 | 라이선싱 | 파트너십</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[280px_1fr] md:items-start">
            <div className="border border-black/20 px-6 py-5 text-sm font-medium uppercase tracking-[0.22em] text-black md:text-base">
              Smart Farm Unit
            </div>

            <div className="text-justify text-sm font-light leading-relaxed text-black/75 [hyphens:auto] [text-align-last:left] md:text-base">
              <div
                className={ipExpanded ? 'space-y-5' : 'overflow-hidden'}
                style={
                  ipExpanded
                    ? undefined
                    : {
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                      }
                }
              >
                <div>
                  <p lang="en">XATOM presents smart farm designs that set new standards for future industries.</p>
                  <p lang="en">By seamlessly connecting space and technology through innovative design, we unlock new opportunities across both consumer and commercial markets.</p>
                  <p lang="en">Built on proprietary intellectual property, XATOM is shaping the next generation of industry standards.</p>
                  <p lang="en">Beyond agricultural equipment, XATOM's smart farm technology is proposed as design objects, furniture, and spatial products.</p>
                </div>

                {ipExpanded ? (
                  <div>
                    <p>XATOM은 미래 산업의 표준이 될 스마트팜 디자인을 제안합니다.</p>
                    <p>공간과 기술을 연결하는 혁신적인 디자인으로 B2C와 B2B 시장의 새로운 가능성을 확장합니다.</p>
                    <p>독자적인 IP를 기반으로 미래 산업의 새로운 기준을 만들어갑니다.</p>
                    <p>xatom의 스마트팜은 농업장비를 넘어, 스마트팜 기술을 디자인 오브제·가구·공간 제품으로 제안합니다.</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIpExpanded((v) => !v)}
                  className="text-xs uppercase tracking-[0.22em] text-emerald-700 transition hover:text-black"
                >
                  {ipExpanded ? 'Read less' : 'Read more'}
                </button>
              </div>

              {!ipExpanded ? (
                <div className="relative mt-4">
                  <div
                    className="overflow-hidden text-black/35 blur-[0.6px]"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                    }}
                  >
                    <p>XATOM은 미래 산업의 표준이 될 스마트팜 디자인을 제안합니다.</p>
                    <p>공간과 기술을 연결하는 혁신적인 디자인으로 B2C와 B2B 시장의 새로운 가능성을 확장합니다.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="section-shell scroll-mt-[96px] py-20 md:scroll-mt-[120px] md:py-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">Shop</p>

        <div className="mt-8 max-w-4xl md:max-w-7xl">
          <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">Design Works</h2>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Link href="/products/verume" className="group block">
            <div className="relative h-[320px] w-full overflow-hidden bg-black/[0.03]">
              <img src="/p6.jpg" alt="verumé" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            </div>
            <div className="mt-4 text-left">
              <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">verumé</h2>
              <p className="mt-2 text-justify text-sm text-black/60 [hyphens:auto] [text-align-last:left]" lang="en">Handcrafted with precision, designed to be the centerpiece of any space.</p>
            </div>
          </Link>

          <Link href="/products/model-6" className="group block cursor-pointer">
            <div className="relative h-[320px] w-full overflow-hidden bg-black/[0.03]">
              <img src="/p14.jpg" alt="model 6" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            </div>
            <div className="mt-4 text-left">
              <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">model 6</h2>
              <p className="mt-2 text-justify text-sm text-black/60 [hyphens:auto] [text-align-last:left]" lang="en">A sculptural armchair that brings architectural presence and timeless elegance to interior spaces.</p>
            </div>
          </Link>
        </div>
      </section>

      <section id="contact" className="section-shell scroll-mt-[96px] py-20 md:scroll-mt-[120px] md:py-28">
        <p className="text-[10px] uppercase tracking-[0.35em] text-black/60">Contact</p>
        <p className="mt-8 max-w-4xl text-justify text-sm font-light leading-relaxed text-black/70 [hyphens:auto] [text-align-last:left] md:text-base">
          라이선싱, 기술협력, 제조 파트너십 문의를 기다립니다.
        </p>

        <form ref={formRef} onSubmit={handleContactSubmit} className="mt-8 grid gap-5 md:p-10">
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
            className="w-fit border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-black hover:text-white disabled:opacity-60"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>

          {status ? <p className="text-sm text-black/60">{status}</p> : null}
        </form>
      </section>

      <footer className="mx-auto mt-32 w-full max-w-[1200px] px-5 pb-16 text-center text-xs font-light leading-snug text-neutral-400 md:px-12 md:text-sm md:leading-tight">
        <div className="mb-5 flex justify-center">
          <Image
            src="/xatom-v3-20260515.png"
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
