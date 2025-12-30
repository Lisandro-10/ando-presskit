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

  // Get 4 visible photos cycling infinitely
  const getVisiblePhotos = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % photos.length;
      visible.push({ ...photos[index], originalIndex: index });
    }
    return visible;
  };

  const visiblePhotos = getVisiblePhotos();

  return (
    <section className="w-full pb-12 lg:pb-4">
      {/* Mobile: Single Carousel */}
      <div className="lg:hidden">
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
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-4 flex items-center justify-around">
          <button
            onClick={prevSlide}
            className="flex h-10 w-16 items-center justify-center bg-ando-cyan/20 text-ando-cyan rounded-full"
          >
            <FaChevronLeft />
          </button>
          
          <button
            onClick={nextSlide}
            className="flex h-10 w-16 items-center justify-center bg-ando-cyan/20 text-ando-cyan rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Mobile Description */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center"
        >
          <h3 className="text-lg font-bold text-white">{photos[currentIndex].title}</h3>
          <p className="mt-2 text-sm text-white/70">{photos[currentIndex].description}</p>
        </motion.div>
      </div>

      {/* Desktop: 4-Column Carousel - slides 1 at a time */}
      <div className="hidden lg:block relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center bg-ando-cyan/80 text-ando-text hover:bg-ando-cyan transition-colors"
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center bg-ando-cyan/80 text-ando-text hover:bg-ando-cyan transition-colors"
        >
          <FaChevronRight className="text-xl" />
        </button>

        {/* Photos Grid */}
        <div className="grid grid-cols-4 gap-0">
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
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-bold text-white">{photo.title}</h3>
                  <p className="mt-2 text-sm text-white/80 line-clamp-3">{photo.description}</p>
                </div>
              </div>
              {/* Cyan accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-ando-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}