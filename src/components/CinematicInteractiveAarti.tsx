import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { devotionalAudio } from '../utils/audio';

interface CinematicInteractiveAartiProps {
  onTriggerBurst: (x: number, y: number) => void;
}

export const CinematicInteractiveAarti: React.FC<CinematicInteractiveAartiProps> = ({
  onTriggerBurst,
}) => {
  const [flareActive, setFlareActive] = useState(false);
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const lastActionTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerAartiBurst = (clientX: number, clientY: number) => {
    const now = Date.now();
    if (now - lastActionTimeRef.current < 260) return;
    lastActionTimeRef.current = now;

    setFlareActive(true);
    setTimeout(() => setFlareActive(false), 800);

    devotionalAudio.playTempleBell();
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
    setTouchOffset({ x: dx, y: dy });

    const now = Date.now();
    if (now - lastActionTimeRef.current > 700) {
      triggerAartiBurst(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
    setTouchOffset({ x: 0, y: 0 });
  };

  // Initial bell chime as Aarti begins
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
      {/* 1. Background: Real Consecrated Ganpati Idol */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: flareActive ? 1.04 : 1.02,
            filter: flareActive
              ? 'brightness(1.1) contrast(1.08)'
              : 'brightness(0.96) contrast(1.04)',
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/images/ganpati_real.jpg"
            alt="Real consecrated Ganpati idol in divine golden illumination"
            className="w-full h-full object-cover object-center"
          />

          {/* Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/20 to-[#020102]/70" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#020102]/25 to-[#020102]/85" />
        </motion.div>

        {/* Dynamic Light Flare from Diya onto Ganpati's face */}
        <motion.div
          animate={{
            opacity: flareActive ? 0.75 : 0.35,
            scale: flareActive ? 1.25 : 1.0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-r from-amber-400/25 via-yellow-400/35 to-amber-500/25 blur-3xl"
        />

        {/* Incense Smoke */}
        <motion.div
          animate={{
            y: [-15, -45, -15],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-44 h-52 bg-gradient-to-t from-amber-200/10 via-amber-100/5 to-transparent blur-2xl"
        />
      </div>

      {/* Top Space */}
      <div className="z-10 pt-10" />

      {/* Center Climax Inscription: "गणपति बप्पा मोरया ❤️" */}
      <div className="z-10 my-auto text-center px-4 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{
            opacity: 1,
            scale: flareActive ? 1.05 : 1,
            y: 0,
          }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_30px_rgba(245,158,11,0.7)]"
        >
          गणपति बप्पा मोरया ❤️
        </motion.h2>
      </div>

      {/* 2. Foreground: Real Clay Diya with Real Flame Performing Aarti Circles */}
      <div className="z-20 w-full flex flex-col items-center pb-12">
        <motion.div
          animate={
            isInteracting
              ? { x: touchOffset.x, y: touchOffset.y }
              : {
                  x: [0, 26, 0, -26, 0],
                  y: [-14, 0, 16, 0, -14],
                  rotate: [0, 2, 0, -2, 0],
                }
          }
          transition={
            isInteracting
              ? { type: 'spring', damping: 25, stiffness: 220 }
              : {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className="relative cursor-grab active:cursor-grabbing"
        >
          {/* Real Clay Diya Image Cutout with Natural Flame */}
          <div className="relative w-44 sm:w-52 h-auto filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]">
            <img
              src="/images/real_diya_foreground.png"
              alt="Real terracotta clay diya burning with sacred flame"
              className="w-full h-auto object-contain pointer-events-none select-none filter brightness-[1.05] contrast-[1.12]"
            />

            {/* Glowing Flame Flare Pulse */}
            <motion.div
              animate={{
                scale: flareActive ? [1, 1.35, 1.1] : [1, 1.06, 0.97, 1.04, 1],
                opacity: flareActive ? [0.6, 0.95, 0.7] : [0.45, 0.7, 0.5, 0.75, 0.45],
              }}
              transition={{
                duration: flareActive ? 0.6 : 2.5,
                repeat: flareActive ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-r from-amber-400/35 via-yellow-300/45 to-orange-500/35 blur-xl pointer-events-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
