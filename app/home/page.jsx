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

      <section id="about" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">About</p>
        <p className="mt-6 max-w-3xl text-lg font-extralight leading-relaxed text-black/80 md:text-2xl">
          xatom.space is a material-first studio exploring minimal objects at the boundary of
          architecture and product design. Every surface is reduced to essential form, while detail
          is tuned for tactile clarity.
        </p>
      </section>

      <section id="shop" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Shop</p>

        <div className="mt-8 grid gap-8 border border-black/10 p-6 md:grid-cols-2 md:p-10">
          <img
            src="/p6.jpg"
            alt="Verumé"
            className="h-[320px] w-full object-cover"
          />

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extralight tracking-[0.1em] md:text-4xl">
                Verumé
              </h2>

              <p className="mt-4 text-black/60">
                Precision-built centerpiece in anodized finish.
              </p>
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

      <section id="contact" className="section-shell py-20 md:py-28">
        <p className="text-[10px] tracking-[0.35em] uppercase text-black/60">Contact</p>

        <form onSubmit={handleContactSubmit} className="mt-8 grid gap-5 border border-black/10 p-6 md:p-10">
          <input name="name" required placeholder="Name"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black" />
          <input name="email" required type="email" placeholder="Email"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black" />
          <textarea name="message" required rows={5} placeholder="Message"
            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-black" />
          <button type="submit" disabled={sending}
            className="w-fit border border-black/20 px-8 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white disabled:opacity-60">
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {status ? <p className="text-sm text-black/60">{status}</p> : null}
        </form>
      </section>
    </main>
  );
}