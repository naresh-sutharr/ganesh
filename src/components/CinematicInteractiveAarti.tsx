import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicInteractiveAartiProps {
  onTriggerBurst: (x: number, y: number) => void;
  onFinishAarti?: () => void;
}

const PHOTOS = [
  '/images/photo1.jpg',
  '/images/photo2.jpg',
  '/images/photo3.jpg',
  '/images/photo4.jpg',
  '/images/photo5.jpg',
  '/images/photo6.jpg',
  '/images/photo7.jpg'
];

export const CinematicInteractiveAarti: React.FC<CinematicInteractiveAartiProps> = ({
  onTriggerBurst,
  onFinishAarti,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleScreenTap = (e: React.PointerEvent) => {
    // Trigger particle burst
    onTriggerBurst(e.clientX, e.clientY);

    // If we are at the last photo, end the scene
    if (currentPhotoIndex >= PHOTOS.length - 1) {
      if (onFinishAarti) {
        onFinishAarti();
      }
    } else {
      // Otherwise, change to next photo
      setCurrentPhotoIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      onPointerDown={handleScreenTap}
      className="relative w-full h-full flex flex-col justify-between items-center p-6 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden touch-none cursor-pointer"
    >
      {/* Background Photos */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentPhotoIndex}
            src={PHOTOS[currentPhotoIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.8, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            alt="Ganpati Photo"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/20 to-[#020102]/80 z-0" />
      </div>

      <div className="z-10 pt-10" />

      {/* Center Climax Inscription with high contrast */}
      <div className="z-10 my-auto text-center px-4 pointer-events-none flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-serif font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] tracking-wide"
        >
          गणपति बप्पा मोरया ❤️
        </motion.h2>
      </div>

      {/* Instruction in English - Positioned at the very bottom */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <p className="text-white text-sm sm:text-base tracking-widest uppercase font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/50 px-6 py-2 rounded-full border border-white/20">
          Tap to change photo
        </p>
      </motion.div>

      {/* Foreground Aarti Thali Auto-Animating */}
      <div className="z-20 w-full flex flex-col items-center pb-24 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, 0, -40, 0],
            y: [-20, 0, 25, 0, -20],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className="relative w-56 sm:w-64 h-auto drop-shadow-2xl">
            <img
              src="/images/real_diya_foreground.png"
              alt="Real Aarti Thali"
              className="w-full h-auto object-contain select-none"
            />
            
            {/* Simple flame glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 0.95, 1.1, 1],
                opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/60 via-orange-500/20 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
