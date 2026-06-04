import { Cormorant_Garamond, Inter, Noto_Sans_HK, Noto_Serif_TC } from "next/font/google";

/** English display serif — hero and section titles */
export const fontDisplayEn = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap"
});

/** English UI and body */
export const fontSansEn = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap"
});

/**
 * Traditional Chinese display serif (HK).
 * Loaded via Noto Serif TC — closest next/font match to Source Han Serif TC.
 */
export const fontDisplayZh = Noto_Serif_TC({
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: true,
  adjustFontFallback: true
});

/** Traditional Chinese UI and body (Hong Kong) */
export const fontSansZh = Noto_Sans_HK({
  weight: ["400", "500"],
  variable: "--font-noto-sans-hk",
  display: "swap",
  preload: true,
  adjustFontFallback: true
});

export const fontVariableClasses = [
  fontDisplayEn.variable,
  fontSansEn.variable,
  fontDisplayZh.variable,
  fontSansZh.variable
].join(" ");
