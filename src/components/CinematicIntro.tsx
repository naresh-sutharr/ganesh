import React from 'react';
import { motion } from 'motion/react';

interface CinematicIntroProps {
  onStart: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onStart }) => {
  return (
    <div
      onClick={onStart}
      className="relative w-full h-full flex flex-col justify-between items-center p-8 bg-[#020102] text-[#f7e7ce] cursor-pointer select-none overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cinematic_diya_dark.jpg"
          alt="Sacred Diya in Darkness"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/60 to-[#020102]/80 pointer-events-none" />
      </div>

      {/* Top Auspicious Note */}
      <div className="z-10 pt-12 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.8 }}
          className="text-xs tracking-[0.4em] text-amber-200/80 uppercase font-serif"
        >
          ॐ गं गणपतये नमः
        </motion.p>
      </div>

      {/* Center Title */}
      <div className="z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs tracking-[0.3em] text-amber-200/60 uppercase mb-2 font-serif">
            श्री गणेशोत्सव
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_20px_rgba(245,158,11,0.4)]">
            गणेश चतुर्थी 2026
          </h1>
        </motion.div>
      </div>

      {/* Bottom Tap Trigger */}
      <div className="z-10 pb-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        >
          <span className="text-sm font-serif tracking-widest text-amber-100 font-medium">
            दर्शन आरंभ करें • Tap to Begin ✨
          </span>
        </motion.div>
      </div>
    </div>
  );
};
