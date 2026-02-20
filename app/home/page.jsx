'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function HeroCarousel({ images }) {
  const slides = useMemo(() => images.slice(0, 5), [images]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // 자동 슬라이드
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((cur) => (cur + 1) % slides.length);
    }, 3500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  // 키보드 지원
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
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
      <div className="relative h-[70vh] w-full">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt={`product-${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* 좌우 버튼 */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 px-3 py-2 rounded-full"
            >
              →
            </button>
          </>
        )}

        {/* 도트 */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full ${
                  i === index ? 'bg-black' : 'bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const productImages = [
    '/products/p1.jpg',
    '/products/p2.jpg',
    '/products/p3.jpg',
    '/products/p4.jpg',
    '/products/p5.jpg',
  ];

  return (
    <main className="min-h-screen w-full bg-white">
      {/* 로고 영역 (경계선 제거) */}
      <header className="bg-white">
        <div className="flex h-40 items-center px-6">
          <Link href="/">
            <Image
              src="/xatom-v1.png"
              alt="xatom logo"
              width={200}
              height={80}
              priority
            />
          </Link>
        </div>
      </header>

      {/* 풀폭 캐러셀 (좌우 여백 없음) */}
      <section className="w-full">
        <HeroCarousel images={productImages} />
      </section>
    </main>
  );
}