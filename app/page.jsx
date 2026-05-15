import Link from 'next/link';

export default function IntroPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f5f5f2]">
      {/* 배경 영상 */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover object-bottom opacity-100 brightness-100 md:origin-bottom md:scale-125 md:object-bottom"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/intro-mobile-poster.jpg?v=20260515"
        fetchPriority="high"
      >
        {/* 캐시 방지용 버전 파라미터 */}
        <source media="(max-width: 767px)" src="/intro-v3.mp4?v=20260515-11" type="video/mp4" />
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
        <div className="intro-tagline -mt-5 flex translate-y-2 flex-col items-center gap-1 text-[19px] font-bold leading-none tracking-wide text-black opacity-0 md:-mt-8 md:text-[22px]">
          <span>DESIGN</span>
          <span>IP</span>
          <span>BUSINESS</span>
        </div>
      </div>

      <style>{`
        .intro-tagline {
          animation: intro-tagline-in 700ms ease-out 2s forwards;
        }

        @keyframes intro-tagline-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}