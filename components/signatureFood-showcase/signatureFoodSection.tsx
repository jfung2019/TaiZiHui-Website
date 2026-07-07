"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWebContent } from "@/components/WebContentProvider";
import gsap from "gsap";
import { typography } from "@/lib/typography";
import {
  fetchSignatureItemsFromBackend,
  toMenuItemViewModel,
  type MenuItemRecord,
  type MenuItemViewModel
} from "@/lib/services/mediaLoader.service";
import { rotateTriplet, setToSlot } from "@/components/signatureFood-showcase/foodAnimation";
import SeeMenuButton from "./SeeMenuButton";

const SIGNATURE_CAROUSEL_SIZE = 3;

type CarouselOrder = [string, string, string];

function resolveLocale(language: string) {
  return language === "zh-TW" ? "zh-TW" : "en";
}

export default function SignatureFoodSection() {
  const { t, i18n } = useTranslation();
  const { text } = useWebContent();
  const locale = resolveLocale(i18n.language);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const centerTextRef = useRef<HTMLDivElement>(null);

  const [signatureRecords, setSignatureRecords] = useState<MenuItemRecord[]>([]);
  const [order, setOrder] = useState<CarouselOrder | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchSignatureItemsFromBackend()
      .then((items) => {
        if (cancelled) {
          return;
        }

        const signatureItems = items.slice(0, SIGNATURE_CAROUSEL_SIZE);
        if (signatureItems.length !== SIGNATURE_CAROUSEL_SIZE) {
          setSignatureRecords([]);
          setOrder(null);
          return;
        }

        setSignatureRecords(signatureItems);
        setOrder([
          String(signatureItems[0].id),
          String(signatureItems[1].id),
          String(signatureItems[2].id)
        ]);
      })
      .catch(() => {
        if (!cancelled) {
          setSignatureRecords([]);
          setOrder(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signatureItems = useMemo<MenuItemViewModel[]>(
    () => signatureRecords.map((item) => toMenuItemViewModel(item, locale)),
    [signatureRecords, locale]
  );

  const centerItemId = order?.[1] ?? null;
  const centerItem = centerItemId
    ? signatureItems.find((item) => item.id === centerItemId) ?? null
    : null;
  const isCarouselReady = signatureItems.length === SIGNATURE_CAROUSEL_SIZE && order !== null;

  useLayoutEffect(() => {
    const centerText = centerTextRef.current;
    if (!centerText || !centerItem) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        centerText,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [centerItemId, centerItem]);

  useLayoutEffect(() => {
    if (!order) {
      return;
    }

    const [leftId, centerId, rightId] = order;
    const leftEl = itemRefs.current[leftId];
    const centerEl = itemRefs.current[centerId];
    const rightEl = itemRefs.current[rightId];

    if (!leftEl || !centerEl || !rightEl) {
      return;
    }

    const ctx = gsap.context(() => {
      setToSlot(leftEl, "left");
      setToSlot(centerEl, "center");
      setToSlot(rightEl, "right");
    }, sectionRef);

    return () => ctx.revert();
  }, [order]);

  const handleItemClick = (clickedId: string) => {
    if (!order || isAnimating) {
      return;
    }

    const clickedIndex = order.indexOf(clickedId);
    if (clickedIndex === 1) {
      return;
    }

    const animationItems = Object.fromEntries(
      signatureItems.map((item) => {
        const el = itemRefs.current[item.id];
        return el ? [item.id, { id: item.id, el }] : null;
      }).filter((entry): entry is [string, { id: string; el: HTMLElement }] => entry !== null)
    );

    if (Object.keys(animationItems).length !== signatureItems.length) {
      return;
    }

    const direction = clickedIndex === 0 ? "right" : "left";

    const tl = gsap.timeline({
      onStart: () => setIsAnimating(true),
      onComplete: () => setIsAnimating(false)
    });

    const nextOrder = rotateTriplet(tl, animationItems, order, direction, { duration: 0.8 });

    tl.call(() => {
      setOrder(nextOrder);
    }, [], 0.3);
  };

  return (
    <section
      id="signature-food"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#09090c] py-12 pt-16 sm:py-14 lg:py-16"
      aria-label={t("signatureFood.sectionLabel")}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-[68ch] text-center">
          <h2 id="signature-food-heading" className={`${typography.sectionTitle} m-0 text-white/95`}>
            {text("signature_food_title")}
          </h2>
          <p className={`${typography.paragraph} mt-4 text-white/72`}>
            {text("signature_food_description")}
          </p>
        </div>
      </div>

      {isCarouselReady ? (
        <div className="relative left-1/2 mt-6 h-[360px] w-screen -translate-x-1/2 overflow-visible sm:h-[460px] lg:h-[560px]">
          {signatureItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              ref={(node) => {
                itemRefs.current[item.id] = node;
              }}
              className="absolute left-1/2 top-1/2 w-[65%] max-w-[600px] cursor-pointer border-0 bg-transparent p-0 sm:w-[46%] lg:w-[32%]"
              aria-label={t("signatureFood.focusDish", { dish: item.name })}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={720}
                height={720}
                className="h-auto w-full object-contain drop-shadow-[0_22px_46px_rgba(0,0,0,0.55)]"
                priority={false}
              />
            </button>
          ))}
        </div>
      ) : null}

      {centerItem ? (
        <div ref={centerTextRef} className="mx-auto mt-5 max-w-[800px] px-6 text-center">
          <h3 className={`${typography.sectionTitle} text-[clamp(1.3rem,2.4vw,2.1rem)] text-white/95`}>
            {centerItem.name}
          </h3>
          <p className={`${typography.paragraph} mt-3 text-white/78`}>{centerItem.description}</p>
        </div>
      ) : null}

      <div className="mt-6 flex justify-center">
        <SeeMenuButton />
      </div>
    </section>
  );
}
