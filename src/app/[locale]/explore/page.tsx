import { notFound } from "next/navigation";

import { ExplorePage } from "@/features/explore/ExplorePage";
import { localizedRouteSegments, parseLocaleSegment } from "@/i18n/config";
import { createPageMetadata } from "@/i18n/metadata";

type LocalizedExplorePageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedRouteSegments.map((locale) => ({ locale }));
}

async function getRouteLanguage(params: LocalizedExplorePageProps["params"]) {
  const { locale } = await params;
  const normalized = locale.toLowerCase();
  if (!localizedRouteSegments.some((segment) => segment === normalized)) notFound();
  return parseLocaleSegment(normalized) ?? notFound();
}

export async function generateMetadata({ params }: LocalizedExplorePageProps) {
  return createPageMetadata(await getRouteLanguage(params), "explore");
}

export default async function LocalizedExplorePage({ params }: LocalizedExplorePageProps) {
  return <ExplorePage initialLang={await getRouteLanguage(params)} />;
}
