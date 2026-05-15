'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function IntroPage() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 2000); // 2초 후 문구 표시
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      <link rel="preload" as="video" href="/intro-v2.mp4?v=20260515-5" type="video/mp4" />
      {/* 배경 영상 */}
      <video
        className="absolute inset-0 h-full w-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        {/* 캐시 방지용 버전 파라미터 */}
        <source src="/intro-v2.mp4?v=20260515-5" type="video/mp4" />
      </video>

      {/* 중앙 영역 (로고 + 문구) */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        {/* 로고 */}
        <Link href="/home" aria-label="Go to home">
          <img
            src="/xatom-v1.png?v=20260515-2"
            alt="xatom logo"
            className="block h-[224px] w-auto max-w-[86vw] object-contain md:h-[320px]"
          />
        </Link>

        {/* 2초 후 나타나는 문구 (크기 키움, 마침표 없음) */}
        <p
          className={[
            '-mt-8 text-black text-2xl tracking-wide md:-mt-12',
            'transition-all duration-700 ease-out',
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
          ].join(' ')}
        >
          Objects for Spatial Density
        </p>
      </div>
    </main>
  );
}