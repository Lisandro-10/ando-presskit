'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { FaInstagram, FaSoundcloud } from 'react-icons/fa';
import type { Person, SocialLink } from '../../lib/data';

interface ContactProps {
  imageSrc: string;
  people: Person[];
  directEmail: string;
  socials: SocialLink[];
}

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
}

function MagneticLink({ href, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHoverDevice, setIsHoverDevice] = useState<boolean | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Lazy-check hover capability once
    if (isHoverDevice === null) {
      const canHover = window.matchMedia('(hover: hover)').matches;
      setIsHoverDevice(canHover);
      if (!canHover) return;
    }
    if (!isHoverDevice && isHoverDevice !== null) return;

    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 80) {
      rawX.set(dx * 0.35);
      rawY.set(dy * 0.35);
    }
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-ando-cyan"
    >
      {children}
    </motion.a>
  );
}

export default function Contact({ imageSrc, people, directEmail, socials }: ContactProps) {
  return (
    <section className="relative w-full overflow-hidden bg-ando-navy px-6 py-20 lg:px-10 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
      >
        {/* Info — segunda en mobile (la foto abre la sección), primera columna en desktop */}
        <div className="order-2 lg:order-1">
          <h2 className="font-orbitron text-4xl font-bold text-white lg:text-5xl">
            Contact
          </h2>
          <div className="mt-4 h-0.5 w-16 bg-ando-cyan" />

          <div className="mt-10 space-y-6">
            {people.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-white">{person.name}</h3>
                <a
                  href={`tel:${person.phone.replace(/\s/g, '')}`}
                  className="mt-1 block font-spaceGrotesk text-sm text-white/70 transition-colors hover:text-ando-cyan"
                >
                  {person.phone}
                </a>
              </motion.div>
            ))}
          </div>

          <div className="my-10 h-px bg-white/10" />

          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ando-muted">
            Consultas Directas
          </p>
          <a
            href={`mailto:${directEmail}`}
            className="text-lg text-white transition-colors hover:text-ando-cyan"
          >
            {directEmail}
          </a>

          {socials.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {socials.map((social) => {
                const Icon = social.url.includes('soundcloud') ? FaSoundcloud : FaInstagram;
                return (
                  <MagneticLink key={social.url} href={social.url}>
                    <Icon className="text-base" />
                    {social.label}
                  </MagneticLink>
                );
              })}
            </div>
          )}

          <div className="mt-14 border-t border-white/10 pt-8">
            <p className="text-2xl font-bold text-white lg:text-3xl">ANDO</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
              © {new Date().getFullYear()} Ando Project. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Imagen — acá la foto es contenido, no fondo: sin scrim y sin priority */}
        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-2xl lg:order-2">
          <Image
            src={imageSrc}
            alt="ANDO"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
