import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const { pathname, hash } = useLocation();
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Handle route and hash changes for scroll position
  useEffect(() => {
    if (!lenisInstance) return;

    if (hash) {
      const targetId = hash.replace('#', '');
      // Wait for PageTransition animation (800ms) before scrolling to hash target.
      // Use two attempts in case the element hasn't rendered yet on the first try.
      const scrollToHash = (delay: number) => {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            lenisInstance.scrollTo(element, { offset: -80, duration: 1.2 });
          }
        }, delay);
      };
      scrollToHash(500);
      scrollToHash(1200); // Retry for slow renders
    } else {
      // scroll to top immediately on route change without hash
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname, hash, lenisInstance]);
}
