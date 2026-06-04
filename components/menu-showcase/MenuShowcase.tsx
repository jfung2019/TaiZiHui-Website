"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import SealGeometry from "@/components/menu-showcase/SealGeometry";
import SeeMenuButton from "@/components/menu-showcase/SeeMenuButton";
import { useMenuShowcaseEntrance } from "@/components/menu-showcase/useMenuShowcaseEntrance";
import { useMenuShowcaseParallax } from "@/components/menu-showcase/useMenuShowcaseParallax";
import {
  menuShowcaseAssets,
  menuShowcaseIngredients
} from "@/lib/menuShowcase.config";

export default function MenuShowcase() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroScaleRef = useRef<HTMLDivElement>(null);
  const ingredientRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ingredientScaleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonScaleRef = useRef<HTMLDivElement>(null);

  useMenuShowcaseParallax({
    sectionRef,
    heroRef,
    ingredientRefs,
    ingredients: menuShowcaseIngredients
  });

  useMenuShowcaseEntrance({
    sectionRef,
    backgroundRef,
    heroScaleRef,
    ingredientScaleRefs,
    buttonScaleRef,
    ingredients: menuShowcaseIngredients
  });

  return (
    <section
      id="menu-showcase"
      ref={sectionRef}
      data-menu-showcase
      className="relative isolate min-h-svh overflow-hidden bg-[#080808]"
      aria-label={t("menuShowcase.sectionLabel")}
    >
      <div ref={backgroundRef} className="absolute inset-0">
        <Image
          src={menuShowcaseAssets.background}
          alt=""
          fill
          className="object-cover object-center brightness-[1.12] contrast-[1.04] saturate-[1.05]"
          sizes="100vw"
          priority={false}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_42%,transparent_50%,rgba(0,0,0,0.22)_100%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/25" />

      {menuShowcaseAssets.showSealGeometry ? <SealGeometry /> : null}

      {menuShowcaseIngredients.map((ingredient, index) => (
        <div
          key={ingredient.id}
          ref={(node) => {
            ingredientRefs.current[index] = node;
          }}
          className="pointer-events-none absolute will-change-transform"
          style={{
            top: ingredient.top,
            left: ingredient.left,
            zIndex: ingredient.zIndex,
            filter: ingredient.blurPx ? `blur(${ingredient.blurPx}px)` : undefined
          }}
        >
          <div
            ref={(node) => {
              ingredientScaleRefs.current[index] = node;
            }}
            className="origin-center"
          >
            <Image
              src={ingredient.src}
              alt={t(ingredient.altKey)}
              width={ingredient.width}
              height={ingredient.width}
              className="h-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
              style={{
                width: ingredient.width,
                maxWidth: `min(${ingredient.width}px, 38vw)`
              }}
            />
          </div>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-5 flex items-center justify-center">
        <div
          ref={heroRef}
          className="relative will-change-transform"
          style={{ marginTop: "4vh" }}
        >
          <div ref={heroScaleRef} className="origin-center">
            <Image
              src={menuShowcaseAssets.heroDish}
              alt={t("menuShowcase.heroDishAlt")}
              width={menuShowcaseAssets.heroDishWidth}
              height={menuShowcaseAssets.heroDishWidth}
              className="h-auto object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.65)]"
              style={{
                width: menuShowcaseAssets.heroDishWidth,
                maxWidth: `min(${menuShowcaseAssets.heroDishMaxVw}vw, ${menuShowcaseAssets.heroDishWidth}px)`
              }}
              priority={false}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute left-1/2 z-10 -translate-x-1/2"
        style={{ top: "calc(50% + min(34vh, 380px))" }}
      >
        <div ref={buttonScaleRef} className="origin-center">
          <SeeMenuButton />
        </div>
      </div>
    </section>
  );
}
