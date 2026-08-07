'use client';

import { motion, useTransform, useScroll } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
  tagline: string;
  bio: string;
  imageSrc: string;
}

export default function Hero({ tagline, bio, imageSrc }: HeroProps) {
  const { scrollY } = useScroll();
  const scrollTitleY = useTransform(scrollY, [0, 400], [0, -30]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ando-navy">
      {/* Background Image — estática: sin loop de escala ni parallax de mouse.
          El único movimiento del Hero es el parallax de scroll en mobile. */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="ANDO DJ Performance"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="hero-grain absolute inset-0" />
      </div>

      {/* Content — sin animación de entrada: el texto del Hero es el elemento
          LCP y con `initial: opacity 0` no pinta hasta que hidrata Framer.
          El parallax (mouse y scroll) sí se conserva. */}
      <div className="relative z-10 flex h-full flex-col px-6 lg:px-10">
        {/* Top Bar */}
        <div className="flex items-center gap-3 pt-6 lg:pt-10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50">
            A
          </div>
        </div>

        {/* Center - Name + Genre */}
        <div className="flex flex-1 flex-col items-start justify-end pb-16 lg:items-center lg:justify-center lg:pb-0">
          {/* Desktop: estático */}
          <h1
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            className="hidden text-9xl font-bold text-white lg:block"
          >
            ANDO.
          </h1>
          {/* Mobile: scroll parallax */}
          <motion.h1
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)', y: scrollTitleY }}
            className="text-7xl font-bold text-white lg:hidden"
          >
            ANDO.
          </motion.h1>
          <p
            className="mt-3 text-sm tracking-[0.2em] text-white/90 uppercase md:tracking-[0.3em]"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
          >
            <span className="text-ando-cyan">| </span>
            {tagline}
          </p>
          <p
            className="mt-30 max-w-xl font-spaceGrotesk text-sm text-white/80 lg:text-center lg:text-base"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
          >
            {/* {bio} */}
          </p>
        </div>
      </div>
    </section>
  );
}
