import Link from 'next/link';

export default function IntroPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f5f5f2]">
      {/* 배경 영상 */}
      <video
        className="absolute inset-0 z-0 block h-full w-full object-cover object-center opacity-100 brightness-100 md:hidden"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/intro-mobile-poster.jpg?v=20260515"
        fetchPriority="high"
        src="/intro-v2.mp4?v=20260516-1"
      />
      <video
        className="absolute inset-0 z-0 hidden h-full w-full object-cover object-center opacity-100 brightness-100 md:block"
        autoPlay
        muted
        playsInline
        preload="auto"
        fetchPriority="high"
        src="/intro-v2.mp4?v=20260515-12"
      />

      {/* 영상 속 X 로고 오른쪽 문구 */}
      <Link
        href="/home"
        aria-label="Go to home"
        className="intro-lockup absolute left-1/2 top-[41.3%] z-20 block h-[24%] w-[82%] -translate-x-1/2 text-left text-black opacity-0 md:left-[40.6%] md:top-[41.3%] md:h-[22%] md:w-[31%] md:translate-x-0"
      >
        <span className="block pl-[48%] md:pl-[10.1vw]">
          <img
            src="/xatom-v3-trimmed.png?v=20260515"
            alt="xatom"
            className="intro-word mb-[18px] block w-[96px] object-contain object-left md:mb-6 md:w-[164px]"
          />
          <span className="intro-word block text-[10px] font-medium leading-[1.36] tracking-[0.25em] md:text-[17px] md:tracking-[0.25em]">
            DESIGN
          </span>
          <span className="intro-word block text-[10px] font-medium leading-[1.36] tracking-[0.25em] md:text-[17px] md:tracking-[0.25em]">
            IP
          </span>
          <span className="intro-word block text-[10px] font-medium leading-[1.36] tracking-[0.25em] md:text-[17px] md:tracking-[0.25em]">
            BUSINESS
          </span>
        </span>
      </Link>

      <p className="intro-earthrise pointer-events-none absolute right-[6%] bottom-[10%] z-20 text-right text-[10px] font-medium tracking-[0.22em] text-white opacity-100 [font-family:Apple_SD_Gothic_Neo,Arial,sans-serif] md:right-[5%] md:bottom-[7%] md:text-[13px] md:tracking-[0.24em]">
        1968_Earthrise
      </p>

      <style>{`
        .intro-lockup {
          animation: intro-lockup-in 360ms ease-out 6s forwards;
        }

        @media (min-width: 768px) {
          .intro-lockup {
            animation-delay: 6s;
          }
        }

        .intro-earthrise {
          animation: intro-earthrise-out 360ms ease-out 5.7s forwards;
        }

        .intro-word {
          opacity: 0;
          transform: translateY(8px);
          animation: intro-word-in 520ms ease-out forwards;
        }

        .intro-word:nth-child(1) {
          animation-delay: 6.15s;
        }

        .intro-word:nth-child(2) {
          animation-delay: 6.55s;
        }

        .intro-word:nth-child(3) {
          animation-delay: 6.95s;
        }

        .intro-word:nth-child(4) {
          animation-delay: 7.35s;
        }

        @media (min-width: 768px) {
          .intro-word:nth-child(1) {
            animation-delay: 6.15s;
          }

          .intro-word:nth-child(2) {
            animation-delay: 6.55s;
          }

          .intro-word:nth-child(3) {
            animation-delay: 6.95s;
          }

          .intro-word:nth-child(4) {
            animation-delay: 7.35s;
          }
        }

        @keyframes intro-lockup-in {
          to {
            opacity: 1;
          }
        }

        @keyframes intro-earthrise-out {
          to {
            opacity: 0;
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