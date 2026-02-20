'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function IntroPage() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      
      {/* 배경 영상 */}
      <video
        className="absolute inset-0 h-full w-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/intro-v2.mp4" type="video/mp4" />
      </video>

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/35 z-10" />

      {/* 중앙 영역 (로고 + 문구 세트) */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        
        {/* 로고 */}
        <Link href="/home" aria-label="Go to home">
          <img
            src="/xatomlogo-v2.png"
            alt="xatom logo"
            className="h-[120px] w-auto object-contain"
          />
        </Link>

        {/* 2초 후 나타나는 문구 */}
        <p
          className={[
            'mt-6 text-white text-lg tracking-wide',
            'transition-all duration-700 ease-out',
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
          ].join(' ')}
        >
          Objects for Spatial Density.
        </p>

      </div>
    </main>
  );
}