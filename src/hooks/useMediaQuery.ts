import { useEffect, useState } from 'react';

/**
 * Reactively tracks a CSS media query in JavaScript.
 *
 * The landscape layout is mostly CSS, but the focus-mode overlay is a real
 * component that has to mount/unmount, so the same condition needs to be
 * observable from React.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);

    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on a phone held sideways — the same condition the landscape CSS uses. */
export const LANDSCAPE_PHONE_QUERY = '(orientation: landscape) and (max-height: 620px)';
