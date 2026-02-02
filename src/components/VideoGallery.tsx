'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

interface Video {
  src: string;
}

/**
 * Custom hook para manejar autoplay de video con Intersection Observer
 * Detecta cuando el video está visible en el viewport y lo reproduce/pausa automáticamente
 */
function useVideoAutoplay(threshold = 0.5) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configuración del Intersection Observer
    const options = {
      root: null, // usa el viewport
      rootMargin: '0px',
      threshold, // % del video que debe estar visible (0.5 = 50%)
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsInView(entry.isIntersecting);

        if (entry.isIntersecting) {
          // Video está visible - intentar reproducir
          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                // Autoplay bloqueado - esto es normal en algunos casos
                console.log('Autoplay previsto:', error.message);
                setIsPlaying(false);
              });
          }
        } else {
          // Video salió del viewport - pausar y resetear
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
        }
      });
    };

    // Crear el observer
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(video);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { videoRef, isPlaying, isInView };
}

function VideoCard({ video }: { video: Video }) {
  const { videoRef, isPlaying, isInView } = useVideoAutoplay(0.5);
  const [isMuted, setIsMuted] = useState(true);

  // Manejo de play/pause manual (cuando el usuario toca el video)
  const handleVideoTap = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Error al reproducir:', error.message);
        });
      }
    } else {
      video.pause();
    }
  };

  // Toggle mute
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que active handleVideoTap
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-ando-text/10 cursor-pointer"
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
        // Atributos críticos para mobile:
        // - muted: requerido para autoplay en iOS/Android
        // - playsInline: previene fullscreen en iOS
        // - preload="metadata": carga metadata sin descargar todo el video
      />
      
      {/* Indicador de play (se muestra cuando está pausado y en vista) */}
      {!isPlaying && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ando-cyan/80">
            <svg 
              className="h-8 w-8 text-white ml-1" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Botón de mute/unmute */}
      <button
        onClick={handleMuteToggle}
        className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 lg:opacity-0 lg:group-hover:opacity-100"
        aria-label={isMuted ? 'Activar sonido' : 'Desactivar sonido'}
      >
        {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
      </button>

      {/* Barra de acento cyan en hover */}
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

        {/* Desktop: 4 videos en grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {videos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}