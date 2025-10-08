'use client';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, Brush, BookOpen, Mail, ShoppingBag, Upload, PlayCircle } from 'lucide-react';

const ctas = [
  {
    label: 'View Full Gallery',
    icon: Brush,
    colorVar: 'var(--color-primary)',
    hoverVar: 'var(--color-secondary)',
    action: () => { window.location.href = '/'; },
  },
  {
    label: 'Learn the Technique',
    icon: BookOpen,
    colorVar: 'var(--color-secondary)',
    hoverVar: 'var(--color-primary)',
    action: () => toast('Techniques will be added soon!'),
  },
  {
    label: 'Subscribe for Art Updates',
    icon: Mail,
    colorVar: 'var(--color-tertiary)',
    hoverVar: 'var(--color-secondary)',
    action: () => { window.location.href = 'mailto:micrart.shop@gmail.com'; },
  },
  {
    label: 'Shop / Buy Prints',
    icon: ShoppingBag,
    colorVar: 'var(--color-primary)',
    hoverVar: 'var(--color-secondary)',
    action: () => toast('Shop page will be added soon!'),
  },
  {
    label: 'Share Your Work',
    icon: Upload,
    colorVar: 'var(--color-secondary)',
    hoverVar: 'var(--color-primary)',
    action: () => { window.location.href = 'mailto:micrart.shop@gmail.com'; },
  },
  {
    label: 'Watch the Carving Process',
    icon: PlayCircle,
    colorVar: 'var(--color-tertiary)',
    hoverVar: 'var(--color-primary)',
    action: () => toast('Carving process videos will be added soon!'),
  },
];

export default function BlogEndCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full py-12 px-6 md:px-12 lg:px-20 rounded-t-[16px] overflow-hidden"
    >
      {/* Heading & Divider */}
      <div className="relative max-w-5xl mx-auto text-center mb-8">
        <h2
          className="text-3xl md:text-4xl font-serif text-[var(--color-on-surface)] mb-2"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
        >
          Continue the Journey
        </h2>
        <p
          className="text-[var(--color-on-background)] text-base md:text-lg font-sans"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Discover more ways to experience the art of pencil carving.
        </p>
        <div className="mt-6 h-[1px] w-24 bg-[var(--color-surface-variant)] mx-auto rounded-full" />
      </div>

      {/* CTA Buttons */}
      <motion.div
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {ctas.map((cta, i) => (
          <motion.button
            key={i}
            onClick={cta.action}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -2, scale: 1.02, boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.975, boxShadow: '0 3px 8px rgba(0,0,0,0.06)' }}
            className="flex items-center justify-between gap-3 px-5 py-3 rounded-[14px] shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            style={{
              backgroundColor: cta.colorVar,
              color: 'white',
              boxShadow: 'var(--shadow-soft)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = cta.hoverVar)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = cta.colorVar)}
          >
            <div className="flex items-center gap-3">
              <cta.icon className="w-5 h-5 text-white" />
              <span className="font-sans font-medium text-base md:text-base">{cta.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
}
