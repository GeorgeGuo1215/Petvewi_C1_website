import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import { DEFAULT_LANGUAGE, isSupportedLanguage, LOCALE_HEADER, toHtmlLanguage } from "@/i18n/config";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

function getMetadataBase() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredOrigin) return undefined;
  try {
    return new URL(configuredOrigin);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "PetHealthAI",
    template: "%s",
  },
  description: "Continuous health intelligence for every pet.",
  keywords: ["宠物健康", "AI", "毫米波雷达", "PetHealthAI", "PetMind"],
  applicationName: "PetHealthAI",
  category: "technology",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerLanguage = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? null : (await headers()).get(LOCALE_HEADER);
  const lang = isSupportedLanguage(headerLanguage) ? headerLanguage : DEFAULT_LANGUAGE;

  return (
    <html lang={toHtmlLanguage(lang)} data-locale={lang}>
      <body className={`${dmSans.variable} ${instrumentSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
