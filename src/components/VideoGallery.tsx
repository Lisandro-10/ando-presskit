'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

interface Video {
  src: string;
}

function VideoCard({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleTap = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-ando-text/10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
    >
      <video
        ref={videoRef}
        src={video.src}
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      {/* Botón de sonido - aparece en hover */}
    <button
    onClick={(e) => {
        e.stopPropagation();
        if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
        }
    }}
    className="absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
    >
    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-ando-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
}

export default function VideoGallery() {
  const videos = presskitData.videos;

  return (
    <section className="relative lg:py-20 lg:px-4 overflow-hidden bg-ando-navy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-7xl"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-ando-text lg:text-5xl">
          Eventos
        </h2>

        {/* Mobile: Stack vertical */}
        <div className="flex flex-col gap-2 lg:hidden">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>

        {/* Desktop: 3 videos centrados */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:justify-center">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}