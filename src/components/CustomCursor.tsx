import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const ripple = rippleRef.current;
    if (!cursor || !cursorDot || !ripple) return;

    // Start invisible until first mouse move
    gsap.set([cursor, cursorDot, ripple], { autoAlpha: 0 });

    // GSAP quickTo — high-performance tracking
    const xTo   = gsap.quickTo(cursor,    'x', { duration: 0.15, ease: 'power3' });
    const yTo   = gsap.quickTo(cursor,    'y', { duration: 0.15, ease: 'power3' });
    const xDot  = gsap.quickTo(cursorDot, 'x', { duration: 0.05, ease: 'power3' });
    const yDot  = gsap.quickTo(cursorDot, 'y', { duration: 0.05, ease: 'power3' });

    let mouseX = 0, mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set([cursor, cursorDot], { autoAlpha: 1 });
      xTo(mouseX); yTo(mouseY);
      xDot(mouseX); yDot(mouseY);
    };

    // ── Hover: ring expands + tints, dot shrinks ──────────────────────────
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a') || t.closest('button') || t.closest('[data-cursor="hover"]')) {
        gsap.to(cursor, {
          scale: 1.6,
          borderColor: 'rgba(255,107,0,0.9)',
          backgroundColor: 'rgba(255,107,0,0.08)',
          duration: 0.35,
          ease: 'power2.out',
        });
        gsap.to(cursorDot, { scale: 0, duration: 0.2, ease: 'power2.out' });
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a') || t.closest('button') || t.closest('[data-cursor="hover"]')) {
        gsap.to(cursor, {
          scale: 1,
          borderColor: 'rgba(255,107,0,0.7)',
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(cursorDot, { scale: 1, duration: 0.25, ease: 'power2.out' });
      }
    };

    // ── Click: squish + ripple wave ────────────────────────────────────────
    const onDown = () => {
      // Ring: instant squish
      gsap.to(cursor, {
        scale: 0.65,
        borderColor: '#FF6B00',
        backgroundColor: 'rgba(255,107,0,0.2)',
        duration: 0.1,
        ease: 'power3.in',
      });
      // Dot: compress
      gsap.to(cursorDot, { scale: 0.4, duration: 0.1, ease: 'power3.in' });

      // Ripple: stamp at click position then fade-expand
      gsap.set(ripple, {
        x: mouseX,
        y: mouseY,
        scale: 0.2,
        autoAlpha: 0.7,
      });
      gsap.to(ripple, {
        scale: 3.5,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
      });
    };

    const onUp = () => {
      // Ring: elastic bounce back
      gsap.to(cursor, {
        scale: 1,
        borderColor: 'rgba(255,107,0,0.7)',
        backgroundColor: 'transparent',
        duration: 0.6,
        ease: 'elastic.out(1.3, 0.45)',
      });
      // Dot: elastic bounce back
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1.3, 0.45)',
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <style>{`
        body { cursor: none; }
        a, button, [role="button"], input, select, textarea { cursor: none !important; }
      `}</style>

      {/* Click ripple — expands outward from click point */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[999997] border border-[#FF6B00]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform, opacity' }}
      />

      {/* Outer ring — GSAP controls all transforms */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#FF6B00]/70 pointer-events-none z-[999998]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}
      />

      {/* Inner dot — snappier tracking */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF6B00] pointer-events-none z-[999999]"
        style={{ transform: 'translate(-50%, -50%)', willChange: 'transform' }}
      />
    </>
  );
}
