"use client";

import { useTranslation } from "react-i18next";

export default function HeroContent() {
  const { t } = useTranslation();

  return (
    <div className="relative z-2 ml-auto mr-4 max-w-[760px] pb-10 pt-[170px] text-right sm:mr-6 sm:pt-[210px] md:pt-[240px] lg:mr-[170px] lg:pt-[31vh]">
      <p className="m-0 text-[0.7rem] uppercase tracking-[0.12rem] opacity-85 sm:text-[0.78rem] sm:tracking-[0.14rem]">
        {t("hero.eyebrow")}
      </p>
      <h1 className="mb-4 mt-3 ml-auto max-w-[16ch] font-['Times_New_Roman','DFKai-SB',Georgia,serif] text-[clamp(1.8rem,7vw,4.6rem)] leading-[1.08] font-medium sm:max-w-[14ch]">
        {t("hero.title")}
      </h1>
      <p className="m-0 ml-auto max-w-[60ch] text-[0.88rem] leading-[1.55] text-white/90 sm:text-[0.95rem] lg:text-base">
        {t("hero.description")}
      </p>
      <div className="mt-7 flex flex-wrap justify-end gap-2.5 sm:mt-[30px] sm:gap-3">
        <a
          href="#"
          className="inline-flex h-11 min-w-[140px] items-center justify-center border border-white/60 bg-white/10 px-4 text-[0.7rem] uppercase tracking-[0.08rem] transition-colors duration-200 hover:bg-white/15 sm:h-[45px] sm:min-w-[156px] sm:px-[18px] sm:text-[0.82rem]"
        >
          {t("hero.reserveTable")}
        </a>
        <a
          href="#"
          className="inline-flex h-11 min-w-[140px] items-center justify-center border border-white/60 bg-black/10 px-4 text-[0.7rem] uppercase tracking-[0.08rem] transition-colors duration-200 hover:bg-black/20 sm:h-[45px] sm:min-w-[156px] sm:px-[18px] sm:text-[0.82rem]"
        >
          {t("hero.viewMenu")}
        </a>
      </div>
    </div>
  );
}
