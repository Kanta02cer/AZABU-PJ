declare module 'lenis' {
  export default class Lenis {
    constructor(options?: {
      duration?: number;
      easing?: (t: number) => number;
      orientation?: 'vertical' | 'horizontal';
      gestureOrientation?: 'vertical' | 'horizontal';
      smoothWheel?: boolean;
      wheelMultiplier?: number;
      smoothTouch?: boolean;
      touchMultiplier?: number;
      infinite?: boolean;
      syncTouch?: boolean;
      syncTouchMultiplier?: number;
      touchInertiaMultiplier?: number;
      lerp?: number;
      direction?: number;
    });

    on(event: string, callback: (...args: any[]) => void): void;
    raf(time: number): void;
    destroy(): void;
    scrollTo(
      target: string | HTMLElement | number,
      options?: {
        offset?: number;
        lerp?: number;
        duration?: number;
        easing?: (t: number) => number;
        immediate?: boolean;
        lock?: boolean;
        force?: boolean;
      }
    ): void;
    start(): void;
    stop(): void;
  }
}
