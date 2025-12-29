'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

export default function TechRider() {
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
          {presskitData.technicalRider.title}
        </h2>
        
        <div className="space-y-4 text-ando-text/70">
          {presskitData.technicalRider.specs.map((spec, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="leading-relaxed"
            >
              {spec}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
