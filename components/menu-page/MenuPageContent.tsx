"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useWebContent } from "@/components/WebContentProvider";
import { 
  fetchMenuItemsFromBackend, 
  type MenuItemViewModel, 
  type MenuItemRecord,
  toMenuItemViewModel 
} from "@/lib/services/mediaLoader.service";
import { typography } from "@/lib/typography";
import { useEffect, useMemo, useState } from "react";

function resolveLocale(language: string) {
  return language === "zh-TW" ? "zh-TW" : "en";
}

export default function MenuPageContent() {
  const { t, i18n } = useTranslation();
  const { text } = useWebContent();
  const locale = resolveLocale(i18n.language);
  const [menuRecords, setMenuRecords] = useState<MenuItemRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchMenuItemsFromBackend()
      .then((items) => {
        if (!cancelled) {
          setMenuRecords(items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMenuRecords([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const menuItems = useMemo<MenuItemViewModel[]>(
    () => menuRecords.map((item) => toMenuItemViewModel(item, locale)),
    [menuRecords, locale]
  );
   
  return (
    <main className="bg-[#08080b] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 pt-44 pb-20 sm:pt-48 sm:pb-24">
        <div className="absolute inset-0">
          <Image
            src="/menu/7208.webp"
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.76)_0%,rgba(7,7,10,0.9)_45%,rgba(7,7,10,0.98)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-6">
          <p className={`${typography.eyebrow} text-[#e8cb75]/85`}>{text("menu_page_eyebrow", "menuPage.eyebrow")}</p>
          <h1 className={`${typography.sectionTitle} mt-3 max-w-[16ch] text-white/95`}>{text("menu_page_title", "menuPage.title")}</h1>
          <p className={`${typography.paragraph} mt-6 max-w-[70ch] text-white/74`}>{text("menu_page_description", "menuPage.description")}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-sm border border-white/12 bg-white/[0.02] transition-colors duration-200 hover:border-[#e8cb75]/55"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/30">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                  />
                </div>
                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <h2 className={`${typography.button} text-white`}>{item.name}</h2>
                  <p className={`${typography.paragraph} mt-3 text-white/72`}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
