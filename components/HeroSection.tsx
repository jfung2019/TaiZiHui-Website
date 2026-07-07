"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import HeroContent from "@/components/HeroContent";
import {
  fetchCarouselViewModelsFromBackend,
  type CarouselViewModel
} from "@/lib/services/mediaLoader.service";


export default function HeroSection() {
  const { t } = useTranslation();
  const [carouselItems, setCarouselItems] = useState<CarouselViewModel[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchCarouselViewModelsFromBackend()
      .then((items) => {
        if (!cancelled) {
          setCarouselItems(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCarouselItems([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const heroImageUrl = useMemo(() => {
    const sortedItems = [...carouselItems].sort((a, b) => a.sortOrder - b.sortOrder);
    return sortedItems[0]?.imageUrl || "";
  }, [carouselItems]);

  return (
    <section
      data-hero-section
      className="relative min-h-svh overflow-hidden isolate"
    >
      <Image
        src={heroImageUrl}
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
