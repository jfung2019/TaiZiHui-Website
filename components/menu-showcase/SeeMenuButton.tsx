"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { typography } from "@/lib/typography";

/** Logo / nav brush red */
const BRAND_RED = "#b3201d";

/** Hand-drawn circular strokes — imperfect closed paths, not geometric ellipses */
const SKETCH_STROKES = [
  {
    d: "M 58.5 13.2 C 38 10.5, 13.5 30, 12.8 56.5 C 12 82, 32.5 107.5, 59 109.8 C 85.5 112, 109.5 93.5, 110.2 64.5 C 111 35.5, 86 15.5, 58.5 13.2 Z",
    strokeWidth: 1.15,
    opacity: 1
  },
  {
    d: "M 62.8 14.5 C 94 17, 114 40, 112.5 63.5 C 111 89, 92 108.5, 62.5 107.8 C 33 107, 14.5 88, 16.2 59.5 C 18 31, 40 14.8, 62.8 14.5 Z",
    strokeWidth: 1,
    opacity: 0.88
  },
  {
    d: "M 60.2 15.8 C 35.5 13.2, 11.5 37, 13.8 61.2 C 16 85.5, 36.5 106.2, 60.5 107.2 C 84.5 108.2, 107 86.5, 105.5 59.8 C 104 33.5, 82.5 16.5, 60.2 15.8 Z",
    strokeWidth: 0.9,
    opacity: 0.78
  }
] as const;

export default function SeeMenuButton() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLAnchorElement>(null);
  const strokeGroupsRef = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const groups = strokeGroupsRef.current.filter(Boolean) as SVGGElement[];
    if (!groups.length) {
      return;
    }

    const ctx = gsap.context(() => {
      groups.forEach((group, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const duration = 22 + index * 6;

        gsap.to(group, {
          rotation: direction * 360,
          duration,
          ease: "none",
          repeat: -1,
          svgOrigin: "60 60"
        });

        gsap.to(group, {
          x: (index - 1) * 0.4,
          y: (index - 1) * 0.28,
          duration: 2.2 + index * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Link
      ref={rootRef}
      href="/menu"
      className={`${typography.button} group relative flex h-[96px] w-[96px] flex-col items-center justify-center font-semibold text-[#b3201d] no-underline transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3201d]/60 sm:h-[120px] sm:w-[120px]`}
      aria-label={t("menuShowcase.seeMenuAriaLabel")}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden
      >
        {SKETCH_STROKES.map((stroke, index) => (
          <g
            key={index}
            ref={(node) => {
              strokeGroupsRef.current[index] = node;
            }}
          >
            <path
              d={stroke.d}
              fill="none"
              stroke={BRAND_RED}
              strokeWidth={stroke.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity={stroke.opacity}
            />
          </g>
        ))}
      </svg>

      <span className="relative z-1 flex flex-col items-center leading-[1.15] tracking-[0.14em]">
        <span>{t("menuShowcase.seeMenuLine")}</span>
      </span>
    </Link>
  );
}
