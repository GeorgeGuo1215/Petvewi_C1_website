"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import * as React from "react";

import { localeConfig, supportedLanguages } from "@/i18n/config";
import type { Lang } from "@/i18n/translations";

const accessibleLabels: Record<Lang, string> = {
  zh: "选择语言",
  "zh-TW": "選擇語言",
  en: "Choose language",
};

type LanguageSwitcherProps = {
  lang: Lang;
  onChange: (lang: Lang) => void;
  fullWidth?: boolean;
  onSelect?: () => void;
};

export function LanguageSwitcher({ lang, onChange, fullWidth = false, onSelect }: LanguageSwitcherProps) {
  const activeLocale = localeConfig[lang];

  const selectLanguage = (next: Lang) => {
    if (next !== lang) onChange(next);
    onSelect?.();
  };

  return (
    <Listbox value={lang} onChange={selectLanguage}>
      <ListboxButton
        aria-label={accessibleLabels[lang]}
        title={activeLocale.label}
        className={`group inline-flex h-10 items-center rounded-full border border-[#302e2b]/12 bg-white/75 px-3.5 text-[#40564d] backdrop-blur-xl transition duration-200 hover:border-[#302e2b]/25 hover:bg-white hover:text-[#302e2b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#655d50]/18 data-open:border-[#302e2b]/24 data-open:bg-white ${fullWidth ? "w-full justify-between" : "min-w-[104px] gap-2"}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Globe2 className="h-4 w-4 shrink-0 text-[#557066]" aria-hidden="true" />
          <span className="truncate text-[13px] font-semibold">
            {fullWidth ? activeLocale.label : activeLocale.shortLabel}
          </span>
        </span>
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-open:rotate-180"
          aria-hidden="true"
        />
      </ListboxButton>

      <ListboxOptions
        anchor="bottom end"
        transition
        className="z-[90] w-[var(--button-width)] max-w-[calc(100vw-2rem)] min-w-[176px] origin-top overflow-hidden rounded-[18px] border border-[#302e2b]/10 bg-[#f8f6f1]/98 p-1.5 shadow-[0_18px_48px_rgba(48,46,43,0.16)] backdrop-blur-2xl transition duration-150 ease-out [--anchor-gap:7px] focus:outline-none data-closed:translate-y-[-3px] data-closed:scale-[0.98] data-closed:opacity-0"
      >
        <div className="space-y-0.5">
          {supportedLanguages.map((option) => {
            const locale = localeConfig[option];
            return (
              <ListboxOption
                key={option}
                value={option}
                lang={locale.htmlLang}
                className="group flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-[13px] px-3.5 text-sm font-semibold text-[#52675e] transition outline-none data-focus:bg-[#e5ebe5] data-focus:text-[#302e2b] data-selected:text-[#302e2b]"
              >
                <span className="truncate">{locale.label}</span>
                <Check
                  className="h-4 w-4 shrink-0 text-[#655d50] opacity-0 transition group-data-selected:opacity-100"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </ListboxOption>
            );
          })}
        </div>
      </ListboxOptions>
    </Listbox>
  );
}
