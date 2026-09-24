import { notFound } from "next/navigation";
import { TeamPage } from "@/features/team/TeamPage";
import { localizedRouteSegments, parseLocaleSegment } from "@/i18n/config";
import { createPageMetadata } from "@/i18n/metadata";

type LocalizedTeamPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedRouteSegments.map((locale) => ({ locale }));
}

async function getRouteLanguage(params: LocalizedTeamPageProps["params"]) {
  const { locale } = await params;
  const normalized = locale.toLowerCase();
  if (!localizedRouteSegments.some((segment) => segment === normalized)) notFound();
  return parseLocaleSegment(normalized) ?? notFound();
}

export async function generateMetadata({ params }: LocalizedTeamPageProps) {
  return createPageMetadata(await getRouteLanguage(params), "team");
}

export default async function LocalizedTeamPage({ params }: LocalizedTeamPageProps) {
  return <TeamPage initialLang={await getRouteLanguage(params)} />;
}
