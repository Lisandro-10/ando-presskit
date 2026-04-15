'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { presskitData } from '../../lib/data';

export default function PhotoGallery() {
  const photos = presskitData.photos;

  // Desktop: hover state for contact sheet effect
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Mobile: swipeable carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStart(null);
  };

  return (
    <section className="w-full bg-ando-navy">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-4 lg:px-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ando-muted">
          Press Photos
        </p>
        {/* Dots — mobile only */}
        <div className="flex gap-2 lg:hidden">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-ando-cyan' : 'bg-white/30'
              }`}
              aria-label={`Foto ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile: swipeable single carousel */}
      <div className="lg:hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={photos[currentIndex].src}
                alt={photos[currentIndex].title}
                fill
                className="object-cover grayscale"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop: contact sheet */}
      <div className="hidden lg:block px-10 pb-12">
        <div className="grid grid-cols-4 gap-1.5 overflow-visible">
          {photos.map((photo, index) => (
            // Outer: entry animation (fires once on scroll)
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.09 }}
              style={{ position: 'relative' }}
            >
              {/* Inner: ongoing interaction state */}
              <motion.div
                animate={{
                  scale: hoveredId === index ? 1.12 : hoveredId !== null ? 0.97 : 1,
                  opacity: hoveredId !== null && hoveredId !== index ? 0.4 : 1,
                  zIndex: hoveredId === index ? 20 : 1,
                }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                onHoverStart={() => setHoveredId(index)}
                onHoverEnd={() => setHoveredId(null)}
                className="relative aspect-[2/3] cursor-pointer overflow-hidden border border-white/10"
                style={{ position: 'relative' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover grayscale"
                />

                {/* Número de foto + título (visible en hover) */}
                <motion.div
                  animate={{ opacity: hoveredId === index ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-transparent to-transparent p-4"
                >
                  <div>
                    <p className="mb-1 text-[9px] uppercase tracking-[0.35em] text-ando-cyan">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                      {photo.title}
                    </h3>
                  </div>
                </motion.div>

                {/* Línea cyan inferior */}
                <motion.div
                  animate={{ scaleX: hoveredId === index ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-ando-cyan"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
