import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  { id: 'scene1_darkness', durationMs: 7000 },
  { id: 'scene2_reveal', durationMs: 8500 },
  { id: 'scene3_divine', durationMs: 8500 },
  { id: 'scene4_aarti', durationMs: 999999 }, // Wait for user to tap through all photos
  { id: 'scene5_signature', durationMs: 16000 },
];

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState<CinematicSceneId>('intro');
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [burstPos, setBurstPos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const holdTimeoutRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeSceneMeta = SCENES.find((s) => s.id === currentScene) || SCENES[0];

  // Start Experience with Middle Portion Devotional Music
  const handleStart = useCallback(() => {
    setHasStarted(true);
    setCurrentScene('scene1_darkness');
    setElapsedTimeMs(0);
    devotionalAudio.startMusic();
    setIsMuted(false);
  }, []);

  // Story Navigation
  const goToNextScene = useCallback(() => {
    const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
    if (currentIndex < SCENES.length - 1) {
      setCurrentScene(SCENES[currentIndex + 1].id);
      setElapsedTimeMs(0);
    }
  }, [currentScene]);

  const goToPrevScene = useCallback(() => {
    const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
    if (currentIndex > 0) {
      setCurrentScene(SCENES[currentIndex - 1].id);
      setElapsedTimeMs(0);
    } else {
      setElapsedTimeMs(0);
    }
  }, [currentScene]);

  const handleRestart = useCallback(() => {
    setCurrentScene('scene1_darkness');
    setElapsedTimeMs(0);
    setIsPaused(false);
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

  // Automatic Cinematic Progression Timer
  useEffect(() => {
    if (!hasStarted || isPaused || currentScene === 'intro') return;

    const tick = 50;
    const interval = setInterval(() => {
      setElapsedTimeMs((prev) => {
        const nextTime = prev + tick;
        if (activeSceneMeta && nextTime >= activeSceneMeta.durationMs) {
          const currentIndex = SCENES.findIndex((s) => s.id === currentScene);
          if (currentIndex < SCENES.length - 1) {
            setCurrentScene(SCENES[currentIndex + 1].id);
            return 0;
          }
          return activeSceneMeta.durationMs;
        }
        return nextTime;
      });
    }, tick);

    return () => clearInterval(interval);
  }, [hasStarted, isPaused, currentScene, activeSceneMeta]);

  // Touch and Hold (Pause) / Tap Left or Right (Rewind/Skip)
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    isHoldingRef.current = false;
    holdTimeoutRef.current = window.setTimeout(() => {
      isHoldingRef.current = true;
      setIsPaused(true);
    }, 250);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsPaused(false);
      return;
    }

    // In interactive aarti scene, preserve diya touch area
    const rect = e.currentTarget.getBoundingClientRect();
    if (currentScene === 'scene4_aarti' && e.clientY > rect.height * 0.5) {
      return;
    }

    const tapX = e.clientX - rect.left;
    const width = rect.width;

    if (tapX < width * 0.25) {
      goToPrevScene();
    } else if (tapX > width * 0.75) {
      goToNextScene();
    }
  };

  const handlePointerCancel = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setIsPaused(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#020102] text-[#f7e7ce] flex items-center justify-center overflow-hidden">
      {/* Background Ambient Glow for Wide Displays */}
      <div className="absolute inset-0 hidden sm:block pointer-events-none opacity-25">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-600/10 blur-[130px]" />
      </div>

      {/* Subtle Floating Petals & Light Motes */}
      <ParticleCanvas burstTrigger={burstTrigger} interactivePos={burstPos} />

      {/* 9:16 Mobile Viewport Frame */}
      <main
        id="cinematic-film-viewport"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative w-full max-w-[440px] h-full sm:h-[94dvh] sm:max-h-[900px] sm:rounded-3xl flex flex-col bg-black shadow-[0_0_100px_rgba(0,0,0,0.98)] sm:border sm:border-amber-500/15 overflow-hidden select-none"
      >
        {/* Single Minimal Floating Music Icon in Corner */}
        {hasStarted && currentScene !== 'intro' && (
          <button
            type="button"
            id="btn-minimal-audio-toggle"
            aria-label={isMuted ? 'ध्वनि चालू करें' : 'ध्वनि बंद करें'}
            onClick={handleToggleMute}
            className="absolute top-4 right-4 z-40 w-8 h-8 rounded-full bg-black/35 backdrop-blur-md border border-amber-400/20 text-amber-200/60 hover:text-amber-100 flex items-center justify-center active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}

        {/* Cinematic Film Scenes with Seamless Crossfade */}
        <div className="relative w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {!hasStarted || currentScene === 'intro' ? (
              <motion.div
                key="scene-intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CinematicIntro onStart={handleStart} />
              </motion.div>
            ) : currentScene === 'scene1_darkness' ? (
              <motion.div
                key="scene-darkness"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CinematicOpening elapsedTimeMs={elapsedTimeMs} />
              </motion.div>
            ) : currentScene === 'scene2_reveal' ? (
              <motion.div
                key="scene-reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CinematicGanpatiReveal elapsedTimeMs={elapsedTimeMs} />
              </motion.div>
            ) : currentScene === 'scene3_divine' ? (
              <motion.div
                key="scene-divine"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CinematicDivineMoment elapsedTimeMs={elapsedTimeMs} />
              </motion.div>
            ) : currentScene === 'scene4_aarti' ? (
              <motion.div
                key="scene-aarti"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CinematicInteractiveAarti onTriggerBurst={handleTriggerBurst} />
              </motion.div>
            ) : (
              <motion.div
                key="scene-signature"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <CinematicSignature
                  elapsedTimeMs={elapsedTimeMs}
                  onRestart={handleRestart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
