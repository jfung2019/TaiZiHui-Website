"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { typography } from "@/lib/typography";

export default function FooterSection() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-white/10 bg-[#09090b] py-20 sm:py-24"
      aria-label={t("footer.sectionLabel")}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 sm:pb-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className={`${typography.eyebrow} text-white/55`}>{t("footer.eyebrow")}</p>
            <h2 className={`${typography.sectionTitle} mt-3 text-white/95`}>{t("footer.title")}</h2>
            <p className={`${typography.paragraph} mt-5 max-w-[56ch] text-white/72`}>{t("footer.description")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link
              href={t("footer.whatsappLink")}
              target="_blank"
              rel="noreferrer noopener"
              className={`${typography.button} inline-flex items-center rounded-sm bg-[#b3201d] px-6 py-3 text-white transition-colors duration-200 hover:bg-[#ca2a26]`}
            >
              {t("footer.bookNow")}
            </Link>
            <Link
              href={t("footer.whatsappLink")}
              target="_blank"
              rel="noreferrer noopener"
              className={`${typography.button} inline-flex items-center rounded-sm border border-white/25 px-6 py-3 text-white/90 transition-colors duration-200 hover:bg-white/10`}
            >
              {t("footer.whatsappCta")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 py-10 sm:py-12 md:grid-cols-3">
          <div>
            <h3 className={`${typography.button} text-white/94`}>{t("footer.contactTitle")}</h3>
            <div className={`${typography.paragraph} mt-4 space-y-2 text-white/76`}>
              <p>
                {t("footer.telLabel")}{" "}
                <a href={t("footer.telHref")} className="underline-offset-4 transition-colors duration-200 hover:text-white hover:underline">
                  {t("footer.tel")}
                </a>
              </p>
              <p>
                {t("footer.whatsappLabel")}{" "}
                <a
                  href={t("footer.whatsappLink")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
                >
                  {t("footer.whatsapp")}
                </a>
              </p>
              <p>
                <a
                  href={t("footer.facebookLink")}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t("footer.facebookAria")}
                  className="inline-flex items-center gap-2 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4V11H8v3h2.6v8h2.9z" />
                  </svg>
                  <span>{t("footer.facebook")}</span>
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className={`${typography.button} text-white/94`}>{t("footer.addressTitle")}</h3>
            <p className={`${typography.paragraph} mt-4 max-w-[30ch] text-white/76`}>{t("footer.address")}</p>
            <Link
              href={t("footer.mapLink")}
              target="_blank"
              rel="noreferrer noopener"
              className={`${typography.caption} mt-4 inline-flex items-center text-[#ffd97d] underline-offset-4 transition-colors duration-200 hover:text-[#ffe7ac] hover:underline`}
            >
              {t("footer.openMap")}
            </Link>
          </div>

          <div>
            <h3 className={`${typography.button} text-white/94`}>{t("footer.hoursTitle")}</h3>
            <div className={`${typography.paragraph} mt-4 space-y-2 text-white/76`}>
              <p>{t("footer.hoursWeekday")}</p>
              <p>{t("footer.hoursWeekend")}</p>
              <p className={`${typography.caption} pt-2 text-white/58`}>{t("footer.parkingNote")}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className={`${typography.sectionTitle} text-[#E8CB75]/95`}>{t("footer.brandWordmark")}</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <p className={`${typography.caption} text-white/56`}>
              {t("footer.copyright", { year: currentYear })}
            </p>
            <Link href={t("footer.privacyLink")} className={`${typography.caption} text-white/70 transition-colors duration-200 hover:text-white`}>
              {t("footer.privacy")}
            </Link>
            <Link href={t("footer.termsLink")} className={`${typography.caption} text-white/70 transition-colors duration-200 hover:text-white`}>
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
