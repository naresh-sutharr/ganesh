import React from 'react';
import { motion } from 'motion/react';

interface CinematicGanpatiRevealProps {
  elapsedTimeMs: number;
}

export const CinematicGanpatiReveal: React.FC<CinematicGanpatiRevealProps> = ({
  elapsedTimeMs,
}) => {
  const showText = elapsedTimeMs > 1800;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-6 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden">
      {/* 1. Single Realistic Ganpati Idol — Starts Dark & Gradually Illuminates */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{
            scale: 1.18,
            filter: 'blur(8px) brightness(0.35)',
          }}
          animate={{
            scale: [1.18, 1.1, 1.04],
            filter: [
              'blur(8px) brightness(0.35)',
              'blur(4px) brightness(0.7)',
              'blur(0px) brightness(1.02)',
            ],
          }}
          transition={{
            duration: 8.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/images/ganpati_real.jpg"
            alt="Consecrated realistic Ganesh Chaturthi idol"
            className="w-full h-full object-cover object-center filter contrast-[1.08] saturate-[1.05]"
          />

          {/* Natural Vignette and Dark Altar Ambiance */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-transparent to-[#020102]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#020102]/20 to-[#020102]/85 pointer-events-none" />
        </motion.div>

        {/* Warm Diya Light Bloom spreading over Bappa */}
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
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-amber-500/25 blur-3xl pointer-events-none"
        />

        {/* Rising Incense Smoke Haze */}
        <motion.div
          animate={{
            y: [-10, -35, -10],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-48 h-56 bg-gradient-to-t from-amber-300/10 via-amber-100/5 to-transparent blur-2xl pointer-events-none"
        />
      </div>

      {/* Top Margin */}
      <div className="z-10 pt-8" />

      {/* Small & Elegant Text: "गणपति बप्पा मोरया 🙏" */}
      <div className="z-10 flex flex-col items-center text-center px-4 pb-14 max-w-sm">
        <motion.h2
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{
            opacity: showText ? 1 : 0,
            y: showText ? 0 : 15,
            filter: showText ? 'blur(0px)' : 'blur(6px)',
          }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl font-serif font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 drop-shadow-[0_2px_15px_rgba(245,158,11,0.6)]"
        >
          गणपति बप्पा मोरया 🙏
        </motion.h2>
      </div>

      {/* Bottom Margin */}
      <div className="z-10 pb-4" />
    </div>
  );
};
