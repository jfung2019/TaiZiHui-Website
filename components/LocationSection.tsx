"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useWebContent } from "@/components/WebContentProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { typography } from "@/lib/typography";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function LocationSection() {
  const { t } = useTranslation();
  const { text } = useWebContent();
  const sectionRef = useRef<HTMLElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftImage = leftImageRef.current;
    const content = contentRef.current;
    const rightImage = rightImageRef.current;

    if (!section || !leftImage || !content || !rightImage) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      timeline
        .fromTo(leftImage, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0)
        .fromTo(content, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.15)
        .fromTo(rightImage, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.1);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location-section"
      ref={sectionRef}
      data-location-section
      className="relative overflow-hidden bg-[#111111] py-12 lg:py-16"
      aria-labelledby="location-heading"
    >
      <div className="grid w-full grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[480px_1fr_480px] lg:gap-0 lg:px-0">
        <div
          ref={leftImageRef}
          data-location-left
          className="relative w-full max-w-[480px] overflow-hidden aspect-[480/643] mx-auto"
        >
          <Image
            src="/placeholders/TZH-Building-morning.png"
            alt={t("locationSection.leftImageAlt")}
            fill
            className="object-cover object-right"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>

        <div
          ref={contentRef}
          data-location-content
          className="relative z-2 flex items-center justify-center px-6 py-10 lg:px-10"
        >
          <div className="max-w-[34ch]">
            <h2 id="experience-heading" className={`${typography.sectionTitle} m-0 text-white/95`}>
              {text("location_title", "locationSection.title")}
            </h2>
            <p className={`${typography.paragraph} mt-6 text-white/72`}>
              {text("location_description", "locationSection.description")}
            </p>
            <p className={`${typography.paragraph} mt-6 text-white/72`}>
              {t("locationSection.address")}
            </p>
            <div className="mt-10 text-center">
            <Link
              href={t("locationSection.googleMapLink")}
              target="_blank"
              rel="noreferrer noopener"
              className={`${typography.button} inline-flex items-center rounded-sm border border-[#FFD700]/75 px-5 py-3 text-white/88 transition-colors duration-200 hover:bg-white/10`}
            >
              {t("locationSection.openMapButton")}
            </Link>
          </div>
          </div>
        </div>

        <div
          ref={rightImageRef}
          data-experience-right
          className="relative w-full max-w-[480px] overflow-hidden aspect-[480/643] mx-auto"
        >
          <Image
            src="/placeholders/TZH-Building-evening.png"
            alt={t("locationSection.rightImageAlt")}
            fill
            className="object-cover object-left"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>
      </div>
    </section>
  );
}
