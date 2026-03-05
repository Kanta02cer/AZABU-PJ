import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect will show a warning if used during SSR.
 * To get around it, we can conditionally use useEffect on the server (which is a no-op)
 * and useLayoutEffect in the browser.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
