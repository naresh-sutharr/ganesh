import React from 'react';
import { motion } from 'motion/react';

interface CinematicDivineMomentProps {
  elapsedTimeMs: number;
}

export const CinematicDivineMoment: React.FC<CinematicDivineMomentProps> = ({
  elapsedTimeMs,
}) => {
  const showText = elapsedTimeMs > 1500;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-6 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden">
      {/* 1. Full-Screen Realistic Ganpati with Gentle Cinematic Movement */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.04 }}
          animate={{ scale: 1.11 }}
          transition={{ duration: 12, ease: 'easeOut' }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/images/ganpati_closeup.jpg"
            alt="Real consecrated Ganpati idol in divine contemplation"
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.06]"
          />

          {/* Natural Vignette & Atmospheric Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/20 to-[#020102]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#020102]/25 to-[#020102]/80 pointer-events-none" />
        </motion.div>

        {/* Ambient Divine Radiance */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Top Margin */}
      <div className="z-10 pt-8" />

      {/* Text directly on background (No cards, no boxes) */}
      <div className="z-10 flex flex-col items-center text-center px-6 pb-16 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 15,
            filter: showText ? 'blur(0px)' : 'blur(6px)',
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <p className="text-xl sm:text-2xl font-serif text-amber-100 font-semibold leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            बप्पा आपके जीवन में
          </p>
          <p className="mt-1 text-base sm:text-lg font-serif text-amber-200/90 font-light tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            सुख, शांति और समृद्धि लाएं।
          </p>
        </motion.div>
      </div>

      {/* Bottom Margin */}
      <div className="z-10 pb-4" />
    </div>
  );
};
