'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

export default function Stats() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-ando-text lg:text-5xl">
          Estadísticas Clave
        </h2>
        
        <div className="grid grid-cols-2 gap-8 lg:gap-12">
          {presskitData.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="mb-2 text-5xl font-bold text-ando-cyan lg:text-6xl">
                {stat.value}
              </p>
              <p className="text-sm text-ando-text/70 lg:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
