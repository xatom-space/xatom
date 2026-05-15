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
      <div className="intro-lockup relative z-20 flex h-full w-full items-center justify-center px-8 opacity-0 md:-translate-y-[54px] md:px-16">
        <Link
          href="/home"
          aria-label="Go to home"
          className="flex items-center gap-6 md:gap-[86px]"
        >
          <img
            src="/xatom-v1.png?v=20260515-2"
            alt="xatom logo"
            className="block h-[136px] w-auto max-w-[42vw] object-contain opacity-100 brightness-100 md:h-[258px] md:max-w-none"
          />

          <div className="intro-tagline flex flex-col items-start text-left text-black">
            <img
              src="/xatom-v3-trimmed.png?v=20260515"
              alt="xatom"
              className="intro-word mb-6 block w-[105px] self-start object-contain object-left md:mb-10 md:w-[231px]"
            />
            <span className="intro-word block self-start text-[13px] font-medium leading-[1.28] tracking-[0.24em] md:text-[22px] md:tracking-[0.25em]">
              DESIGN
            </span>
            <span className="intro-word block self-start text-[13px] font-medium leading-[1.28] tracking-[0.24em] md:text-[22px] md:tracking-[0.25em]">
              IP
            </span>
            <span className="intro-word block self-start text-[13px] font-medium leading-[1.28] tracking-[0.24em] md:text-[22px] md:tracking-[0.25em]">
              BUSINESS
            </span>
          </div>
        </Link>
      </div>

      <style>{`
        .intro-lockup {
          animation: intro-lockup-in 360ms ease-out 0.85s forwards;
        }

        .intro-word {
          opacity: 0;
          transform: translateY(8px);
          animation: intro-word-in 520ms ease-out forwards;
        }

        .intro-word:nth-child(1) {
          animation-delay: 5s;
        }

        .intro-word:nth-child(2) {
          animation-delay: 5.45s;
        }

        .intro-word:nth-child(3) {
          animation-delay: 5.9s;
        }

        .intro-word:nth-child(4) {
          animation-delay: 6.35s;
        }

        @keyframes intro-lockup-in {
          to {
            opacity: 1;
          }
        }

        @keyframes intro-word-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}