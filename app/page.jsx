'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function IntroPage() {
  const [showText, setShowText] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 2000); // 2초 후 문구 표시
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    const playVideo = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      playVideo();
      return;
    }

    video.addEventListener('canplay', playVideo, { once: true });
    return () => video.removeEventListener('canplay', playVideo);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      {/* 배경 영상 */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-bottom md:origin-bottom md:scale-125 md:object-bottom"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        {/* 캐시 방지용 버전 파라미터 */}
        <source media="(max-width: 767px)" src="/intro-v3.mp4?v=20260515-4" type="video/mp4" />
        <source src="/intro-v2.mp4?v=20260515-10" type="video/mp4" />
      </video>

      {/* 중앙 영역 (로고 + 문구) */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        {/* 로고 */}
        <Link href="/home" aria-label="Go to home">
          <img
            src="/xatom-v1.png?v=20260515-2"
            alt="xatom logo"
            className="block h-[180px] w-auto max-w-[86vw] object-contain md:h-[320px]"
          />
        </Link>

        {/* 2초 후 나타나는 문구 (크기 키움, 마침표 없음) */}
        <p
          className={[
            '-mt-6 text-[17px] text-black tracking-wide md:-mt-12 md:text-2xl',
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