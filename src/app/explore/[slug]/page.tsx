import type { Metadata } from "next";
import { assetPath } from "@/lib/assetPath";
import { notFound } from "next/navigation";

import { getAllContentSlugs, getContentEntry } from "@/content/siteMap";
import { ContentDetailPage } from "@/features/explore/ContentDetailPage";

type ContentPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllContentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getContentEntry("zh", slug);
  if (!result) return {};
  return {
    title: `${result.entry.title}｜PetHealthAI`,
    description: result.entry.summary,
    alternates: { canonical: assetPath(`/explore/${slug}`) },
  };
}

export default async function Page({ params }: ContentPageProps) {
  const { slug } = await params;
  if (!getContentEntry("zh", slug)) notFound();
  return <ContentDetailPage slug={slug} initialLang="zh" />;
}
