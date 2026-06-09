"use client";

import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { typography } from "@/lib/typography";


export default function SeeMenuButton() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={rootRef}
      href="/menu"
      className={`${typography.button} group relative flex h-[96px] w-[96px] flex-col items-center justify-center font-semibold text-[#b3201d] no-underline transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b3201d]/60 sm:h-[120px] sm:w-[120px]`}
      aria-label={t("signatureFood.seeMenuAriaLabel")}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden
      >
        <image href="/placeholders/red_button.png" x="-7.5%" y="-7.5%" width="120%" height="115%" />
      </svg>

      <span className="absolute inset-0 z-1 flex items-center justify-center text-center">
        <span>{t("signatureFood.seeMenuLine")}</span>
      </span>
    </Link>
  );
}
