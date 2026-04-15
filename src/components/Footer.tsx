'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';

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

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ando-navy px-6 py-10 lg:px-10 lg:py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        <div className="flex items-center gap-8">
          <MagneticLink href="https://instagram.com/lisan_andia">
            <FaInstagram className="text-base" />
            lisan_andia
          </MagneticLink>
          <MagneticLink href="https://instagram.com/coloandia">
            <FaInstagram className="text-base" />
            coloandia
          </MagneticLink>
        </div>

        <p className="text-4xl font-bold text-white lg:text-5xl">ANDO</p>

        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          © {new Date().getFullYear()} Ando-Ku Project. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
