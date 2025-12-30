'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photos/hero-bg.jpg"
          alt="ANDO DJ Performance"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-ando-navy/70 via-ando-navy/50 to-ando-navy" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 lg:p-12"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ando-cyan">
              <Image src="/logo.png" alt="ANDO Logo" width={128} height={128} className="object-none"/>
            </div>
            <div className="text-sm text-white">
              <p className="font-bold">Groove, Ritmos Bailables y</p>
              <p className="font-bold">Underground Elegante</p>
            </div>
          </div>
        </motion.div>

        {/* Center Logo */}
        <div className="flex flex-1 items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-8xl font-bold text-white md:text-9xl"
          >
            ANDO
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
