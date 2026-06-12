"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LanguageToggle from "@/components/LanguageToggle";
import { typography } from "@/lib/typography";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SCROLL_END = 180;

const navigationKeys = [
  { key: "nav.ourStory", href: "#" },
  { key: "nav.menu", href: "#menu-showcase" },
  { key: "nav.privateEvents", href: "#" },
  { key: "nav.reservations", href: "#" }
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
        <Link href="/" aria-label={t("hero.logoLinkLabel")} className="inline-block">
          <Image
            src="/logo/tzh_logo_vertical.png"
            alt={t("hero.logoAlt")}
            width={172}
            height={218}
            className="h-auto w-[88px] object-contain sm:w-[120px] lg:w-[156px]"
            priority
          />
        </Link>
      </div>

      <nav
        className="pointer-events-auto absolute right-4 top-5 flex items-center gap-4 md:gap-5 lg:right-[4vw] lg:top-[35px] lg:gap-6"
        aria-label={t("nav.ariaLabel")}
      >
        <div className="hidden items-center gap-3 md:flex lg:gap-5">
          {navigationKeys.map(({ key, href }) => (
            <a
              href={href}
              key={key}
              className={`${typography.nav} relative opacity-85 transition-opacity duration-200 hover:opacity-100 after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-[8px] after:w-full after:origin-left after:scale-x-75 after:rounded-[18px_3px_14px_5px] after:bg-[#b3201d]/85 after:opacity-0 after:blur-[0.2px] after:content-[''] after:transition-all after:duration-200 hover:after:scale-x-100 hover:after:opacity-100`}
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
