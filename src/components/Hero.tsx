'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Desktop: mouse-based parallax on the title
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const titleX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const titleY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Mobile: scroll-based parallax on the title
  const { scrollY } = useScroll();
  const scrollTitleY = useTransform(scrollY, [0, 400], [0, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ando-navy"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image — breathing loop */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/photos/hero-bg.jpg"
            alt="ANDO DJ Performance"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ando-navy/60 via-transparent to-ando-navy" />
        {/* Grain/noise texture */}
        <div className="hero-grain absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-6 lg:px-10">
        {/* Top Bar - Logo + Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 pt-6 lg:pt-10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50">
            A
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white">
            Groove y Ritmos Bailables
          </p>
        </motion.div>

        {/* Center - Name + Genre (bottom-left on mobile, center on desktop) */}
        <div className="flex flex-1 flex-col items-start justify-end pb-16 lg:items-center lg:justify-center lg:pb-0">
          {/* Desktop: mouse parallax */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
            className="hidden text-9xl font-bold text-white lg:block"
          >
            <motion.span style={{ x: titleX, y: titleY, display: 'inline-block' }}>
              ANDO.
            </motion.span>
          </motion.h1>
          {/* Mobile: scroll parallax */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              y: scrollTitleY,
            }}
            className="text-7xl font-bold text-white lg:hidden"
          >
            ANDO.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-3 text-sm tracking-[0.2em] text-white/90 uppercase md:tracking-[0.3em]"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
          >
            <span className="text-ando-cyan">| </span>Progressive House/ Tech House
          </motion.p>
        </div>
      </div>
    </section>
  );
}