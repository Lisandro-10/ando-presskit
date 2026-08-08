'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { EventInfo } from '../../lib/data';

interface EventsProps {
  imageSrc: string;
  list: EventInfo[];
}

const PAGE_SIZE = 5;

/** 'DD.MM.YYYY' → timestamp. El formato es fijo, ver `lib/data.ts`. */
function toTime(date: string): number {
  const [dd, mm, yyyy] = date.split('.').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

/**
 * Descendente: la más nueva primero. Para invertirlo a "la próxima primero",
 * cambiar `tb - ta` por `ta - tb` — es el único lugar donde vive esa decisión.
 * Una fecha mal tipeada da NaN; se manda al final en vez de dejarla flotando
 * en una posición arbitraria.
 */
function compareByDate(a: EventInfo, b: EventInfo): number {
  const ta = toTime(a.date);
  const tb = toTime(b.date);
  if (Number.isNaN(ta)) return Number.isNaN(tb) ? 0 : 1;
  if (Number.isNaN(tb)) return -1;
  return tb - ta;
}

/** Medianoche de hoy: un evento sigue siendo "próximo" durante el día que ocurre. */
function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function EventRow({ event, isUpcoming }: { event: EventInfo; isUpcoming: boolean }) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md transition-colors duration-500 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
        isUpcoming ? 'border-l-2 border-l-ando-cyan' : ''
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-base font-bold text-white lg:text-lg">{event.name}</h3>
          {isUpcoming && (
            <span className="rounded-full border border-ando-cyan/40 bg-ando-cyan/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-ando-cyan">
              Próxima
            </span>
          )}
        </div>
        <p className="mt-1 font-spaceGrotesk text-sm text-white/70">{event.location}</p>
      </div>
      <p
        className={`font-spaceGrotesk text-lg font-bold tabular-nums tracking-wider transition-colors duration-500 lg:text-xl ${
          isUpcoming ? 'text-ando-cyan' : 'text-white/75'
        }`}
      >
        {event.date}
      </p>
    </div>
  );
}

export default function Events({ imageSrc, list }: EventsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);

  // La página es estática: el HTML se genera en el build y puede servirse meses
  // después, así que "hoy" solo existe en el cliente. Calcularlo durante el render
  // daría un mismatch de hidratación apenas una fecha cruce al pasado. En el SSR
  // todas las filas salen como pasadas y las próximas se encienden al montar —
  // de ahí el `transition-colors` en EventRow.
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(startOfToday()), []);

  const sorted = useMemo(() => [...list].sort(compareByDate), [list]);

  const isUpcoming = (event: EventInfo) =>
    today !== null && toTime(event.date) >= today;

  if (sorted.length === 0) return null;

  const firstPage = sorted.slice(0, PAGE_SIZE);
  const rest = sorted.slice(PAGE_SIZE);

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    // Al plegar, si el usuario quedó por debajo del tope de la sección, colapsar
    // 20 filas lo dejaría flotando en el medio de la sección siguiente.
    if (!next) {
      const el = sectionRef.current;
      if (el && el.getBoundingClientRect().top < 0) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-ando-navy px-6 py-20 lg:px-10 lg:py-28"
    >
      <Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover grayscale" />
      <div className="absolute inset-0 bg-ando-navy/70" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-5xl"
      >
        <div className="mb-12 text-center">
          <h2 className="font-orbitron text-4xl font-bold text-white lg:text-5xl">
            Fechas
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-ando-cyan" />
        </div>

        <div className="space-y-4">
          {firstPage.map((event, index) => (
            <motion.div
              key={`${event.date}-${event.name}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <EventRow event={event} isUpcoming={isUpcoming(event)} />
            </motion.div>
          ))}

          {/* Las filas desplegadas montan dentro del viewport o por debajo: con
              `whileInView` + `once` el observer puede no disparar y dejarlas en
              opacity 0. Van con initial/animate directo. */}
          <AnimatePresence initial={false}>
            {expanded &&
              rest.map((event, index) => (
                <motion.div
                  key={`${event.date}-${event.name}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
                >
                  <EventRow event={event} isUpcoming={isUpcoming(event)} />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {rest.length > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={handleToggle}
              aria-expanded={expanded}
              className="text-[10px] uppercase tracking-[0.3em] text-ando-muted transition-colors hover:text-ando-cyan"
            >
              {expanded ? 'Ver menos' : `Ver todas (${sorted.length})`}
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
