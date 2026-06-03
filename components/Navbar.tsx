"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LanguageToggle from "@/components/LanguageToggle";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SCROLL_END = 180;

const navigationKeys = [
  "nav.ourStory",
  "nav.menu",
  "nav.privateEvents",
  "nav.reservations"
] as const;

export default function Navbar() {
  const { t } = useTranslation();
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    const heroSection = document.querySelector("[data-hero-section]");

    if (!logo || !heroSection) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logo,
        { scale: 1.45, transformOrigin: "top left" },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: `+=${LOGO_SCROLL_END}`,
            scrub: 0.4
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white">
      <div ref={logoRef} className="pointer-events-auto absolute left-2 top-2 will-change-transform sm:left-4 sm:top-4">
        <Image
          src="/logo/tzh_logo_vertical.png"
          alt={t("hero.logoAlt")}
          width={172}
          height={218}
          className="h-auto w-[88px] object-contain sm:w-[120px] lg:w-[156px]"
          priority
        />
      </div>

      <nav
        className="pointer-events-auto absolute right-4 top-5 flex items-center gap-4 md:gap-5 lg:right-[4vw] lg:top-[35px] lg:gap-6"
        aria-label={t("nav.ariaLabel")}
      >
        <div className="hidden items-center gap-3 text-[0.72rem] uppercase tracking-[0.08rem] md:flex lg:gap-5 lg:text-sm lg:tracking-[0.1rem]">
          {navigationKeys.map((key) => (
            <a
              href="#"
              key={key}
              className="relative opacity-85 transition-opacity duration-200 hover:opacity-100 after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-[8px] after:w-full after:origin-left after:scale-x-75 after:rounded-[18px_3px_14px_5px] after:bg-[#b3201d]/85 after:opacity-0 after:blur-[0.2px] after:content-[''] after:transition-all after:duration-200 hover:after:scale-x-100 hover:after:opacity-100"
            >
              {t(key)}
            </a>
          ))}
        </div>
        <LanguageToggle />
      </nav>
    </header>
  );
}
