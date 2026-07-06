import type { Metadata } from "next";
import type { ReactNode } from "react";
import I18nProvider from "@/components/I18nProvider";
import { WebContentProvider } from "@/components/WebContentProvider";
import { fontVariableClasses } from "@/lib/fonts";
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
    <html lang="en" data-locale="en" className={fontVariableClasses} suppressHydrationWarning>
      <body>
        <I18nProvider>
          <WebContentProvider>{children}</WebContentProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
