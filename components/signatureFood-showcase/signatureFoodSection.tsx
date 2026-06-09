"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { typography } from "@/lib/typography";
import { rotateTriplet, setToSlot } from "@/components/signatureFood-showcase/foodAnimation";
import SeeMenuButton from "./SeeMenuButton";

const SIGNATURE_ITEMS = [
  {
    id: "a",
    src: "/placeholders/太子滙-頂角膏蟹蒸手剁肉餅-6984-removebg-preview.png",
    i18nBaseKey: "signatureFood.items.a"
  },
  {
    id: "b",
    src: "/placeholders/太子滙-懷舊葫蘆鴨-7092-removebg-preview.png",
    i18nBaseKey: "signatureFood.items.b"
  },
  {
    id: "c",
    src: "/placeholders/太子滙-生拆蟹皇翅-6958v2-removebg-preview.png",
    i18nBaseKey: "signatureFood.items.c"
  }
] as const;

type CarouselOrder = [string, string, string];

export default function SignatureFoodSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({
    a: null,
    b: null,
    c: null
  });

  const [order, setOrder] = useState<CarouselOrder>(["a", "b", "c"]);
  const [isAnimating, setIsAnimating] = useState(false);
  const centerItemId = order[1];
  const centerName = t(`signatureFood.items.${centerItemId}.name`);
  const centerDescription = t(`signatureFood.items.${centerItemId}.description`);
  const centerTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const centerText = centerTextRef.current;
    if (!centerText) {
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
  }, [centerItemId]);

  useLayoutEffect(() => {
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
    if (isAnimating) {
      return;
    }

    const clickedIndex = order.indexOf(clickedId);
    if (clickedIndex === 1) {
      return;
    }

    const direction = clickedIndex === 0 ? "right" : "left";
    const items = {
      a: { id: "a", el: itemRefs.current.a },
      b: { id: "b", el: itemRefs.current.b },
      c: { id: "c", el: itemRefs.current.c }
    };

    if (!items.a.el || !items.b.el || !items.c.el) {
      return;
    }

    const tl = gsap.timeline({
      onStart: () => setIsAnimating(true),
      onComplete: () => setIsAnimating(false)
    });

    const nextOrder = rotateTriplet(
      tl,
      {
        a: { id: "a", el: items.a.el },
        b: { id: "b", el: items.b.el },
        c: { id: "c", el: items.c.el }
      },
      order,
      direction,
      { duration: 0.8 }
    );

    tl.call(() => {setOrder(nextOrder)}, [], 0.3);

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
            {t("signatureFood.title")}
          </h2>
          <p className={`${typography.paragraph} mt-4 text-white/72`}>
            {t("signatureFood.description")}
          </p>
        </div>
      </div>

      <div className="relative left-1/2 mt-6 h-[360px] w-screen -translate-x-1/2 overflow-visible sm:h-[460px] lg:h-[560px]">
        {SIGNATURE_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleItemClick(item.id)}
            ref={(node) => {
              itemRefs.current[item.id] = node;
            }}
            className="absolute left-1/2 top-1/2 w-[65%] max-w-[600px] cursor-pointer border-0 bg-transparent p-0 sm:w-[46%] lg:w-[32%]"
            aria-label={t("signatureFood.focusDish", { dish: t(`${item.i18nBaseKey}.name`) })}
          >
            <Image
              src={item.src}
              alt={t(`${item.i18nBaseKey}.alt`)}
              width={720}
              height={720}
              className="h-auto w-full object-contain drop-shadow-[0_22px_46px_rgba(0,0,0,0.55)]"
              priority={false}
            />
          </button>
        ))}
      </div>

      <div ref={centerTextRef} className="mx-auto mt-5 max-w-[800px] px-6 text-center">
        <h3 className={`${typography.sectionTitle} text-[clamp(1.3rem,2.4vw,2.1rem)] text-white/95`}>
          {centerName}
        </h3>
        <p className={`${typography.paragraph} mt-3 text-white/78`}>{centerDescription}</p>
        <div className="mt-6 flex justify-center">
          <SeeMenuButton />
        </div>
      </div>
    </section>
  );
}
