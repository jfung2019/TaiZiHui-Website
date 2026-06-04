/** Subtle seal-inspired fretwork ring — decorative only */
export default function SealGeometry() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[52%] z-[2] h-[min(42vw,320px)] w-[min(42vw,320px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.22]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
        <circle cx="100" cy="100" r="92" stroke="#b8864a" strokeWidth="0.6" opacity="0.7" />
        <circle cx="100" cy="100" r="78" stroke="#c9a227" strokeWidth="0.4" opacity="0.5" />
        <path
          d="M100 12 L108 28 L126 24 L118 40 L134 48 L118 56 L126 72 L108 68 L100 84 L92 68 L74 72 L82 56 L66 48 L82 40 L74 24 L92 28 Z"
          stroke="#b8864a"
          strokeWidth="0.35"
          opacity="0.45"
          transform="rotate(0 100 100)"
        />
        <path
          d="M100 20 L104 32 L116 30 L112 42 L124 48 L112 54 L116 66 L104 64 L100 76 L96 64 L84 66 L88 54 L76 48 L88 42 L84 30 L96 32 Z"
          stroke="#d4af6a"
          strokeWidth="0.25"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
