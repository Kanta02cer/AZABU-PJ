import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Track if device is touch based
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Basic touch detection
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Use GSAP quickTo for high performance cursor tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
    
    const xDotTo = gsap.quickTo(cursorDot, "x", { duration: 0.05, ease: "power3" });
    const yDotTo = gsap.quickTo(cursorDot, "y", { duration: 0.05, ease: "power3" });

    // Handle mouse movement
    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
    };

    // Handle hover states on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we are hovering over an interactive element or if it has the data-cursor target
      if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[data-cursor="hover"]')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Don't render cursor on mobile/touch devices
  if (isTouchDevice) return null;

  return (
    <>
      <style>{`
        /* Hide default cursor globally */
        body {
          cursor: none;
        }
        /* Ensure interactive elements also hide default cursor */
        a, button, [role="button"], input, select, textarea {
          cursor: none !important;
        }
      `}</style>
      
      {/* Outer Ring */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 border border-[#FF6B00]/70 rounded-full pointer-events-none z-[999999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-300 ease-out`}
        style={{
          transformOrigin: 'center center',
          scale: isClicking ? 0.8 : (isHovering ? 1.5 : 1),
          backgroundColor: isHovering ? 'rgba(255,107,0, 0.1)' : 'transparent',
        }}
      />
      
      {/* Inner Dot */}
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#FF6B00] rounded-full pointer-events-none z-[999999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-200"
        style={{
          scale: isHovering ? 0 : 1
        }}
      />
    </>
  );
}
