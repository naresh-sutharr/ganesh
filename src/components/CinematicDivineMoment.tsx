import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicDivineMomentProps {
  elapsedTimeMs: number;
}

const PHOTOS = [
  '/images/photo7.jpg',
  '/images/photo6.jpg',
  '/images/photo5.jpg',
  '/images/photo4.jpg',
  '/images/photo3.jpg',
  '/images/photo2.jpg',
  '/images/photo1.jpg'
];

export const CinematicDivineMoment: React.FC<CinematicDivineMomentProps> = ({
  elapsedTimeMs,
}) => {
  const showText = elapsedTimeMs > 1500;
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
            animate={{ opacity: 0.9, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            alt="Ganpati Photo"
            className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.05]"
          />
        </AnimatePresence>

        {/* Natural Vignette & Atmospheric Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/20 to-[#020102]/70 pointer-events-none" />
        
        {/* Ambient Divine Radiance (Optimized) */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-amber-600/5 to-transparent pointer-events-none" />
      </div>

      {/* Top Margin */}
      <div className="z-10 pt-8" />

      {/* Text directly on background (No cards, no boxes) */}
      <div className="z-10 flex flex-col items-center text-center px-6 pb-16 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 15,
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <p className="text-xl sm:text-2xl font-serif text-amber-100 font-semibold leading-relaxed">
            बप्पा आपके जीवन में
          </p>
          <p className="mt-1 text-base sm:text-lg font-serif text-amber-200/90 font-light tracking-wide">
            सुख, शांति और समृद्धि लाएं।
          </p>
        </motion.div>
      </div>

      {/* Bottom Margin */}
      <div className="z-10 pb-4" />
    </div>
  );
};
