'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { presskitData } from '../../lib/data';

export default function Discography() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-ando-text lg:text-5xl">
          Discografía / Últimos Lanzamientos
        </h2>
        
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {presskitData.releases.map((release, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-ando-navy/50">
                <Image
                  src={release.artwork}
                  alt={release.title}
                  fill
                  className="object-cover"
                />
              </div>
              <a
                href={release.link}
                className="block rounded-lg border border-ando-cyan/30 bg-ando-cyan/10 px-4 py-2 text-center text-sm font-semibold text-ando-cyan transition-all hover:bg-ando-cyan/20"
              >
                Escuchar Ahora
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
