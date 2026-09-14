import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  vRot: number;
  color: string;
  type: 'gold' | 'marigold' | 'rose';
  swayOffset: number;
  swaySpeed: number;
}

interface ParticleCanvasProps {
  burstTrigger?: number;
  interactivePos?: { x: number; y: number } | null;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ burstTrigger = 0, interactivePos }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const prevBurstRef = useRef<number>(burstTrigger);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize gentle background golden particles & petals
    const particleCount = window.innerWidth < 640 ? 15 : 35;
    const particles: Particle[] = [];

    const goldColors = ['#f5d77f', '#ffd700', '#d4af37', '#ffeaa7'];
    const marigoldColors = ['#ff9933', '#e65100', '#ffa726', '#ffb74d'];
    const roseColors = ['#c2185b', '#e91e63', '#ad1457'];

    for (let i = 0; i < particleCount; i++) {
      const isPetal = Math.random() < 0.28;
      const isRose = Math.random() < 0.35;
      const type = !isPetal ? 'gold' : isRose ? 'rose' : 'marigold';

      const color =
        type === 'gold'
          ? goldColors[Math.floor(Math.random() * goldColors.length)]
          : type === 'marigold'
          ? marigoldColors[Math.floor(Math.random() * marigoldColors.length)]
          : roseColors[Math.floor(Math.random() * roseColors.length)];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: type === 'gold' ? -(0.3 + Math.random() * 0.5) : 0.6 + Math.random() * 0.9,
        size: type === 'gold' ? 1.5 + Math.random() * 2.5 : 5 + Math.random() * 7,
        alpha: Math.random() * 0.7,
        maxAlpha: type === 'gold' ? 0.6 + Math.random() * 0.35 : 0.75 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        color,
        type,
        swayOffset: Math.random() * 100,
        swaySpeed: 0.015 + Math.random() * 0.02,
      });
    }

    particlesRef.current = particles;

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        p.rotation += p.vRot;
        p.swayOffset += p.swaySpeed;

        if (p.type === 'gold') {
          p.y += p.vy;
          p.x += Math.sin(p.swayOffset) * 0.35;

          // Twinkle
          p.alpha = (Math.sin(time * 2 + p.swayOffset) * 0.3 + 0.5) * p.maxAlpha;

          // Wrap around top
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        } else {
          // Petal falling down gently
          p.y += p.vy;
          p.x += Math.sin(p.swayOffset) * 0.8 + p.vx;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.type === 'gold') {
          // Golden sparkle with radial glow
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.35, p.color);
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Marigold / Rose petal curved shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.9, p.size * 0.7, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.7, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
          ctx.fill();

          // Petal vein highlight
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(0, p.size * 0.7);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Handle burst effects when user taps offering altar
  useEffect(() => {
    if (burstTrigger > prevBurstRef.current) {
      prevBurstRef.current = burstTrigger;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      const originX = interactivePos ? interactivePos.x : width / 2;
      const originY = interactivePos ? interactivePos.y : height * 0.55;

      const burstCount = 28;
      const burstColors = ['#ffd700', '#ff9933', '#e65100', '#f5d77f', '#e91e63'];

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 5.5;
        const isPetal = Math.random() < 0.45;

        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: isPetal ? 6 + Math.random() * 6 : 2 + Math.random() * 3,
          alpha: 1,
          maxAlpha: 1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.1,
          color: burstColors[Math.floor(Math.random() * burstColors.length)],
          type: isPetal ? 'marigold' : 'gold',
          swayOffset: Math.random() * 50,
          swaySpeed: 0.02,
        });
      }
    }
  }, [burstTrigger, interactivePos]);

  return (
    <canvas
      ref={canvasRef}
      id="particles-ambient-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-90"
    />
  );
};
