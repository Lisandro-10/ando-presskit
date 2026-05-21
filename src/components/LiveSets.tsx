'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

interface LiveSet {
  title: string;
  trackUrl: string;
  description?: string;
}

function buildEmbedUrl(trackUrl: string): string {
  return (
    `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}` +
    `&visual=true&color=%2300d9ff&auto_play=false&hide_related=true` +
    `&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`
  );
}

export default function LiveSets() {
  const sets = presskitData.liveSets as LiveSet[];

  return (
    <section className="relative bg-ando-navy py-16 lg:py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10"
      >
        <div className="mb-12 text-center">
          <h2 className="font-orbitron text-4xl font-bold text-white lg:text-5xl">
            Live Sets
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-ando-cyan" />
        </div>

        <div
          className={
            sets.length === 1
              ? 'mx-auto max-w-3xl'
              : 'grid grid-cols-1 md:grid-cols-2 gap-6'
          }
        >
          {sets.map((set, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-md"
            >
              <iframe
                src={buildEmbedUrl(set.trackUrl)}
                title={set.title}
                className="h-[300px] w-full md:h-[450px]"
                loading="lazy"
                allow="autoplay"
                style={{ border: 'none' }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
