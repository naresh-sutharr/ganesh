import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

interface CinematicSignatureProps {
  elapsedTimeMs: number;
  onRestart: () => void;
}

export const CinematicSignature: React.FC<CinematicSignatureProps> = ({
  elapsedTimeMs,
  onRestart,
}) => {
  const showGreeting = elapsedTimeMs > 1000;
  const showSignature = elapsedTimeMs > 2800;
  const showReplay = elapsedTimeMs > 4800;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-8 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden">
      {/* 1. Realistic Ganpati in Serene Warm Twilight */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 16, ease: 'easeOut' }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/images/ganpati_real.jpg"
            alt="Real consecrated Ganpati idol in divine serenity"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
          />

          {/* Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/65 to-[#020102]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#020102]/30 to-[#020102]/90 pointer-events-none" />
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Top Space */}
      <div className="z-10 pt-12" />

      {/* Center Devotional Greeting & Developer Signature */}
      <div className="z-10 my-auto flex flex-col items-center text-center px-4 max-w-sm">
        <motion.h2
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{
            opacity: showGreeting ? 1 : 0,
            y: showGreeting ? 0 : 15,
            filter: showGreeting ? 'blur(0px)' : 'blur(6px)',
          }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_20px_rgba(245,158,11,0.5)]"
        >
          शुभ गणेश चतुर्थी
        </motion.h2>

        {/* Minimal Developer Signature */}
        <div className="mt-8 w-full flex flex-col items-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: showSignature ? 1 : 0,
              opacity: showSignature ? 1 : 0,
            }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="w-36 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-3"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: showSignature ? 1 : 0,
              y: showSignature ? 0 : 10,
            }}
            transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-amber-200/60 font-light">
              Crafted with Code & Devotion
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 font-semibold drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">
              Naresh Suthar
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Replay Action */}
      <div className="z-20 pb-10 flex items-center justify-center">
        <motion.button
          type="button"
          id="btn-cinematic-replay"
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: showReplay ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 border border-amber-400/25 text-amber-200/90 text-xs font-medium tracking-wide backdrop-blur-md transition-all shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
        >
          <RotateCcw size={12} className="text-amber-300" />
          <span>पुनः दर्शन • Replay</span>
        </motion.button>
      </div>
    </div>
  );
};
