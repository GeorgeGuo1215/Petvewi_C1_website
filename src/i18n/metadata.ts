import type { Metadata } from "next";
import { assetPath } from "@/lib/assetPath";

import type { Lang } from "@/i18n/translations";

import { getLocalizedPath, localeConfig } from "./config";

type PageKey = "home" | "team" | "explore";

const pageMetadata: Record<PageKey, Record<Lang, { title: string; description: string; keywords: string[] }>> = {
  home: {
    zh: {
      title: "PetHealthAI｜24 小时宠物健康守护",
      description: "毫米波雷达与 PetMind 多模态 AI 驱动的宠物健康系统，连续理解心率、呼吸、行为与位置变化。",
      keywords: ["宠物健康", "智能宠物项圈", "毫米波雷达", "宠物 AI", "PetMind"],
    },
    "zh-TW": {
      title: "PetHealthAI｜24 小時寵物健康守護",
      description: "毫米波雷達與 PetMind 多模態 AI 驅動的寵物健康系統，持續理解心率、呼吸、行為與位置變化。",
      keywords: ["寵物健康", "智慧寵物項圈", "毫米波雷達", "寵物 AI", "PetMind"],
    },
    en: {
      title: "PetHealthAI | Continuous care for every pet",
      description:
        "A pet health system powered by mmWave sensing and PetMind multimodal AI, built to understand changes in heart rate, breathing, behavior and location.",
      keywords: ["pet health", "smart pet collar", "mmWave sensing", "pet AI", "PetMind"],
    },
  },
  team: {
    zh: {
      title: "团队与研究网络｜PetHealthAI",
      description: "认识 PetHealthAI 跨学科团队：动物医学、毫米波工程、人工智能与人本体验设计。",
      keywords: ["PetHealthAI 团队", "动物医学", "毫米波工程", "宠物健康 AI"],
    },
    "zh-TW": {
      title: "團隊與研究網絡｜PetHealthAI",
      description: "認識 PetHealthAI 跨學科團隊：動物醫學、毫米波工程、人工智慧與人本體驗設計。",
      keywords: ["PetHealthAI 團隊", "動物醫學", "毫米波工程", "寵物健康 AI"],
    },
    en: {
      title: "Team & research network | PetHealthAI",
      description:
        "Meet the interdisciplinary PetHealthAI team spanning veterinary medicine, mmWave engineering, artificial intelligence and humane experience design.",
      keywords: ["PetHealthAI team", "veterinary medicine", "mmWave engineering", "pet health AI"],
    },
  },
  explore: {
    zh: {
      title: "产品、购买与服务地图｜PetHealthAI",
      description: "浏览 PetHealthAI 的产品体验、购买零售、服务支持、品牌公司与内容社区栏目，以及即将开放的服务入口。",
      keywords: ["PetHealthAI 产品", "宠物健康服务", "购买支持", "宠物社区"],
    },
    "zh-TW": {
      title: "產品、購買與服務地圖｜PetHealthAI",
      description: "瀏覽 PetHealthAI 的產品體驗、購買零售、服務支持、品牌公司與內容社區欄目，以及即將開放的服務入口。",
      keywords: ["PetHealthAI 產品", "寵物健康服務", "購買支持", "寵物社區"],
    },
    en: {
      title: "Product, purchase & service map | PetHealthAI",
      description:
        "Explore PetHealthAI product experiences, commerce, support, company and community content, including services prepared for future release.",
      keywords: ["PetHealthAI product", "pet health service", "purchase support", "pet community"],
    },
  },
};

const basePaths: Record<PageKey, string> = {
  home: "/",
  team: "/team",
  explore: "/explore",
};

const openGraphLocales: Record<Lang, string> = {
  zh: "zh_CN",
  "zh-TW": "zh_TW",
  en: "en_US",
};

export function createPageMetadata(lang: Lang, page: PageKey): Metadata {
  const content = pageMetadata[page][lang];
  const basePath = basePaths[page];
  const canonical = assetPath(getLocalizedPath(basePath, lang));

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: {
        "x-default": assetPath(basePath),
        "zh-CN": assetPath(basePath),
        "zh-TW": assetPath(getLocalizedPath(basePath, "zh-TW")),
        en: assetPath(getLocalizedPath(basePath, "en")),
      },
    },
    openGraph: {
      type: "website",
      siteName: "PetHealthAI",
      title: content.title,
      description: content.description,
      url: canonical,
      locale: openGraphLocales[lang],
      alternateLocale: Object.entries(openGraphLocales)
        .filter(([locale]) => locale !== lang)
        .map(([, locale]) => locale),
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
    other: {
      "content-language": localeConfig[lang].htmlLang,
    },
  };
}
