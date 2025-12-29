'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { presskitData } from '../../lib/data';

export default function PhotoGallery() {
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
          Fotos Profesionales
        </h2>
        
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {presskitData.photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={photo}
                alt={`ANDO Professional Photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
