import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';

interface CinematicInteractiveAartiProps {
  onTriggerBurst: (x: number, y: number) => void;
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
}) => {
  const [flareActive, setFlareActive] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const lastActionTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use MotionValues to prevent React re-renders on every pointer move (Fixes the massive lag)
  const xOffset = useMotionValue(0);
  const yOffset = useMotionValue(0);
  const smoothX = useSpring(xOffset, { damping: 25, stiffness: 220 });
  const smoothY = useSpring(yOffset, { damping: 25, stiffness: 220 });

  useEffect(() => {
    const photoInterval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 3500);
    return () => clearInterval(photoInterval);
  }, []);

  const triggerAartiBurst = (clientX: number, clientY: number) => {
    const now = Date.now();
    if (now - lastActionTimeRef.current < 260) return;
    lastActionTimeRef.current = now;

    setFlareActive(true);
    setTimeout(() => setFlareActive(false), 800);

    onTriggerBurst(clientX, clientY);

    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsInteracting(true);
    triggerAartiBurst(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height * 0.72;
    const dx = Math.max(-90, Math.min(90, e.clientX - rect.left - centerX));
    const dy = Math.max(-50, Math.min(50, e.clientY - rect.top - centerY));
    
    // Direct DOM update via motion values, NO react state updates!
    xOffset.set(dx);
    yOffset.set(dy);

    const now = Date.now();
    if (now - lastActionTimeRef.current > 700) {
      triggerAartiBurst(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
    xOffset.set(0);
    yOffset.set(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        triggerAartiBurst(rect.width / 2, rect.height * 0.7);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full flex flex-col justify-between items-center p-6 bg-[#020102] text-[#f7e7ce] select-none overflow-hidden touch-none"
    >
      {/* Background Photos */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentPhotoIndex}
            src={PHOTOS[currentPhotoIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.8, scale: flareActive ? 1.02 : 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            alt="Ganpati Photo"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-transparent to-[#020102]/60 z-0" />

        <motion.div
          animate={{
            opacity: flareActive ? 0.6 : 0.2,
            scale: flareActive ? 1.1 : 1.0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/50 via-amber-600/10 to-transparent z-1"
        />
      </div>

      <div className="z-10 pt-10" />

      {/* Center Climax Inscription */}
      <div className="z-10 my-auto text-center px-4 pointer-events-none flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{
            opacity: 1,
            scale: flareActive ? 1.05 : 1,
            y: 0,
          }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400"
        >
          गणपति बप्पा मोरया ❤️
        </motion.h2>
        
        {/* Instruction in English to guide the user */}
        <motion.p
          animate={{ opacity: isInteracting ? 0 : [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-amber-200/80 text-sm tracking-widest uppercase font-semibold"
        >
          Tap & move to perform Aarti
        </motion.p>
      </div>

      {/* Foreground Diya */}
      <div className="z-20 w-full flex flex-col items-center pb-12">
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          animate={
            isInteracting
              ? undefined
              : {
                  x: [0, 26, 0, -26, 0],
                  y: [-14, 0, 16, 0, -14],
                  rotate: [0, 2, 0, -2, 0],
                }
          }
          transition={
            isInteracting
              ? undefined
              : {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className="relative cursor-grab active:cursor-grabbing"
        >
          <div className="relative w-44 sm:w-52 h-auto">
            <img
              src="/images/real_diya_foreground.png"
              alt="Real terracotta clay diya burning with sacred flame"
              className="w-full h-auto object-contain pointer-events-none select-none"
            />
            
            <motion.div
              animate={{
                scale: flareActive ? [1, 1.2, 1.1] : [1, 1.05, 0.95, 1.02, 1],
                opacity: flareActive ? [0.6, 0.9, 0.7] : [0.5, 0.7, 0.4, 0.6, 0.5],
              }}
              transition={{
                duration: flareActive ? 0.6 : 2.5,
                repeat: flareActive ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/60 via-orange-500/20 to-transparent pointer-events-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
