'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

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
          {[presskitData.biography.column1, presskitData.biography.column2].map((col, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8"
            >
              {/* Gradiente decorativo debajo de la tarjeta */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-30 blur-2xl"
                style={{
                  background: i === 0
                    ? 'radial-gradient(ellipse at 30% 80%, rgba(0,217,255,0.25) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.25) 0%, transparent 70%)',
                }}
              />
              <p
                className="font-spaceGrotesk text-base leading-relaxed text-white/70 [&_strong]:font-semibold [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: col }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}