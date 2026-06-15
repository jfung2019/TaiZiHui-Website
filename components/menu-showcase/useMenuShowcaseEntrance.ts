"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MenuIngredientConfig } from "@/lib/menuShowcase.config";

gsap.registerPlugin(ScrollTrigger);

const ENTRANCE_FROM = { scale: 0.7, opacity: 0 };
const ENTRANCE_TO = { scale: 1, opacity: 1, duration: 0.55, ease: "power3.out" };
const INGREDIENT_STAGGER = 0.15;

type UseMenuShowcaseEntranceOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  backgroundRef: RefObject<HTMLDivElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  descriptionRef: RefObject<HTMLParagraphElement | null>;
  ingredientScaleRefs: RefObject<(HTMLDivElement | null)[]>;
  buttonScaleRef: RefObject<HTMLDivElement | null>;
  ingredients: MenuIngredientConfig[];
};

function sortIngredientIndicesByDepth(ingredients: MenuIngredientConfig[]): number[] {
  return ingredients
    .map((_, index) => index)
    .sort((a, b) => {
      const zDiff = ingredients[a].zIndex - ingredients[b].zIndex;
      return zDiff !== 0 ? zDiff : a - b;
    });
}

export function useMenuShowcaseEntrance({
  sectionRef,
  backgroundRef,
  titleRef,
  descriptionRef,
  ingredientScaleRefs,
  buttonScaleRef,
  ingredients
}: UseMenuShowcaseEntranceOptions) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const background = backgroundRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const buttonScale = buttonScaleRef.current;

    const ingredientScales = sortIngredientIndicesByDepth(ingredients)
      .map((index) => ingredientScaleRefs.current[index])
      .filter((el): el is HTMLDivElement => Boolean(el));

    if (!section || !background || !title || !description || !buttonScale || !ingredientScales.length) {
      return;
    }

    const scaleTargets = [...ingredientScales, buttonScale];

    const ctx = gsap.context(() => {
      gsap.set(background, { opacity: 0 });
      gsap.set(title, {
        clipPath: "inset(0 50% 0 50%)",
        opacity: 0
      });
      gsap.set(description, { opacity: 0, y: 18 });
      gsap.set(scaleTargets, {
        ...ENTRANCE_FROM,
        transformOrigin: "center center"
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      timeline
        .to(background, { opacity: 1, duration: 0.4, ease: "power2.out" })
        .to(
          title,
          {
            clipPath: "inset(0 0% 0 0%)",
            opacity: 1,
            duration: 0.85,
            ease: "power2.out"
          },
          "-=0.05"
        )
        .to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          },
          "-=0.35"
        )
        .to(ingredientScales, { ...ENTRANCE_TO, stagger: INGREDIENT_STAGGER }, "-=0.2")
        .to(buttonScale, ENTRANCE_TO, "-=0.05");
    }, section);

    return () => ctx.revert();
  }, [
    sectionRef,
    backgroundRef,
    titleRef,
    descriptionRef,
    ingredientScaleRefs,
    buttonScaleRef,
    ingredients
  ]);
}
