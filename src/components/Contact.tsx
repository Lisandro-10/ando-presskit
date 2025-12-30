'use client';

import { motion } from 'framer-motion';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { presskitData } from '../../lib/data';

export default function Contact() {

  return (
    <section className="px-6 py-20 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-ando-text lg:text-5xl">
          Contacto
        </h2>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {presskitData.contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8"
            >
              <h3 className="mb-6 text-center text-2xl font-bold text-ando-text">
                {contact.name}
              </h3>
              
              <div className="space-y-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-ando-text/80 transition-colors hover:text-ando-cyan"
                >
                  {contact.email && <FaEnvelope className="text-xl" />}
                  <span className="text-sm lg:text-base">{contact.email}</span>
                </a>
                
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-ando-text/80 transition-colors hover:text-ando-cyan"
                >
                  <FaPhone className="text-xl" />
                  <span className="text-sm lg:text-base">{contact.phone}</span>
                </a>
                
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-ando-text/80 transition-colors hover:text-ando-cyan"
                >
                  <FaInstagram className="text-xl" />
                  <span className="text-sm lg:text-base">Instagram</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}