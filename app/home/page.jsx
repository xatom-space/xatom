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

function ProductCarousel({ images }: { images: string[] }) {
  const slides = useMemo(() => images.slice(0, 5), [images]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full aspect-video">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={src} className="relative h-full w-full shrink-0">
              <Image src={src} alt={`product-${i + 1}`} fill sizes="100vw" priority={i === 0} className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState('');
  const [aboutExpanded, setAboutExpanded] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const productImages = ['/p1.jpg', '/p2.jpg', '/p3.jpg', '/p4.jpg', '/p5.jpg'];
  const CONTACT_TO = 'xatom_space@naver.com';

  async function handleBuy() {
    try {
      setBuying(true);
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Checkout failed.');
      }

      window.location.href = data.url;
    } catch (error: any) {
      setStatus(error?.message || 'Checkout failed.');
    } finally {
      setBuying(false);
    }
  }

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus('');

    const formEl = formRef.current ?? e.currentTarget;
    const formData = new FormData(formEl);

    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
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

      // ✅ 성공 메시지: Thank You + 웃음 이모티콘
      setStatus('Thank You 😄');
    } catch (error: any) {
      // ✅ 실패 시에도 사용자에게 안내
      setStatus('Send failed. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const aboutEn = `Space is never empty; it carries tension, light, silence, and density, and xatom approaches that invisibility as material rather than absence. We do not treat a room as a passive container for objects, but as a textured field whose character is shaped by balance—between weight and openness, brightness and shadow, proximity and distance. A single form can divide the air, redirect attention, and shift the way light settles on surfaces; when light passes through matter, a new sense of density emerges, subtle but unmistakable. xatom objects are not ornaments and not afterthoughts. They are structures that recalibrate atmosphere: they hold plants, contain light, attach to walls, or rest quietly on surfaces, always entering into dialogue with what surrounds them. That dialogue is where spatial character is formed. We do not imitate nature; we interpret its texture, translating growth, tension, and rhythm into measured geometry. Like ripples on water—fine, controlled, and undeniable—our work uses material, finish, and luminosity to create precise shifts in perception. Cool surfaces meet warmth, geometry meets growth, structure meets sensibility, and the space responds in kind. When an object is placed with intention, balance changes; the room feels newly aligned, as if the air has been tuned. That is where density begins, and that is xatom.`;

  const aboutKo = `공간은 결코 비어 있지 않습니다. 그 안에는 긴장, 빛, 침묵, 그리고 밀도가 함께 존재합니다. xatom은 공간을 단순한 배경이 아니라 물성과 감도가 겹겹이 쌓인 ‘장(場)’으로 바라봅니다. 우리는 공간의 분위기가 보이지 않는 공기와 빛, 재료의 균형으로 만들어진다고 믿으며, 그 균형은 때로 하나의 오브제로부터 시작될 수 있다고 생각합니다. 하나의 형태는 공기를 가르고 시선을 정렬하며, 빛은 물성을 통과하거나 머금는 방식으로 표면 위에 새로운 질서를 남깁니다. 그 순간 공간은 이전과 다른 밀도를 갖게 됩니다. xatom의 오브제는 장식이 아닙니다. 기능을 넘어, 공간의 분위기를 조율하는 구조체입니다. 식물을 담고, 빛을 품고, 벽에 고정되거나 테이블 위에 놓이며, 오브제는 언제나 주변의 공기와 관계를 맺습니다. 우리는 그 관계가 공간의 인상을 결정한다고 믿습니다. 우리는 자연을 모방하지 않습니다. 대신 자연이 가진 결—성장과 긴장, 흐름과 리듬—을 이해하고, 그것을 형태로 번역합니다. 물의 파동처럼 미세하지만 분명한 변화를 만들기 위해, 재료의 온도와 표면의 마감, 빛의 방향과 투과를 정교하게 다룹니다. 차가운 재료 속에 온도를 남기고, 구조적인 형태 위에 감각을 얹으며, 과장하지 않고 설명하지 않고 존재로 말합니다. 하나의 오브제가 놓이는 순간 공간의 균형은 다시 정의되고, 그때 비로소 밀도는 드러납니다. That is where density begins.`;

  return (
    <main className="bg-white text-black">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur">
        <nav className="section-shell flex h-50 items-center justify-between">
          <Link href="/" aria-label="Go to intro" className="flex items-center">
            <Image src="/xatom-v1.png" alt="xatom logo" width={160} height={60} priority />
          </Link>

          <div className="flex items-center gap-5 text-xs tracking-[0.22em] uppercase md:gap-8">
            <a href="#hero">Home</a>
            <a href="#about">About</a>
            <a href="#shop">Shop</a>
            <a href="#contact">Contact</a>
            <a href="https://instagram.com/xatom.space" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </nav>
      </header>

      <section id="hero" className="w-full py-14 md:py-24">
        <ProductCarousel images={productImages} />
      </section>

      <section id="about" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">About</p>

        <div className="mt-8 max-w-4xl">
          <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">xatom</h2>

          <div
            className="mt-6 text-lg font-extralight leading-relaxed text-black/80 md:text-2xl text-justify"
            style={{ textAlign: 'justify', textJustify: 'inter-word' }}
          >
            <p
              className={aboutExpanded ? '' : 'overflow-hidden'}
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
                  className="overflow-hidden text-black/35 blur-[0.6px]"
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                    textAlign: 'justify',
                    textJustify: 'inter-word',
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

      <section id="shop" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Shop</p>

        <div className="mt-8 grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <img src="/p6.jpg" alt="Verumé" className="h-[320px] w-full object-cover" />

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extralight tracking-[0.1em] md:text-4xl">Verumé</h2>
              <p className="mt-4 text-black/60">Precision-built centerpiece in anodized finish.</p>
            </div>

            <button
              type="button"
              onClick={handleBuy}
              disabled={buying}
              className="mt-10 w-fit border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-black hover:text-white disabled:opacity-60"
            >
              {buying ? 'Processing...' : 'Order'}
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Contact</p>

        <form ref={formRef} onSubmit={handleContactSubmit} className="mt-8 grid gap-5 p-6 md:p-10">
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

      <footer className="mt-32 pb-16 text-center text-sm font-light leading-relaxed text-neutral-400">
        <p>
          © xatom – Contact.{' '}
          <a className="text-emerald-600" href={`mailto:${CONTACT_TO}`}>
            {CONTACT_TO}
          </a>{' '}
          | <span className="text-emerald-600">1800–2300</span>
        </p>
        <p className="mt-3">No Images may be reproduced without the permission of the company</p>
        <p className="mt-6">
          <span className="font-medium text-neutral-500">2026</span> © All rights reserved
        </p>
      </footer>
    </main>
  );
}