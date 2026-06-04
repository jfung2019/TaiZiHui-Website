"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import {
  MENU_HERO_MOTION_SPEED,
  MENU_HERO_PARALLAX_DEPTH,
  MENU_PARALLAX_BASE_LERP,
  MENU_PARALLAX_MAX_SHIFT,
  type MenuIngredientConfig
} from "@/lib/menuShowcase.config";

type UseMenuShowcaseParallaxOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  heroRef: RefObject<HTMLDivElement | null>;
  ingredientRefs: RefObject<(HTMLDivElement | null)[]>;
  ingredients: MenuIngredientConfig[];
};

const DESKTOP_QUERY = "(min-width: 1024px) and (pointer: fine)";
const QUICK_TO_BASE_DURATION = 0.72;

type MotionLayer = {
  x: number;
  y: number;
  setX: (value: number) => void;
  setY: (value: number) => void;
  depth: number;
  lerp: number;
};

export function useMenuShowcaseParallax({
  sectionRef,
  heroRef,
  ingredientRefs,
  ingredients
}: UseMenuShowcaseParallaxOptions) {
  const isActiveRef = useRef(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const layersRef = useRef<MotionLayer[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const media = window.matchMedia(DESKTOP_QUERY);
    const max = MENU_PARALLAX_MAX_SHIFT;

    const layers = ingredients.flatMap((ingredient, index) => {
      const el = ingredientRefs.current[index];
      if (!el) {
        return [];
      }
      const duration = QUICK_TO_BASE_DURATION / ingredient.motionSpeed;
      const layer: MotionLayer = {
        x: 0,
        y: 0,
        depth: ingredient.depth,
        lerp: MENU_PARALLAX_BASE_LERP * ingredient.motionSpeed,
        setX: gsap.quickTo(el, "x", { duration, ease: "power3.out" }),
        setY: gsap.quickTo(el, "y", { duration, ease: "power3.out" })
      };
      return [layer];
    });

    const heroEl = heroRef.current;
    let heroLayer: MotionLayer | null = null;

    if (heroEl) {
      const heroDuration = QUICK_TO_BASE_DURATION / MENU_HERO_MOTION_SPEED;
      heroLayer = {
        x: 0,
        y: 0,
        depth: MENU_HERO_PARALLAX_DEPTH,
        lerp: MENU_PARALLAX_BASE_LERP * MENU_HERO_MOTION_SPEED,
        setX: gsap.quickTo(heroEl, "x", { duration: heroDuration, ease: "power3.out" }),
        setY: gsap.quickTo(heroEl, "y", { duration: heroDuration, ease: "power3.out" })
      };
    }

    layersRef.current = layers;

    const applyLayer = (layer: MotionLayer) => {
      layer.setX(layer.x * max * layer.depth);
      layer.setY(layer.y * max * layer.depth);
    };

    const tick = () => {
      if (rafRef.current !== null) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(() => {
        const target = targetRef.current;

        layers.forEach((layer) => {
          layer.x += (target.x - layer.x) * layer.lerp;
          layer.y += (target.y - layer.y) * layer.lerp;
          applyLayer(layer);
        });

        if (heroLayer) {
          heroLayer.x += (target.x - heroLayer.x) * heroLayer.lerp;
          heroLayer.y += (target.y - heroLayer.y) * heroLayer.lerp;
          applyLayer(heroLayer);
        }

        rafRef.current = null;
      });
    };

    const resetMotion = () => {
      targetRef.current = { x: 0, y: 0 };
      layers.forEach((layer) => {
        layer.x = 0;
        layer.y = 0;
        layer.setX(0);
        layer.setY(0);
      });
      if (heroLayer) {
        heroLayer.x = 0;
        heroLayer.y = 0;
        heroLayer.setX(0);
        heroLayer.setY(0);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isActiveRef.current || !media.matches) {
        return;
      }
      const rect = section.getBoundingClientRect();
      targetRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      tick();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActiveRef.current = Boolean(entry?.isIntersecting);
        if (!isActiveRef.current) {
          resetMotion();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(section);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onMediaChange = () => {
      if (!media.matches) {
        resetMotion();
      }
    };
    media.addEventListener("change", onMediaChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      media.removeEventListener("change", onMediaChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resetMotion();
    };
  }, [sectionRef, heroRef, ingredientRefs, ingredients]);
}
