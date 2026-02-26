'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-ando-navy">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photos/hero-bg.jpg"
          alt="ANDO DJ Performance"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ando-navy/60 via-transparent to-ando-navy" />
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
            <Image src="/logo.png" alt="ANDO Logo" width={64} height={64} className="object-none" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white">
            Groove y Ritmos Bailables
          </p>
        </motion.div>

        {/* Center - Name + Genre (bottom-left on mobile, center on desktop) */}
        <div className="flex flex-1 flex-col items-start justify-end pb-16 lg:items-center lg:justify-center lg:pb-0">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-7xl font-bold text-white md:text-9xl"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            ANDO<span className="text-ando-cyan">.</span>
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