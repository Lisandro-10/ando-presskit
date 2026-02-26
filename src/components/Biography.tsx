'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

export default function Biography() {
  return (
    <section className="px-6 py-20 lg:px-12 lg:py-32 bg-ando-navy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-ando-text lg:text-5xl">
          Biografía
        </h2>
        
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <p
            className="font-spaceGrotesk text-base leading-relaxed text-white/70 [&_strong]:text-white [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: presskitData.biography.column1 }}
          />
          <p
            className="font-spaceGrotesk text-base leading-relaxed text-white/70 [&_strong]:text-white [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: presskitData.biography.column2 }}
          />
        </div>
      </motion.div>
    </section>
  );
}