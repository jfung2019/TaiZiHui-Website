import type { Metadata } from "next";
import type { ReactNode } from "react";
import I18nProvider from "@/components/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tai Zi Hui Private Kitchen",
  description: "Private Chinese kitchen in Hong Kong."
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
