import type { Lang } from "@/i18n/translations";

export const DEFAULT_LANGUAGE: Lang = "zh";
export const SYSTEM_FALLBACK_LANGUAGE: Lang = "en";
export const LOCALE_HEADER = "x-pethealthai-locale";

export const localeConfig = {
  zh: { segment: null, htmlLang: "zh-CN", label: "简体中文", shortLabel: "简中" },
  "zh-TW": { segment: "zh-tw", htmlLang: "zh-TW", label: "繁體中文", shortLabel: "繁中" },
  en: { segment: "en", htmlLang: "en", label: "English", shortLabel: "EN" },
} as const satisfies Record<Lang, { segment: string | null; htmlLang: string; label: string; shortLabel: string }>;

export const supportedLanguages = Object.keys(localeConfig) as Lang[];
export const localizedRouteSegments = supportedLanguages.flatMap((lang) => {
  const segment = localeConfig[lang].segment;
  return segment ? [segment] : [];
});

export function isSupportedLanguage(value: unknown): value is Lang {
  return typeof value === "string" && supportedLanguages.includes(value as Lang);
}

export function parseLocaleSegment(segment: string | null | undefined): Lang | null {
  if (!segment) return null;
  const normalized = segment.toLowerCase();
  if (normalized === "en") return "en";
  if (["zh-tw", "zh-hant", "zh-hk"].includes(normalized)) return "zh-TW";
  if (["zh", "zh-cn", "zh-hans"].includes(normalized)) return "zh";
  return null;
}

export function detectLanguage(languages: readonly string[]): Lang {
  let hasSystemLanguage = false;

  for (const raw of languages) {
    const normalized = raw.trim().replaceAll("_", "-").toLowerCase();
    if (!normalized || normalized === "*") continue;
    hasSystemLanguage = true;

    if (normalized.startsWith("zh")) {
      const traditional = ["tw", "hk", "mo", "hant"].some((marker) => normalized.includes(marker));
      return traditional ? "zh-TW" : "zh";
    }
    if (normalized.startsWith("en")) return "en";
  }

  return hasSystemLanguage ? SYSTEM_FALLBACK_LANGUAGE : DEFAULT_LANGUAGE;
}

export function stripLocalePrefix(pathname: string) {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (!parseLocaleSegment(firstSegment) || firstSegment.toLowerCase() === "zh") return pathname;

  const prefix = `/${firstSegment}`;
  const rest = pathname.slice(prefix.length);
  return rest || "/";
}

export function getLocalizedPath(pathname: string, lang: Lang) {
  const basePath = stripLocalePrefix(pathname);
  const segment = localeConfig[lang].segment;
  if (!segment) return basePath;
  return basePath === "/" ? `/${segment}` : `/${segment}${basePath}`;
}

export function toHtmlLanguage(lang: Lang) {
  return localeConfig[lang].htmlLang;
}
