"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import HeroContent from "@/components/HeroContent";
import Navbar from "@/components/Navbar";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-svh overflow-hidden isolate">
      <Image
        src="/placeholders/7208.jpg"
        alt={t("hero.heroImageAlt")}
        fill
        priority
        className="object-cover object-center md:object-[center_42%]"
      />

      <div className="absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.12)_40%,rgba(0,0,0,0.32)_100%)]" />

      <div className="absolute left-2 top-2 z-3 sm:left-4 sm:top-4">
        <div>
          <Image
            src="/logo/tzh_logo_vertical.png"
            alt={t("hero.logoAlt")}
            width={172}
            height={218}
            className="h-auto w-[88px] object-contain sm:w-[120px] lg:w-[156px]"
            priority
          />
        </div>
      </div>

      <Navbar />
      <HeroContent />
    </section>
  );
}
