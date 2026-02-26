'use client';

import { motion } from 'framer-motion';
import { presskitData } from '../../lib/data';

export default function Events() {
  const { main, upcoming } = presskitData.events;

  return (
    <section className="px-6 py-16 lg:px-10 lg:py-24 bg-ando-navy">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl"
      >
        <h2 className="mb-12 text-center text-4xl font-bold text-white lg:text-5xl">
          Próximos Eventos
        </h2>

        {/* Main Event */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-ando-muted">
            Main Event
          </p>
          <h3 className="text-2xl font-bold text-white lg:text-3xl">
            {main.name}
          </h3>
          <p className="mt-2 text-sm text-white/50">
            {main.location}
          </p>
          <p className="mt-4 text-3xl font-bold tracking-wider text-white lg:text-4xl">
            {main.date}
          </p>
        </motion.div>

        {/* Upcoming */}
        <div className="grid grid-cols-2 gap-4">
          {upcoming.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <h4 className="text-base font-bold text-white">{event.name}</h4>
              <p className="mt-1 text-xs text-white/50">{event.location}</p>
              <p className="mt-3 text-2xl font-bold tracking-wider text-white">
                {event.date}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}