"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  translateY?: string;
  delay?: number;
  duration?: number;
  fillWidth?: boolean;
  triggerOnce?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  translateY = "16px",
  delay = 0,
  duration = 0.6,
  fillWidth = false,
  triggerOnce = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else {
          if (!triggerOnce) {
            // Reset when the element goes fully out of screen
            setIsVisible(false);
          }
        }
      },
      {
        threshold: 0, // Trigger as soon as even 1px is in/out of screen
        rootMargin: "0px 0px -10px 0px", // Trigger slightly before entering to feel smoother
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [triggerOnce]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${translateY})`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
        width: fillWidth ? "100%" : "auto",
      }}
    >
      {children}
    </div>
  );
};
