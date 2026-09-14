import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicGanpatiRevealProps {
  elapsedTimeMs: number;
}

const PHOTOS = [
  '/images/photo1.jpg',
  '/images/photo2.jpg',
];

export const CinematicGanpatiReveal: React.FC<CinematicGanpatiRevealProps> = ({
  elapsedTimeMs,
}) => {
  const showText = elapsedTimeMs > 1800;
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-6 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden">
      {/* 1. Background Photos Sliding */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={photoIndex}
            src={PHOTOS[photoIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            alt="Ganpati Photo"
            className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05]"
          />
        </AnimatePresence>

        {/* Natural Vignette and Dark Altar Ambiance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-transparent to-[#020102]/70 pointer-events-none" />
        
        {/* Warm Diya Light Bloom (Optimized without blur) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.4, 0.6, 0.45],
            scale: [0.8, 1.1, 1.0],
          }}
          transition={{
            duration: 7,
            ease: 'easeInOut',
          }}
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/40 via-amber-600/10 to-transparent pointer-events-none"
        />
      </div>

      {/* Top Margin */}
      <div className="z-10 pt-8" />

      {/* Small & Elegant Text: "गणपति बप्पा मोरया 🙏" */}
      <div className="z-10 flex flex-col items-center text-center px-4 pb-14 max-w-sm">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 15,
          }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl font-serif font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300"
        >
          गणपति बप्पा मोरया 🙏
        </motion.h2>
      </div>

      {/* Bottom Margin */}
      <div className="z-10 pb-4" />
    </div>
  );
};
