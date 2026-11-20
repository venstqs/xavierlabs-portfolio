import { useId } from 'react';

/**
 * The A×X monogram. Two slab strokes cross high: below the crossing they are
 * the legs of an A (with its crossbar), above it they are the arms of an X.
 * The falling stroke is cut where it passes under the rising one, and the
 * whole mark leans forward. Filled shapes only, single colour (currentColor).
 */
export function LogoMark({ size = 28, title }) {
  const mask = `axm-${useId().replace(/:/g, '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <mask id={mask}>
          <rect width="40" height="40" fill="#fff" />
          <polygon points="2.4,36 11.6,36 31.41,4 22.21,4" fill="#000" />
        </mask>
      </defs>
      <g transform="translate(6.33 0) skewX(-10)">
        <polygon points="30.0,36 36.0,36 16.19,4 10.19,4" fill="currentColor" mask={`url(#${mask})`} />
        <polygon points="4.0,36 10.0,36 29.81,4 23.81,4" fill="currentColor" />
        <rect x="12.076" y="25.8" width="15.848" height="4.0" fill="currentColor" />
      </g>
    </svg>
  );
}

/* Wordmark: XavierLabs in Geist, set tight. */
export function Logo({ size = 24 }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">XavierLabs</span>
    </span>
  );
}
