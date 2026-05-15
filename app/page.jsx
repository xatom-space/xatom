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

    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = 'auto';
    video.load();

    const playVideo = () => {
      video.play().catch(() => {});
    };

    playVideo();

    if (video.readyState >= 2) {
      playVideo();
      return;
    }

    video.addEventListener('loadedmetadata', playVideo, { once: true });
    video.addEventListener('loadeddata', playVideo, { once: true });
    video.addEventListener('canplay', playVideo, { once: true });
    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f5f5f2]">
      {/* 배경 영상 */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-bottom opacity-100 brightness-100 md:origin-bottom md:scale-125 md:object-bottom"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/intro-mobile-poster.jpg?v=20260515"
        fetchPriority="high"
      >
        {/* 캐시 방지용 버전 파라미터 */}
        <source media="(max-width: 767px)" src="/intro-v3.mp4?v=20260515-9" type="video/mp4" />
        <source src="/intro-v2.mp4?v=20260515-11" type="video/mp4" />
      </video>

      {/* 중앙 영역 (로고 + 문구) */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center md:-translate-y-[54px]">
        {/* 로고 */}
        <Link href="/home" aria-label="Go to home">
          <img
            src="/xatom-v1.png?v=20260515-2"
            alt="xatom logo"
            className="block h-[162px] w-auto max-w-[86vw] object-contain opacity-100 brightness-100 md:h-[216px]"
          />
        </Link>

        {/* 2초 후 나타나는 문구 (크기 키움, 마침표 없음) */}
        <p
          className={[
            '-mt-6 text-[16px] text-black tracking-wide md:-mt-9 md:text-lg',
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