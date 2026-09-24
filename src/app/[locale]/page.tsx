import { notFound } from "next/navigation";
import { HomePage } from "@/features/home/HomePage";
import { localizedRouteSegments, parseLocaleSegment } from "@/i18n/config";
import { createPageMetadata } from "@/i18n/metadata";

type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedRouteSegments.map((locale) => ({ locale }));
}

async function getRouteLanguage(params: LocalizedPageProps["params"]) {
  const { locale } = await params;
  const normalized = locale.toLowerCase();
  if (!localizedRouteSegments.some((segment) => segment === normalized)) notFound();
  return parseLocaleSegment(normalized) ?? notFound();
}

export async function generateMetadata({ params }: LocalizedPageProps) {
  return createPageMetadata(await getRouteLanguage(params), "home");
}

export default async function LocalizedHomePage({ params }: LocalizedPageProps) {
  return <HomePage initialLang={await getRouteLanguage(params)} />;
}
