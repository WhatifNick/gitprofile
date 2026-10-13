import { useEffect, useState } from 'react';

const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/** True on devices with a real mouse; decides popover vs tap-to-expand. */
export const useCanHover = () => {
  const [canHover, setCanHover] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia(HOVER_QUERY).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY);
    const update = () => setCanHover(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return canHover;
};
