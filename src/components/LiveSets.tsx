'use client';

import { motion } from 'framer-motion';
import type { LiveSet } from '../../lib/data';

interface LiveSetsProps {
  sets: LiveSet[];
}

/** Devuelve el id de un video de YouTube, o null si la URL no es de YouTube. */
function youtubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname.endsWith('youtu.be')) {
    return parsed.pathname.slice(1) || null;
  }
  if (!/(^|\.)youtube(-nocookie)?\.com$/.test(parsed.hostname)) {
    return null;
  }

  const v = parsed.searchParams.get('v');
  if (v) return v;

  const match = parsed.pathname.match(/^\/(?:embed|live|shorts|v)\/([^/?#]+)/);
  return match ? match[1] : null;
}

function buildEmbedUrl(url: string): string {
  const id = youtubeId(url);
  if (id) {
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  }
  return (
    `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}` +
    `&visual=true&color=%2300d9ff&auto_play=false&hide_related=true` +
    `&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`
  );
}

export default function LiveSets({ sets }: LiveSetsProps) {
  if (sets.length === 0) return null;

  return (
    <section className="relative bg-ando-navy py-16 lg:py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10"
      >
        <div className="mb-12 text-center">
          <h2 className="font-orbitron text-4xl font-bold text-white lg:text-5xl">
            Live Sets
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-ando-cyan" />
        </div>

        <div
          className={
            sets.length === 1
              ? 'mx-auto max-w-3xl'
              : 'grid grid-cols-1 md:grid-cols-2 gap-6'
          }
        >
          {sets.map((set, index) => {
            // El player de SoundCloud llena cualquier alto; el de YouTube es
            // 16:9 y con alto fijo queda con barras negras.
            const isYouTube = youtubeId(set.url) !== null;

            return (
              <motion.div
                key={set.url}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                // En una sola columna cada card mide lo que mide su player. Desde
                // `md` la grilla estira todas las cards de la fila al alto de la
                // más alta, así que se les fija el mismo 16:9 y el iframe lo llena:
                // sin ese alto común, la card corta (YouTube) queda con fondo muerto.
                className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md md:aspect-video"
              >
                <iframe
                  src={buildEmbedUrl(set.url)}
                  title={set.title}
                  className={`w-full md:absolute md:inset-0 md:h-full md:aspect-auto ${
                    isYouTube ? 'aspect-video' : 'h-[300px]'
                  }`}
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  style={{ border: 'none' }}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
