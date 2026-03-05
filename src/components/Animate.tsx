import React, { ReactNode, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animation type. Default is 'slide-up' */
  animation?: 'slide-up' | 'fade' | 'zoom' | 'slide-in-right' | 'slide-in-left';
  threshold?: number;
}

/**
 * A reusable wrapper for GSAP scroll-triggered entrance animations.
 */
export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0, 
  animation = 'slide-up',
  threshold = 0.1
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = containerRef.current;
      if (!el) return;

      let fromVars: gsap.TweenVars = { opacity: 0 };
      let toVars: gsap.TweenVars = { opacity: 1 };

      switch (animation) {
        case 'zoom':
          fromVars.scale = 0.9;
          toVars.scale = 1;
          break;
        case 'slide-in-right':
          fromVars.x = 50;
          toVars.x = 0;
          break;
        case 'slide-in-left':
          fromVars.x = -50;
          toVars.x = 0;
          break;
        case 'fade':
          // Just opacity
          break;
        default: // slide-up
          fromVars.y = 50;
          toVars.y = 0;
          break;
      }

      gsap.fromTo(el, 
        fromVars, 
        {
          ...toVars,
          duration: 1.2,
          ease: "power3.out",
          delay: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start: `top ${100 - (threshold * 100)}%`, // Trigger earlier depending on threshold
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animation, delay, threshold]);

  return (
    <div ref={containerRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  interval?: number;
  className?: string;
  threshold?: number;
}

/**
 * A wrapper to stagger the entrance animations of its children using GSAP.
 */
export function StaggerChildren({ 
  children, 
  interval = 100, 
  className = '',
  threshold = 0.1 
}: StaggerChildrenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const childrenElements = containerRef.current?.children;
      if (!childrenElements || childrenElements.length === 0) return;

      gsap.fromTo(childrenElements, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: interval / 1000,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${100 - (threshold * 100)}%`,
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [interval, threshold, children]);

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, i) => (
        <div key={i} style={{ opacity: 0 }}>
          {child}
        </div>
      ))}
    </div>
  );
}
