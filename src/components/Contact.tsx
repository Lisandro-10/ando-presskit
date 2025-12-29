'use client';

import { motion } from 'framer-motion';
import { FaSpotify, FaInstagram, FaSoundcloud } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const socialIcons = {
  spotify: FaSpotify,
  instagram: FaInstagram,
  soundcloud: FaSoundcloud,
  x: FaXTwitter,
};

export default function Contact() {
  const socials = [
    { platform: 'spotify' as const, url: 'https://spotify.com/ando' },
    { platform: 'instagram' as const, url: 'https://instagram.com/ando' },
    { platform: 'soundcloud' as const, url: 'https://soundcloud.com/ando' },
    { platform: 'x' as const, url: 'https://x.com/ando' },
  ];

  return (
    <section className="px-6 py-20 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="mb-12 text-4xl font-bold text-ando-text lg:text-5xl">
          Contacto y Redes Sociales
        </h2>
        
        <div className="mb-8 flex justify-center gap-6">
          {socials.map((social) => {
            const Icon = socialIcons[social.platform];
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-4xl text-ando-text/70 transition-colors hover:text-ando-cyan"
              >
                <Icon />
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
