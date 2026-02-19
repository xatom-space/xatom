'use client';

import { useState } from 'react';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.25" width="19.5" height="19.5" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [buying, setBuying] = useState(false);
  const [status, setStatus] = useState('');

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
      message: formData.get('message')
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur">
        <nav className="section-shell flex h-20 items-center justify-between">
          <a href="#hero" className="thin-title text-xs tracking-[0.35em]">xatom.space</a>
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

      <section id="hero" className="section-shell py-14 md:py-24">
        <div className="relative overflow-hidden rounded-sm border border-white/10">
          <img
            src="/images/hero.svg"
            alt="xatom hero"
            className="h-[58vh] w-full object-cover md:h-[72vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <p className="thin-title text-[10px] text-accent">Engineered calm</p>
            <h1 className="mt-3 text-3xl font-extralight tracking-[0.12em] md:text-6xl">XATOM OBJECT 01</h1>
          </div>
        </div>
      </section>

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
