"use client";

import { useEffect, useRef } from "react";

export const InteractiveMesh = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      
      // Update mouse position CSS variables for radial gradient mask
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);

      // Parallax effect: shift by up to 15px based on cursor offset from window center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      containerRef.current.style.setProperty("--tx", `${-deltaX * 15}px`);
      containerRef.current.style.setProperty("--ty", `${-deltaY * 15}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="home-mesh-bg-container">
      <div className="home-mesh-bg-inner" />
    </div>
  );
};
