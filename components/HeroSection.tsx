"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import HeroContent from "@/components/HeroContent";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      data-hero-section
      className="relative min-h-svh overflow-hidden isolate"
    >
      <Image
        src="/placeholders/7208.jpg"
        alt={t("hero.heroImageAlt")}
        fill
        priority
        className="object-cover object-center md:object-[center_42%]"
      />

      <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.12)_40%,rgba(0,0,0,0.32)_100%)]" />

      <HeroContent />
    </section>
  );
}
