"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeInFromTop, fadeInFromBottom, fadeInFromLeft, fadeInFromRight } from "./imageAnimation";
import { typography } from "@/lib/typography";
import { useTranslation } from "react-i18next";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const firstRowRef = useRef<HTMLDivElement>(null);
    const secondRowRef = useRef<HTMLDivElement>(null);
    const roomImageRef = useRef<HTMLDivElement>(null);
    const roomcontentRef = useRef<HTMLDivElement>(null);
    const foodImageRef = useRef<HTMLDivElement>(null);
    const foodcontentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const firstRow = firstRowRef.current;
        const secondRow = secondRowRef.current;
        const roomImage = roomImageRef.current;
        const roomcontent = roomcontentRef.current;
        const foodImage = foodImageRef.current;
        const foodcontent = foodcontentRef.current;

        if (!section || !firstRow || !secondRow || !roomImage || !roomcontent || !foodImage || !foodcontent) return;

        const ctx = gsap.context(() => {
          gsap.set([roomImage, roomcontent, foodImage, foodcontent], { autoAlpha: 0 });

          const firstRowTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: firstRow,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse"
            },
          });

          fadeInFromTop(firstRowTimeline, roomImage, { offset: 0 });
          fadeInFromRight(firstRowTimeline, roomcontent, { offset: 0 });

          const secondRowTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: secondRow,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse"
            }
          });

          fadeInFromBottom(secondRowTimeline, foodImage, { offset: 0 });
          fadeInFromLeft(secondRowTimeline, foodcontent, { offset: 0 });
        }, section);
        return () => ctx.revert();
      }, []);
    

      return (
        <section 
        id="experiences-showcase"
        ref={sectionRef}
        data-experiences-showcase
        className="relative overflow-hidden bg-[#0b0b0f] pb-24 pt-48"
        aria-label="experiencesShowcase.sectionLabel"
        >
            <div ref={firstRowRef} className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[420px_1fr] lg:gap-16">
                {/* Left image */}
                <div ref={roomImageRef} className="relative h-[650px] w-full overflow-hidden [clip-path:polygon(0_0,100%_0,100%_80%,50%_100%,0_80%)]">
                    {/* Use next/image in your real file */}
                    <Image
                        src="/placeholders/TZH_V1.png"
                        alt={t("experiencesShowcase.roomImageAlt")}
                        fill
                        className="h-full w-full object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                </div>
                {/* Right text */}
                <div ref={roomcontentRef} className="max-w-[560px] text-left">
                <h2 id="experiences-showcase-room-heading" className={`${typography.sectionTitle} text-white`}>
                    {t("experiencesShowcase.roomHeading")}
                </h2>
                <p className={`${typography.paragraph} mt-4 text-white/85`}>
                    {t("experiencesShowcase.roomDescription")}
                </p>
                </div>
            </div>

            <div ref={secondRowRef} className="mx-auto mt-28 grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1fr_420px] lg:gap-16">
                {/* Left text */}
                <div ref={foodcontentRef} className="max-w-[560px] text-right">
                <h2 id="experiences-showcase-food-heading" className={`${typography.sectionTitle} text-white`}>
                    {t("experiencesShowcase.foodHeading")}
                </h2>
                <p className={`${typography.paragraph} mt-4 text-white/85`}>
                    {t("experiencesShowcase.foodDescription")}
                </p>
                </div>
                {/* Right image */}
                <div ref={foodImageRef} className="relative h-[720px] w-full overflow-hidden [clip-path:polygon(100%_100%,0_100%,0_22%,50%_0,100%_22%)]">
                    {/* Use next/image in your real file */}
                    <Image
                        src="/placeholders/fish_soup.png"
                        alt={t("experiencesShowcase.foodImageAlt")}
                        fill
                        className="h-full w-full object-cover"
                        sizes="(max-width: 415px) 100vw, 33vw"
                    />
                </div>
            </div>
        
        </section>
      );
}