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

function ProductCarousel({ images }) {
  const slides = useMemo(() => images.slice(0, 5), [images]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
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
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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
      <div className="relative w-full aspect-video">
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
      </div>
    </div>
  );
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState('');

  const productImages = ['/p1.jpg', '/p2.jpg', '/p3.jpg', '/p4.jpg', '/p5.jpg'];

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

      <section id="hero" className="w-full py-14 md:py-24">
        <ProductCarousel images={productImages} />
      </section>

      {/* ✅ About: 제목 xatom + (한 칸 띄우고) 영문 + 한글 */}
      <section id="about" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">About</p>

        <div className="mt-8 max-w-4xl">
          <h2 className="text-xl font-semibold tracking-[0.06em] text-black md:text-2xl">
            xatom
          </h2>

          <div className="mt-6 space-y-6 text-lg font-extralight leading-relaxed text-black/80 md:text-2xl">
            <p>
              Space is never empty. It carries tension, light, silence, and density. xatom views space not as a passive
              backdrop, but as a textured field shaped by balance. We believe the atmosphere of a space can shift from a
              single object — through form, material, and light. A form divides the air. Light passes through matter.
              Density emerges. Our objects are not decoration. They are structures that recalibrate atmosphere. They
              hold plants, contain light, attach to walls, or rest quietly on surfaces — always entering into dialogue
              with the surrounding space. It is within that relationship that spatial character is formed. We do not
              imitate nature. We interpret its texture. Like ripples on water, subtle but undeniable, we work with
              material and luminosity to create measured shifts in perception. Cool surfaces meet warmth. Geometry meets
              growth. Structure meets sensibility. An object placed with intention can alter balance. It can redefine
              how a space is felt. That is where density begins. That is xatom.
            </p>

            {/* 한 칸 띄움 = 위 space-y-6로 이미 간격 확보됨 */}

            <p>
              Space is never empty. It carries tension, light, silence, and density. xatom은 공간을 단순한 배경이 아닌,
              결을 가진 존재로 바라봅니다. 우리는 공간이 보이지 않는 공기와 빛, 물성의 균형 위에서 완성된다고 믿습니다. 그리고
              그 균형은 하나의 오브제로부터 시작될 수 있습니다. 하나의 형태는 공기를 가르고, 빛은 물성을 통과하며, 공간은 새로운
              밀도를 갖습니다. xatom의 오브제는 장식이 아닙니다. 기능을 넘어, 공간의 분위기를 조율하는 구조체입니다. 식물을 담고,
              빛을 머금고, 벽에 고정되거나 테이블 위에 놓이며, 그것은 주변의 공기와 관계를 맺습니다. 우리는 그 관계가 공간의 인상을
              결정한다고 생각합니다. 우리는 자연을 모방하지 않습니다. 대신 자연의 결을 이해하고, 그것을 형태로 번역합니다. 물의
              파동처럼 미세하지만 분명한 변화를 만들기 위해, 물성과 빛의 흐름을 다룹니다. 공간은 비어 있지 않습니다. 오브제는 그
              밀도를 드러내는 매개입니다. xatom은 공간의 감도를 높이는 물성을 탐구합니다. 구조적인 형태 위에 감각을 얹고, 차가운
              재료 속에 온도를 남깁니다. 우리는 과장하지 않고, 설명하지 않으며, 존재로 말합니다. 하나의 오브제가 놓이는 순간, 공간의
              균형은 다시 정의됩니다. That is where density begins.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Shop: border 완전 제거 */}
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
              className="mt-10 w-fit border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white disabled:opacity-60"
            >
              {buying ? 'Processing...' : 'Order'}
            </button>
          </div>
        </div>
      </section>

      {/* ✅ Contact: border 완전 제거 */}
      <section id="contact" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Contact</p>

        <form onSubmit={handleContactSubmit} className="mt-8 grid gap-5 p-6 md:p-10">
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