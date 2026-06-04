"use client";

import { useTranslation } from "react-i18next";
import { typography } from "@/lib/typography";

export default function HeroContent() {
  const { t } = useTranslation();

  return (
    <div className="relative z-2 mx-4 max-w-[760px] pb-10 pt-[170px] sm:mx-6 sm:pt-[210px] md:pt-[240px] lg:mx-0 lg:ml-[170px] lg:pt-[31vh]">
      <p className={`${typography.eyebrow} m-0 opacity-85 sm:tracking-[0.14rem]`}>
        {t("hero.eyebrow")}
      </p>
      <h1 className={`${typography.heroTitle} mb-4 mt-3 max-w-[16ch] sm:max-w-[14ch]`}>
        {t("hero.title")}
      </h1>
      <p className={`${typography.paragraph} m-0 max-w-[60ch] text-white/90`}>
        {t("hero.description")}
      </p>
      <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-[30px] sm:gap-3">
        <a
          href="#"
          className={`${typography.button} inline-flex h-11 min-w-[140px] items-center justify-center border border-white/60 bg-white/10 px-4 transition-colors duration-200 hover:bg-white/15 sm:h-[45px] sm:min-w-[156px] sm:px-[18px]`}
        >
          {t("hero.reserveTable")}
        </a>
        <a
          href="#"
          className={`${typography.button} inline-flex h-11 min-w-[140px] items-center justify-center border border-white/60 bg-black/10 px-4 transition-colors duration-200 hover:bg-black/20 sm:h-[45px] sm:min-w-[156px] sm:px-[18px]`}
        >
          {t("hero.viewMenu")}
        </a>
      </div>
    </div>
  );
}
