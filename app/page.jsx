import Link from 'next/link';

export default function IntroPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f5f5f2]">
      {/* 배경 영상 */}
      <video
        className="absolute inset-0 z-0 block h-full w-full object-cover object-bottom opacity-100 brightness-100 md:hidden"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/intro-mobile-poster.jpg?v=20260515"
        fetchPriority="high"
        src="/intro-v3.mp4?v=20260515-12"
      />
      <video
        className="absolute inset-0 z-0 hidden h-full w-full origin-bottom scale-125 object-cover object-bottom opacity-100 brightness-100 md:block"
        autoPlay
        muted
        playsInline
        preload="auto"
        fetchPriority="high"
        src="/intro-v2.mp4?v=20260515-12"
      />

      {/* 중앙 영역 (로고 + 문구) */}
      <div className="intro-lockup relative z-20 flex h-full w-full items-center justify-center px-8 opacity-0 translate-y-[21px] md:-translate-y-[54px] md:px-16">
        <Link
          href="/home"
          aria-label="Go to home"
          className="flex flex-col items-center gap-2 md:flex-row md:gap-[60px]"
        >
          <img
            src="/xatom-v1.png?v=20260515-2"
            alt="xatom logo"
            className="block h-[136px] w-auto max-w-[52vw] object-contain opacity-100 brightness-100 md:h-[258px] md:max-w-none"
          />

          <div className="intro-tagline flex flex-col items-start self-center text-left text-black md:self-auto">
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

        @media (min-width: 768px) {
          .intro-lockup {
            animation-delay: 1.35s;
          }
        }

        .intro-word {
          opacity: 0;
          transform: translateY(8px);
          animation: intro-word-in 520ms ease-out forwards;
        }

        .intro-word:nth-child(1) {
          animation-delay: 2s;
        }

        .intro-word:nth-child(2) {
          animation-delay: 2.45s;
        }

        .intro-word:nth-child(3) {
          animation-delay: 2.9s;
        }

        .intro-word:nth-child(4) {
          animation-delay: 3.35s;
        }

        @media (min-width: 768px) {
          .intro-word:nth-child(1) {
            animation-delay: 2.5s;
          }

          .intro-word:nth-child(2) {
            animation-delay: 2.95s;
          }

          .intro-word:nth-child(3) {
            animation-delay: 3.4s;
          }

          .intro-word:nth-child(4) {
            animation-delay: 3.85s;
          }
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