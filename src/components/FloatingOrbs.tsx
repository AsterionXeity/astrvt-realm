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
    const maxParticles = 50; // Balanced density that looks premium and performs well

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (initRandomY = false): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: initRandomY ? Math.random() * canvas.height : canvas.height + 10, // Spawn from bottom or randomly on init
        vx: (Math.random() - 0.5) * 0.15, // Slow horizontal drift
        vy: -0.1 - Math.random() * 0.3, // Slow upward drift
        radius: 0.6 + Math.random() * 1.8, // Various small particle sizes
        alpha: Math.random() * 0.4,
        fadeSpeed: 0.001 + Math.random() * 0.003,
        fadingIn: Math.random() > 0.5,
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
          if (p.alpha >= 0.6) {
            p.fadingIn = false;
          }
        } else {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0.02) {
            p.fadingIn = true;
          }
        }

        // Draw soft glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

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
