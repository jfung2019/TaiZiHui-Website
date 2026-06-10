"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { typography } from "@/lib/typography";

type PostItem = {
  id: string;
  title: string | null;
  description: string | null;
  date: string;
  imageAlt: string;
  imageSrc: string;
  link: string;
};

const IMAGE_BY_POST_ID: Record<string, string> = {
  post1: "/placeholders/FBpost.jpg",
  post2: "/placeholders/FBpost2.jpg",
  post3: "/placeholders/FBpost3.jpg",
  post4: "/placeholders/fish_soup.png"
};

gsap.registerPlugin(ScrollTrigger);

function readTranslatedValue(translatedValue: string, key: string) {
  const cleaned = translatedValue.trim();
  return cleaned && cleaned !== key ? cleaned : null;
}

export default function FacebookPostsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const heroCardRef = useRef<HTMLAnchorElement>(null);
  const moreButtonWrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const posts = useMemo<PostItem[]>(
    () =>
      (["post1", "post2", "post3", "post4"] as const).map((id) => {
        const titleKey = `facebookPosts.items.${id}.title`;
        const descriptionKey = `facebookPosts.items.${id}.description`;

        return {
          id,
          title: readTranslatedValue(t(titleKey), titleKey),
          description: readTranslatedValue(t(descriptionKey), descriptionKey),
          date: t(`facebookPosts.items.${id}.date`),
          imageAlt: t(`facebookPosts.items.${id}.imageAlt`),
          imageSrc: IMAGE_BY_POST_ID[id],
          link: t(`facebookPosts.items.${id}.link`)
        };
      }),
    [t]
  );

  const fallbackTitle = t("facebookPosts.fallbackTitle");
  const fallbackDescription = t("facebookPosts.fallbackDescription");
  const getDisplayTitle = (post: PostItem) => post.title ?? post.description ?? fallbackTitle;
  const getDisplayDescription = (post: PostItem) => {
    if (post.title && post.description) {
      return post.description;
    }
    if (post.title && !post.description) {
      return fallbackDescription;
    }
    return "";
  };
  const activePost = posts[activeIndex];

  useLayoutEffect(() => {
    if (!heroCardRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroCardRef.current,
        { autoAlpha: 0.78, scale: 0.985, y: 8 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.38, ease: "power2.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activePost.id]);

  useLayoutEffect(() => {
    if (!sectionRef.current || !moreButtonWrapRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        moreButtonWrapRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="facebook-posts"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0c] py-60 sm:py-72 lg:py-80"
      aria-label={t("facebookPosts.sectionLabel")}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={`${typography.eyebrow} text-white/55`}>{t("facebookPosts.eyebrow")}</p>
            <h2 className={`${typography.sectionTitle} mt-2 text-white/95`}>{t("facebookPosts.title")}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Link
            ref={heroCardRef}
            href={activePost.link}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block overflow-hidden rounded-sm border border-white/10 bg-black/35"
            aria-label={t("facebookPosts.openPost", { title: getDisplayTitle(activePost) })}
          >
            <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[520px]">
              <Image
                key={`${activePost.id}-bg`}
                src={activePost.imageSrc}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover opacity-35 blur-sm scale-[1.06]"
                aria-hidden
              />
              <Image
                key={activePost.id}
                src={activePost.imageSrc}
                alt={activePost.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-5 pb-5 pt-12">
              <p className={`${typography.caption} text-white/70`}>{activePost.date}</p>
              <h3 className={`${typography.button} mt-2 text-white`}>{getDisplayTitle(activePost)}</h3>
            </div>
          </Link>

          <div>
            <div className="space-y-2">
              {posts.map((post, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "min-h-[104px] w-full border px-5 py-5 text-left transition-all duration-250 sm:min-h-[112px]",
                      isActive
                        ? "border-[#b3201d] bg-[#b3201d] text-white shadow-[0_0_0_1px_rgba(179,32,29,0.4)]"
                        : "border-white/12 bg-white/[0.03] text-white/86 hover:border-[#b3201d]/65 hover:bg-[#b3201d]/18"
                    ].join(" ")}
                    aria-label={t("facebookPosts.focusPost", { title: getDisplayTitle(post) })}
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className={`${typography.button} line-clamp-1`}>{getDisplayTitle(post)}</p>
                        {getDisplayDescription(post) ? (
                          <p className={`${typography.caption} mt-2 line-clamp-2 min-h-[2.9em] ${isActive ? "text-white/88" : "text-white/62"}`}>
                            {getDisplayDescription(post)}
                          </p>
                        ) : null}
                      </div>
                      <span className={`${typography.caption} shrink-0 ${isActive ? "text-white/90" : "text-white/55"}`}>
                        {post.date}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div ref={moreButtonWrapRef} className="mt-20 flex justify-center">
              <Link
                href={t("facebookPosts.pageLink")}
                target="_blank"
                rel="noreferrer noopener"
                className={`${typography.button} inline-flex items-center gap-2 rounded-md border border-[#FFD700]/75 px-8 py-4 text-white transition-colors duration-200 hover:bg-[#FFD700]/18`}
              >
                {t("facebookPosts.moreButton")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
