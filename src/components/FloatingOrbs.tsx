"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  fadeSpeed: number;
  fadingIn: boolean;
  type: 'orb' | 'star';
  rotation: number;
  rotationSpeed: number;
}

export const FloatingOrbs = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 65; // Slightly increased for a richer space feel

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (initRandomY = false): Particle => {
      const type = Math.random() > 0.65 ? 'star' : 'orb'; // 35% stars, 65% orbs
      const radius = type === 'star'
        ? 2.5 + Math.random() * 4.5 // Star sizes
        : 0.6 + Math.random() * 1.8; // Orb sizes

      return {
        x: Math.random() * canvas.width,
        y: initRandomY ? Math.random() * canvas.height : canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.05 - Math.random() * 0.2,
        radius,
        alpha: Math.random() * 0.5,
        fadeSpeed: 0.001 + Math.random() * 0.003,
        fadingIn: Math.random() > 0.5,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle(true));
      }
    };

    const updateAndDrawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply motion
        p.x += p.vx;
        p.y += p.vy;

        // Pulse opacity (fade in/out)
        if (p.fadingIn) {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 0.7) {
            p.fadingIn = false;
          }
        } else {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0.02) {
            p.fadingIn = true;
          }
        }

        // Draw particle based on its type
        if (p.type === 'star') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          ctx.beginPath();
          ctx.moveTo(0, -p.radius);
          ctx.quadraticCurveTo(0, 0, p.radius, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.radius);
          ctx.quadraticCurveTo(0, 0, -p.radius, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.radius);
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
          
          // Draw a small central core glow
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(p.alpha * 1.3, 1)})`;
          ctx.fill();
          
          ctx.restore();

          // Update rotation
          p.rotation += p.rotationSpeed;
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        }

        // Respawn if off-screen (top or side boundaries)
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(updateAndDrawParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    initParticles();
    updateAndDrawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -2,
        pointerEvents: "none",
      }}
    />
  );
};
