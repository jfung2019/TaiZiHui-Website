"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function FloatingSocialIcons() {
  const { t } = useTranslation();

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6"
      aria-label={t("floatingSocial.groupAria")}
    >
      <Link
        href={t("footer.whatsappLink")}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={t("floatingSocial.whatsappAria")}
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#25D366]/50 bg-[#25D366]/18 text-[#25D366] shadow-lg shadow-black/35 transition-all duration-200 hover:scale-105 hover:bg-[#25D366]/28"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M20.5 3.5A11.4 11.4 0 0 0 2.9 17.2L1.5 22.5l5.4-1.4A11.4 11.4 0 1 0 20.5 3.5Zm-8.9 18c-1.8 0-3.6-.5-5.1-1.5l-.4-.2-3.2.8.8-3.1-.2-.4a9 9 0 1 1 8.1 4.4Zm4.9-6.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.4-.2-.6.2l-.8 1c-.1.2-.3.2-.5.1a7.3 7.3 0 0 1-3.5-3c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2.1-.3 0-.5l-.9-2.2c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.8-.9 2s.9 2.4 1 2.6a9.9 9.9 0 0 0 3.8 3.4c2.3 1 2.3.7 2.8.7.5 0 1.8-.7 2-1.4.3-.6.3-1.2.2-1.3-.1-.1-.3-.2-.6-.4Z" />
        </svg>
      </Link>

      <Link
        href={t("footer.facebookLink")}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={t("floatingSocial.facebookAria")}
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#1877F2]/50 bg-[#1877F2]/16 text-[#8bbdff] shadow-lg shadow-black/35 transition-all duration-200 hover:scale-105 hover:bg-[#1877F2]/26"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4V11H8v3h2.6v8h2.9z" />
        </svg>
      </Link>

      <button
        type="button"
        aria-label={t("floatingSocial.rednoteAria")}
        title={t("floatingSocial.rednoteComingSoon")}
        disabled
        className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-full border border-white/25 bg-white/10 text-[11px] font-semibold tracking-wide text-white/55 shadow-lg shadow-black/35"
      >
        RED
      </button>
    </div>
  );
}
