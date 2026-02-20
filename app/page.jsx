'use client';

import Link from 'next/link';

export default function IntroPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      <video
        className="absolute inset-0 h-full w-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/35 z-10" />

      <Link
        href="/home"
        className="relative z-20 flex h-full w-full items-center justify-center"
        aria-label="Go to home"
      >
        <img
          src="/xatomlogo-v2.png"
          alt="xatom logo"
          className="h-[150px] w-[150px]"
        />
      </Link>
    </main>
  );
}