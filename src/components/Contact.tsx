'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

export default function Contact() {
  return (
    <section className="px-6 py-16 lg:px-10 lg:py-24 bg-ando-navy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl"
      >
        <p className="mb-8 text-[10px] uppercase tracking-[0.3em] text-ando-muted">
          Contact Info
        </p>

        <div className="space-y-6">
          {presskitData.contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-bold text-white">
                {contact.name}
              </h3>
              <a
                href={`tel:${contact.phone}`}
                className="mt-1 block text-sm text-white/50 transition-colors hover:text-ando-cyan"
              >
                {contact.phone}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ando-muted">
          Consultas Directas
        </p>
        <a
          href="mailto:info.ando.ku@gmail.com"
          className="text-lg text-white transition-colors hover:text-ando-cyan"
        >
          info.ando.ku@gmail.com
        </a>
      </motion.div>
    </section>
  );
}