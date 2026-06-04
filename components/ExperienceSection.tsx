"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { typography } from "@/lib/typography";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const { t } = useTranslation();
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
      ref={sectionRef}
      data-experience-section
      className="relative overflow-hidden bg-[#111111]"
      aria-labelledby="experience-heading"
    >
      <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[1fr_minmax(300px,420px)_1fr] lg:min-h-[640px]">
        <div
          ref={leftImageRef}
          data-experience-left
          className="relative h-[240px] overflow-hidden sm:h-[300px] lg:h-auto"
        >
          <Image
            src="/placeholders/7435_edited.png"
            alt={t("experience.leftImageAlt")}
            fill
            className="object-fill object-right"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>

        <div
          ref={contentRef}
          data-experience-content
          className="relative z-2 flex items-center px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16"
        >
          <div className="max-w-[34ch]">
            <h2 id="experience-heading" className={`${typography.sectionTitle} m-0 text-white/95`}>
              {t("experience.title")}
            </h2>
            <p className={`${typography.paragraph} mt-6 text-white/72`}>
              {t("experience.description")}
            </p>
          </div>
        </div>

        <div
          ref={rightImageRef}
          data-experience-right
          className="relative h-[240px] overflow-hidden sm:h-[300px] lg:h-auto"
        >
          <Image
            src="/placeholders/6606_edited.png"
            alt={t("experience.rightImageAlt")}
            fill
            className="object-fill object-left"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>
      </div>
    </section>
  );
}
