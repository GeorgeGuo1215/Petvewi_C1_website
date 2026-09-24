"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/i18n/translations";
import { getLocalizedPath } from "./config";
import { useLanguagePreference } from "./useLanguagePreference";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLang = "zh" }: { children: React.ReactNode; initialLang?: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setPreference] = useLanguagePreference(initialLang);

  const setLang = React.useCallback(
    (next: Lang) => {
      setPreference(next);
      const nextPath = getLocalizedPath(pathname, next);
      const suffix = typeof window === "undefined" ? "" : `${window.location.search}${window.location.hash}`;
      router.replace(`${nextPath}${suffix}`, { scroll: false });
    },
    [pathname, router, setPreference],
  );

  const value = React.useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
