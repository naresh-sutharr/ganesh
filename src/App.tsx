import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { CinematicIntro } from './components/CinematicIntro';
import { CinematicOpening } from './components/CinematicOpening';
import { CinematicGanpatiReveal } from './components/CinematicGanpatiReveal';
import { CinematicDivineMoment } from './components/CinematicDivineMoment';
import { CinematicInteractiveAarti } from './components/CinematicInteractiveAarti';
import { CinematicSignature } from './components/CinematicSignature';
import { devotionalAudio } from './utils/audio';
import { CinematicSceneId, SceneMeta } from './types';

const SCENES: SceneMeta[] = [
  { id: 'scene1_darkness', durationMs: 2500 },
  { id: 'scene2_reveal', durationMs: 1500 },
  { id: 'scene3_divine', durationMs: 1500 },
  { id: 'scene4_aarti', durationMs: 999999 },
  { id: 'scene5_signature', durationMs: 16000 },
];

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState<CinematicSceneId>('intro');
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSceneMeta = SCENES.find((s) => s.id === currentScene) || SCENES[0];

  const handleStart = useCallback(() => {
    setHasStarted(true);
    setCurrentScene('scene1_darkness');
    setElapsedTimeMs(0);
    devotionalAudio.startMusic();
    setIsMuted(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentScene('scene1_darkness');
    setElapsedTimeMs(0);
    if (!devotionalAudio.getIsPlaying()) {
      devotionalAudio.startMusic();
      setIsMuted(false);
    }
  }, []);

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const active = devotionalAudio.toggleMute();
    setIsMuted(!active);
  }, []);

  const handleTriggerBurst = useCallback((x: number, y: number) => {
    setBurstPos({ x, y });
    setBurstTrigger((prev) => prev + 1);
  }, []);

  const handleFinishAarti = useCallback(() => {
    const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
    if (currentIndex < SCENES.length - 1) {
      setCurrentScene(SCENES[currentIndex + 1].id);
      setElapsedTimeMs(0);
    }
  }, [currentScene]);

  // Global Tap to Skip for early scenes
  const handleGlobalTap = useCallback(() => {
    if (currentScene !== 'intro' && currentScene !== 'scene4_aarti' && currentScene !== 'scene5_signature') {
      const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
      if (currentIndex < SCENES.length - 1) {
        setCurrentScene(SCENES[currentIndex + 1].id);
        setElapsedTimeMs(0);
      }
    }
  }, [currentScene]);

  // Automatic Cinematic Progression Timer
  useEffect(() => {
    if (!hasStarted || currentScene === 'intro') return;
    const tick = 50;
    const interval = setInterval(() => {
      setElapsedTimeMs((prev) => prev + tick);
    }, tick);
    return () => clearInterval(interval);
  }, [hasStarted, currentScene]);

  useEffect(() => {
    if (activeSceneMeta && elapsedTimeMs >= activeSceneMeta.durationMs) {
      const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
      if (currentIndex < SCENES.length - 1) {
        setCurrentScene(SCENES[currentIndex + 1].id);
        setElapsedTimeMs(0);
      }
    }
  }, [elapsedTimeMs, activeSceneMeta, currentScene]);

  return (
    <div
      className="relative w-full h-screen bg-[#020102] overflow-hidden select-none cursor-pointer"
      onPointerDown={handleGlobalTap}
    >
      {!isMobile && <ParticleCanvas burstTrigger={burstTrigger} interactivePos={burstPos} />}

      <AnimatePresence mode="wait">
        {currentScene === 'intro' && <CinematicIntro key="intro" onStart={handleStart} />}
        
        {currentScene === 'scene1_darkness' && (
          <motion.div
            key="s1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0"
          >
            <CinematicOpening elapsedTimeMs={elapsedTimeMs} />
          </motion.div>
        )}

        {currentScene === 'scene2_reveal' && (
          <motion.div
            key="s2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0"
          >
            <CinematicGanpatiReveal elapsedTimeMs={elapsedTimeMs} />
          </motion.div>
        )}

        {currentScene === 'scene3_divine' && (
          <motion.div
            key="s3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0"
          >
            <CinematicDivineMoment elapsedTimeMs={elapsedTimeMs} />
          </motion.div>
        )}

        {currentScene === 'scene4_aarti' && (
          <motion.div
            key="s4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0"
          >
            <CinematicInteractiveAarti 
              onTriggerBurst={handleTriggerBurst} 
              onFinishAarti={handleFinishAarti}
            />
          </motion.div>
        )}

        {currentScene === 'scene5_signature' && (
          <motion.div
            key="s5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <CinematicSignature onRestart={handleRestart} elapsedTimeMs={elapsedTimeMs} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Mute Button */}
      {hasStarted && currentScene !== 'intro' && (
        <button
          onClick={handleToggleMute}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-amber-500/20 text-amber-500/80 hover:bg-black/60 hover:text-amber-400 transition-all cursor-pointer"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
    </div>
  );
}
