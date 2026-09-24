import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LANGUAGE,
  detectLanguage,
  getLocalizedPath,
  isSupportedLanguage,
  localizedRouteSegments,
  LOCALE_HEADER,
  parseLocaleSegment,
  toHtmlLanguage,
} from "@/i18n/config";

const LANGUAGE_COOKIE = "pethealthai-lang";
const LOCALIZED_BASE_PATHS = new Set(["/", "/team", "/explore"]);

function supportsLocalizedRoute(pathname: string) {
  return LOCALIZED_BASE_PATHS.has(pathname) || pathname.startsWith("/explore/");
}

function parseAcceptLanguage(value: string | null) {
  if (!value) return [];

  return value
    .split(",")
    .map((entry, index) => {
      const [language, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return { language, quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ language }) => Boolean(language) && language !== "*")
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
    .map(({ language }) => language);
}

function getPreferredLanguage(request: NextRequest) {
  const cookieLanguage = request.cookies.get(LANGUAGE_COOKIE)?.value;
  if (isSupportedLanguage(cookieLanguage)) return cookieLanguage;
  return detectLanguage(parseAcceptLanguage(request.headers.get("accept-language")));
}

function setLanguageResponseHeaders(response: NextResponse, language: ReturnType<typeof getPreferredLanguage>) {
  response.headers.set("Content-Language", toHtmlLanguage(language));
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  const hasLocalePrefix = Boolean(firstSegment && localizedRouteSegments.some((segment) => segment === firstSegment));
  const routeLanguage = hasLocalePrefix ? parseLocaleSegment(firstSegment) : null;
  const preferredLanguage = getPreferredLanguage(request);

  if (!hasLocalePrefix && supportsLocalizedRoute(pathname) && preferredLanguage !== DEFAULT_LANGUAGE) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getLocalizedPath(pathname, preferredLanguage);
    return setLanguageResponseHeaders(NextResponse.redirect(redirectUrl), preferredLanguage);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, routeLanguage ?? DEFAULT_LANGUAGE);

  return setLanguageResponseHeaders(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
    routeLanguage ?? DEFAULT_LANGUAGE,
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
