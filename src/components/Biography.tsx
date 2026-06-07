'use client';

import { motion } from 'framer-motion';
import type { BiographySegment } from '../../lib/data';

interface BiographyProps {
  column1: BiographySegment[];
  column2: BiographySegment[];
}

function renderSegment(segment: BiographySegment, i: number) {
  if (segment.emphasis === 'brand') {
    return (
      <span key={i} className="font-orbitron">
        {segment.text}
      </span>
    );
  }
  if (segment.emphasis === 'strong') {
    return <strong key={i}>{segment.text}</strong>;
  }
  return <span key={i}>{segment.text}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function Biography({ column1, column2 }: BiographyProps) {
  return (
    <section className="px-6 py-20 lg:px-12 lg:py-32 bg-ando-navy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <h2 className="mb-4 text-center text-4xl font-bold text-ando-text lg:text-5xl">
          Biografía
        </h2>
        <div className="mx-auto mb-12 h-0.5 w-16 bg-ando-cyan" />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {[column1, column2].map((col, i) => (
            <motion.div
              key={i === 0 ? 'column1' : 'column2'}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8"
            >
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-30 blur-2xl"
                style={{
                  background: i === 0
                    ? 'radial-gradient(ellipse at 30% 80%, rgba(0,217,255,0.25) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.25) 0%, transparent 70%)',
                }}
              />
              <p className="font-spaceGrotesk text-base leading-relaxed text-white/70 [&_strong]:font-semibold [&_strong]:text-white">
                {col.map(renderSegment)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
