'use client';

import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ando-navy px-6 py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/lisan_andia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-ando-cyan"
          >
            <FaInstagram className="text-base" />
            lisan_andia
          </a>
          <a
            href="https://instagram.com/coloandia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-ando-cyan"
          >
            <FaInstagram className="text-base" />
            coloandia
          </a>
        </div>

        <p className="text-4xl font-bold text-white lg:text-5xl">
          ANDO
        </p>

        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          © {new Date().getFullYear()} Ando-Ku Project. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}