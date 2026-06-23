"use client";

import { useMemo, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/LanguageToggle";
import StaggeredMenu, { type StaggeredMenuItem } from "@/components/staggered-menu/StaggeredMenu";

const navigationKeys = [
  { key: "nav.lastestNews", href: "/#facebook-posts" },
  { key: "nav.experience", href: "/#experiences-showcase" },
  { key: "nav.menu", href: "/menu" },
  { key: "nav.location", href: "/#location-section" },
  { key: "nav.parking", href: "/#parking-info" },
  { key: "nav.reservations", href: "/booking" },
] as const;

type NavbarMobileMenuProps = {
  isHomePage: boolean;
  onSectionNavigate: (sectionId: string) => void;
};

export default function NavbarMobileMenu({ isHomePage, onSectionNavigate }: NavbarMobileMenuProps) {
  const { t } = useTranslation();

  const items = useMemo<StaggeredMenuItem[]>(
    () =>
      navigationKeys.map(({ key, href }) => ({
        label: t(key),
        ariaLabel: t(key),
        link: href,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => {
          const sectionId = href.split("#")[1];
          if (!sectionId || !isHomePage) {
            return;
          }

          event.preventDefault();
          onSectionNavigate(sectionId);
          window.history.replaceState(null, "", `/#${sectionId}`);
        }
      })),
    [isHomePage, onSectionNavigate, t]
  );

  return (
    <StaggeredMenu
      embedded
      hideLogo
      displaySocials={false}
      displayItemNumbering={false}
      closeOnItemClick
      className="sm-theme-tzh"
      items={items}
      menuText={t("nav.openMenu")}
      closeText={t("nav.closeMenu")}
      accentColor="#e8cb75"
      menuButtonColor="#ffffff"
      openMenuButtonColor="#e8cb75"
      colors={["#070707", "#b3201d", "#101014"]}
      panelFooter={
        <div>
          <p className="sm-panel-footer-label">{t("nav.languageInMenu")}</p>
          <LanguageToggle variant="menu" />
        </div>
      }
    />
  );
}
