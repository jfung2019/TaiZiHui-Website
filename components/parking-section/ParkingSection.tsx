"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useWebContent } from "@/components/WebContentProvider";
import { typography } from "@/lib/typography";

type ParkingLotKey = "isquare" | "silvercord" | "hzentre" | "onepeking";

const PARKING_LOTS: ParkingLotKey[] = ["isquare", "silvercord", "hzentre", "onepeking"];

export default function ParkingSection() {
  const { t } = useTranslation();
  const { text } = useWebContent();
  return (
    <section
      id="parking-info"
      className="relative overflow-hidden bg-[#0f0f11] py-52 sm:py-60 lg:py-72"
      aria-label={t("parkingSection.sectionLabel")}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="mx-auto max-w-[72ch] text-center">
          <p className={`${typography.eyebrow} text-white/55`}>{text("parking_eyebrow", "parkingSection.eyebrow")}</p>
          <h2 className={`${typography.sectionTitle} mt-3 text-white/95`}>{text("parking_title", "parkingSection.title")}</h2>
          <p className={`${typography.paragraph} mt-6 text-white/74`}>{text("parking_description", "parkingSection.description")}</p>
          <p className={`${typography.caption} mt-4 text-white/56`}>{t("parkingSection.note")}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {PARKING_LOTS.map((lotKey) => {
            const imageUrl = t(`parkingSection.lots.${lotKey}.imageURL`);
            const hasImageUrl = Boolean(imageUrl) && imageUrl !== `parkingSection.lots.${lotKey}.imageURL`;

            return (
              <article
                key={lotKey}
                className="overflow-hidden rounded-sm border border-white/12 bg-white/[0.02] p-5 sm:p-6"
                aria-label={t(`parkingSection.lots.${lotKey}.name`)}
              >
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-black/30 text-center">
                  {hasImageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={t(`parkingSection.lots.${lotKey}.name`)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className={`${typography.caption} px-4 text-white/52`}>{t("parkingSection.imagePlaceholder")}</span>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className={`${typography.button} text-white`}>{t(`parkingSection.lots.${lotKey}.name`)}</h3>
                  <p className={`${typography.caption} mt-2 text-[#ffd97d]`}>
                    {t("parkingSection.walkingTime", {
                      minutes: t(`parkingSection.lots.${lotKey}.minutes`)
                    })}
                  </p>
                  <p className={`${typography.caption} mt-2 text-white/68`}>{t(`parkingSection.lots.${lotKey}.address`)}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={t(`parkingSection.lots.${lotKey}.mapLink`)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`${typography.button} inline-flex items-center rounded-sm border border-[#FFD700]/75 px-4 py-3 text-white transition-colors duration-200 hover:bg-[#FFD700]/18`}
                  >
                    {t("parkingSection.openMapButton")}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={t("parkingSection.overviewMapLink")}
            target="_blank"
            rel="noreferrer noopener"
            className={`${typography.button} inline-flex items-center rounded-sm border border-white/24 px-5 py-3 text-white/88 transition-colors duration-200 hover:bg-white/10`}
          >
            {t("parkingSection.overviewMapButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
