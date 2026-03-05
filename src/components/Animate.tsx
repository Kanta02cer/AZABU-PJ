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

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = { opacity: 0 };

    if (animation === 'slide-up') fromVars.y = 30;
    else if (animation === 'slide-in-right') fromVars.x = 30;
    else if (animation === 'slide-in-left') fromVars.x = -30;
    else if (animation === 'zoom') fromVars.scale = 0.95;

    const toVars: gsap.TweenVars = {
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
        once: true,   // ← 発火したらトリガーを破棄。絶対に逆再生しない
      },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, toVars);
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

export function StaggerChildren({
  children,
  interval = 100,
  className = '',
  threshold = 0.1
}: StaggerChildrenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const els = containerRef.current?.children;
    if (!els || els.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: interval / 1000,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${100 - threshold * 100}%`,
            once: true,   // ← 発火したらトリガーを破棄。絶対に逆再生しない
          },
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
