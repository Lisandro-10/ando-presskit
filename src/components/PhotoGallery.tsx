'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { presskitData } from '../../lib/data';

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const photos = presskitData.photos;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getVisiblePhotos = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % photos.length;
      visible.push({ ...photos[index], originalIndex: index });
    }
    return visible;
  };

  const visiblePhotos = getVisiblePhotos();

  // Swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);

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
      {/* Header: Label + Dots */}
      <div className="flex items-center justify-between px-6 pb-4 lg:px-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ando-muted">
          Press Photos
        </p>
        {/* Dot indicators - mobile only */}
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

      {/* Mobile: Swipeable single carousel */}
      <div
        className="lg:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

      {/* Desktop: 3-Column Carousel with arrows */}
      <div className="hidden lg:block relative">
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <FaChevronRight className="text-xl" />
        </button>

        <div className="grid grid-cols-3 gap-0">
          {visiblePhotos.map((photo, index) => (
            <motion.div
              key={`${currentIndex}-${photo.originalIndex}`}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: direction > 0 ? index * 0.05 : (3 - index) * 0.05 }}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-bold text-white">{photo.title}</h3>
                  {photo.description && (
                    <p className="mt-2 text-sm text-white/80 line-clamp-3">{photo.description}</p>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-ando-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}