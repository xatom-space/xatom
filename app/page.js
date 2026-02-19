import Link from 'next/link';

export default function IntroPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ink text-offwhite">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/35" />

      <Link
        href="/home"
        className="relative z-10 flex h-full w-full items-center justify-center"
        aria-label="Go to home"
      >
        <img src="/logo.svg" alt="xatom logo" className="h-20 w-20 md:h-28 md:w-28" />
      </Link>
    </main>
  );
}
