import type { Metadata } from "next";
import { assetPath } from "@/lib/assetPath";
import { notFound } from "next/navigation";

import { getAllContentSlugs, getContentEntry } from "@/content/siteMap";
import { ContentDetailPage } from "@/features/explore/ContentDetailPage";
import { getLocalizedPath, localizedRouteSegments, parseLocaleSegment } from "@/i18n/config";

type LocalizedContentPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedRouteSegments.flatMap((locale) => getAllContentSlugs().map((slug) => ({ locale, slug })));
}

async function getRouteContext(params: LocalizedContentPageProps["params"]) {
  const { locale, slug } = await params;
  const normalized = locale.toLowerCase();
  if (!localizedRouteSegments.some((segment) => segment === normalized)) notFound();
  const lang = parseLocaleSegment(normalized) ?? notFound();
  const result = getContentEntry(lang, slug);
  if (!result) notFound();
  return { lang, slug, result };
}

export async function generateMetadata({ params }: LocalizedContentPageProps): Promise<Metadata> {
  const { lang, slug, result } = await getRouteContext(params);
  return {
    title: `${result.entry.title} | PetHealthAI`,
    description: result.entry.summary,
    alternates: {
      canonical: assetPath(getLocalizedPath(`/explore/${slug}`, lang)),
      languages: {
        "x-default": assetPath(`/explore/${slug}`),
        "zh-CN": assetPath(`/explore/${slug}`),
        "zh-TW": assetPath(getLocalizedPath(`/explore/${slug}`, "zh-TW")),
        en: assetPath(getLocalizedPath(`/explore/${slug}`, "en")),
      },
    },
  };
}

export default async function LocalizedContentPage({ params }: LocalizedContentPageProps) {
  const { lang, slug } = await getRouteContext(params);
  return <ContentDetailPage slug={slug} initialLang={lang} />;
}
