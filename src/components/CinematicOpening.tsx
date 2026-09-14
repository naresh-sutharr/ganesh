import React from 'react';
import { motion } from 'motion/react';

interface CinematicOpeningProps {
  elapsedTimeMs: number;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ elapsedTimeMs }) => {
  const showText = elapsedTimeMs > 1200;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-8 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden">
      {/* 1. Darkness with Subtle Diya Flame Emerging */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 6.5, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <img
            src="/images/cinematic_diya_dark.jpg"
            alt="Real sacred clay diya burning in darkness"
            className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.12]"
          />

          {/* Deep cinematic darkness falloff */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-transparent to-[#020102]/85 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020102]/80 via-transparent to-[#020102]/80 pointer-events-none" />
        </motion.div>

        {/* Subtle breathing warm diya glow */}
        <motion.div
          animate={{
            opacity: [0.35, 0.65, 0.4, 0.7, 0.35],
            scale: [0.96, 1.04, 0.98, 1.03, 0.96],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
        />
      </div>

      {/* Top Space */}
      <div className="z-10 pt-10" />

      {/* Minimal Sacred Text: "श्री गणेशाय नमः" */}
      <div className="z-10 flex flex-col items-center text-center px-4 mb-24 max-w-sm">
        <motion.h2
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 15,
            filter: showText ? 'blur(0px)' : 'blur(8px)',
          }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_20px_rgba(245,158,11,0.5)]"
        >
          श्री गणेशाय नमः
        </motion.h2>
      </div>

      {/* Bottom Space */}
      <div className="z-10 pb-6" />
    </div>
  );
};
