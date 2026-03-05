import React, { ReactNode, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'slide-up' | 'fade' | 'zoom' | 'slide-in-right' | 'slide-in-left';
  threshold?: number;
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  animation = 'slide-up',
  threshold = 0.1
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Prevent re-triggering on parent re-renders
  const hasPlayed = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || hasPlayed.current) return;

    const fromVars: gsap.TweenVars = { opacity: 0 };
    if (animation === 'slide-up')         fromVars.y = 30;
    else if (animation === 'slide-in-right') fromVars.x = 30;
    else if (animation === 'slide-in-left')  fromVars.x = -30;
    else if (animation === 'zoom')           fromVars.scale = 0.95;

    // Set initial state via GSAP (not inline style), so React re-renders don't reset it
    gsap.set(el, { ...fromVars });

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power2.out',
        delay: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start: `top ${100 - threshold * 100}%`,
          once: true,               // destroyed after firing — can NEVER replay
          onEnter: () => { hasPlayed.current = true; },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps — intentionally run once on mount only

  return (
    <div ref={containerRef} className={className}>
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

export function StaggerChildren({
  children,
  interval = 100,
  className = '',
  threshold = 0.1
}: StaggerChildrenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const els = container?.children;
    if (!els || els.length === 0 || hasPlayed.current) return;

    // Set initial state via GSAP
    gsap.set(els, { opacity: 0, y: 20 });

    const ctx = gsap.context(() => {
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: interval / 1000,
        scrollTrigger: {
          trigger: container,
          start: `top ${100 - threshold * 100}%`,
          once: true,               // destroyed after firing — can NEVER replay
          onEnter: () => { hasPlayed.current = true; },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps — intentionally run once on mount only

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
