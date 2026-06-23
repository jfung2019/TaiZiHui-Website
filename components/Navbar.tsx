"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LanguageToggle from "@/components/LanguageToggle";
import NavbarMobileMenu from "@/components/NavbarMobileMenu";
import { typography } from "@/lib/typography";

gsap.registerPlugin(ScrollTrigger);

const LOGO_SCROLL_END = 180;

const navigationKeys = [
  { key: "nav.lastestNews", href: "/#facebook-posts" },
  { key: "nav.experience", href: "/#experiences-showcase" },
  { key: "nav.menu", href: "/menu" },
  { key: "nav.location", href: "/#location-section" },
  { key: "nav.parking", href: "/#parking-info" },
  { key: "nav.reservations", href: "/booking" },
] as const;

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const logoRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
      return;
    }

    router.push("/");
  };

  const scrollSectionToViewportCenter = (sectionId: string, behavior: ScrollBehavior = "smooth") => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const targetTop = absoluteTop + rect.height / 2 - window.innerHeight / 2;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: Math.max(0, Math.min(targetTop, maxScrollTop)),
      behavior
    });
  };

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

  useEffect(() => {
    const sectionId = window.location.hash.replace(/^#/, "");
    if (!sectionId) {
      return;
    }

    requestAnimationFrame(() => {
      scrollSectionToViewportCenter(sectionId, "auto");
    });
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white">
      <div ref={logoRef} className="pointer-events-auto absolute left-2 top-2 will-change-transform sm:left-4 sm:top-4">
        <Link href="/" onClick={handleLogoClick} aria-label={t("hero.logoLinkLabel")} className="inline-block">
          <Image
            src="/logo/TZH-logo-private-kitchen.png"
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
              onClick={(event) => {
                const sectionId = href.split("#")[1];
                if (!sectionId || !isHomePage) {
                  return;
                }

                event.preventDefault();
                scrollSectionToViewportCenter(sectionId);
                window.history.replaceState(null, "", `/#${sectionId}`);
              }}
              className={`${typography.nav} relative opacity-85 transition-opacity duration-200 hover:opacity-100 after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-[8px] after:w-full after:origin-left after:scale-x-75 after:rounded-[18px_3px_14px_5px] after:bg-[#b3201d]/85 after:opacity-0 after:blur-[0.2px] after:content-[''] after:transition-all after:duration-200 hover:after:scale-x-100 hover:after:opacity-100`}
            >
              {t(key)}
            </a>
          ))}
        </div>
        <div className="hidden md:block">
          <LanguageToggle />
        </div>
        <div className="md:hidden">
          <NavbarMobileMenu isHomePage={isHomePage} onSectionNavigate={scrollSectionToViewportCenter} />
        </div>
      </nav>
    </header>
  );
}
