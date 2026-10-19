'use client';

import { motion } from 'framer-motion';
import type { RiderSetup } from '../../lib/data';

interface TechRiderProps {
  setups: RiderSetup[];
}

export default function TechRider({ setups }: TechRiderProps) {
  if (setups.length === 0) return null;

  return (
    // Borde arriba: LiveSets y Contact también son navy liso, sin él las tres
    // secciones se funden en un solo bloque.
    <section className="relative w-full overflow-hidden border-t border-white/10 bg-ando-navy px-6 py-20 lg:px-10 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-12 text-center">
          <h2 className="font-orbitron text-4xl font-bold text-white lg:text-5xl">
            Tech Rider
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-ando-cyan" />
          <p className="mt-6 font-spaceGrotesk text-sm text-white/70">
            Setups con los que tocamos
          </p>
        </div>

        <div className="space-y-4">
          {setups.map((setup, index) => (
            <motion.div
              key={setup.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-ando-muted">
                  {setup.label}
                </p>
                {setup.owned && (
                  <span className="rounded-full border border-ando-cyan/40 bg-ando-cyan/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-ando-cyan">
                    Equipo propio
                  </span>
                )}
              </div>
              <p className="font-spaceGrotesk text-base font-bold text-white sm:text-right lg:text-lg">
                {setup.gear.join(' · ')}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
