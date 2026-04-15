'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

interface Video {
  src: string;
}

interface VideoCardProps {
  video: Video;
  playOnHover?: boolean;
  isDimmed?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  className?: string;
  animDelay?: number;
}

function VideoCard({
  video,
  playOnHover = false,
  isDimmed = false,
  onHoverStart,
  onHoverEnd,
  className = '',
  animDelay = 0,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // IntersectionObserver — mobile only (when not playOnHover)
  useEffect(() => {
    if (playOnHover) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            video.pause();
            video.currentTime = 0;
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [playOnHover]);

  const handleMouseEnter = () => {
    if (!playOnHover || !videoRef.current) return;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    onHoverStart?.();
  };

  const handleMouseLeave = () => {
    if (!playOnHover || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
    onHoverEnd?.();
  };

  const handleVideoTap = () => {
    if (playOnHover) return;
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: animDelay }}
      className={`group relative overflow-hidden rounded-lg bg-white/5 cursor-pointer transition-[filter,opacity] duration-500 ${
        isDimmed ? 'opacity-50 lg:opacity-100 lg:blur-sm lg:brightness-50' : ''
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleVideoTap}
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

      {/* Play indicator — mobile (IntersectionObserver mode) */}
      {!playOnHover && !isPlaying && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hover play overlay — desktop Bento */}
      {playOnHover && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute toggle */}
      <button
        onClick={handleMuteToggle}
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 lg:opacity-0 lg:group-hover:opacity-100"
        aria-label={isMuted ? 'Activar sonido' : 'Desactivar sonido'}
      >
        {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
      </button>

      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-ando-cyan transition-transform duration-300 group-hover:scale-x-100" />
    </motion.div>
  );
}

export default function VideoGallery() {
  const videos = presskitData.videos;
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative bg-ando-navy py-16 lg:py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-white lg:text-5xl">
          Eventos
        </h2>

        {/* Mobile: vertical stack — IntersectionObserver autoplay */}
        <div className="flex flex-col gap-4 lg:hidden">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} animDelay={index * 0.05} />
          ))}
        </div>

        {/* Desktop: Bento asymmetric grid
            video[0] = hero (col-span-2 row-span-2, left half)
            videos[1-4] = 2×2 grid (right half, 2 cols × 2 rows) */}
        <div
          className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-4"
          style={{ height: '78vh' }}
        >
          <VideoCard
            video={videos[0]}
            playOnHover
            isDimmed={hoveredId !== null && hoveredId !== 0}
            onHoverStart={() => setHoveredId(0)}
            onHoverEnd={() => setHoveredId(null)}
            className="col-span-2 row-span-2 h-full"
            animDelay={0}
          />
          {videos.slice(1, 5).map((video, i) => (
            <VideoCard
              key={i + 1}
              video={video}
              playOnHover
              isDimmed={hoveredId !== null && hoveredId !== i + 1}
              onHoverStart={() => setHoveredId(i + 1)}
              onHoverEnd={() => setHoveredId(null)}
              className="h-full"
              animDelay={(i + 1) * 0.08}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
