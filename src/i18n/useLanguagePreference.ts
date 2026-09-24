"use client";

import * as React from "react";
import type { Lang } from "@/i18n/translations";
import { detectLanguage, isSupportedLanguage, toHtmlLanguage } from "./config";

const STORAGE_KEY = "pethealthai-lang";
const LEGACY_STORAGE_KEY = "pethealai-lang";
const COOKIE_KEY = "pethealthai-lang";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function detectFromBrowser(): Lang {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectLanguage(languages);
}

function syncDocumentLanguage(lang: Lang) {
  document.documentElement.lang = toHtmlLanguage(lang);
  document.documentElement.dir = "ltr";
  document.documentElement.dataset.locale = lang;
}

function readCookie(): Lang | null {
  try {
    const value = document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${COOKIE_KEY}=`))
      ?.split("=")[1];
    return isSupportedLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

function readSavedLanguage(): Lang | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(saved)) return saved;

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isSupportedLanguage(legacy)) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacy;
    }
  } catch {
    // Storage can be unavailable in private browsing or strict privacy modes.
  }
  return readCookie();
}

function persistLanguage(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // The cookie remains as a persistence fallback when localStorage is blocked.
  }

  try {
    document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
  } catch {
    // A blocked cookie should not prevent an in-memory language change.
  }
}

export function useLanguagePreference(initialLang: Lang): [Lang, (lang: Lang) => void] {
  const [lang, setLangState] = React.useState<Lang>(initialLang);

  React.useEffect(() => {
    const applyLanguage = (next: Lang) => {
      setLangState(next);
      syncDocumentLanguage(next);
    };

    applyLanguage(initialLang);

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      applyLanguage(isSupportedLanguage(event.newValue) ? event.newValue : detectFromBrowser());
    };
    const syncBrowserPreference = () => {
      if (!readSavedLanguage()) applyLanguage(detectFromBrowser());
    };

    window.addEventListener("storage", syncAcrossTabs);
    window.addEventListener("languagechange", syncBrowserPreference);
    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
      window.removeEventListener("languagechange", syncBrowserPreference);
    };
  }, [initialLang]);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    syncDocumentLanguage(next);
    persistLanguage(next);
  }, []);

  return [lang, setLang];
}
