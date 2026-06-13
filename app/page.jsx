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
        src="/intro-v2.mp4?v=20260516-1"
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

      {/* 영상 속 X 로고 오른쪽 문구 */}
      <Link
        href="/home"
        aria-label="Go to home"
        className="intro-lockup absolute left-[50.4%] top-[47.3%] z-20 flex flex-col items-start text-left text-black opacity-0 md:left-[50.4%] md:top-[47.3%]"
      >
        <img
          src="/xatom-v3-trimmed.png?v=20260515"
          alt="xatom"
          className="intro-word mb-5 block w-[114px] self-start object-contain object-left md:mb-7 md:w-[205px]"
        />
        <span className="intro-word block self-start text-[12px] font-medium leading-[1.36] tracking-[0.24em] md:text-[20px] md:tracking-[0.25em]">
          DESIGN
        </span>
        <span className="intro-word block self-start text-[12px] font-medium leading-[1.36] tracking-[0.24em] md:text-[20px] md:tracking-[0.25em]">
          IP
        </span>
        <span className="intro-word block self-start text-[12px] font-medium leading-[1.36] tracking-[0.24em] md:text-[20px] md:tracking-[0.25em]">
          BUSINESS
        </span>
      </Link>

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