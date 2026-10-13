import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a flag that flips to true the first time the element is
 * at least 25% on screen. Starts true (no animation) when `enabled` is false,
 * the browser lacks IntersectionObserver, or the user prefers reduced motion.
 */
export const useRevealOnScroll = <T extends Element>(enabled = true) => {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(
    () =>
      !enabled ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (revealed || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [revealed]);

  return [ref, revealed] as const;
};
