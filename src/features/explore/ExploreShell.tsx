"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { getLocalizedPath } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize } from "@/i18n/translations";

export function ExploreHeader({ backTo = "/" }: { backTo?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#302e2b]/8 bg-[#f4f0e9]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href={getLocalizedPath(backTo, lang)}
            aria-label={localize(lang, "返回", "返回", "Back")}
            className="group inline-flex items-center gap-2 text-[13px] font-bold text-[#50665c] transition hover:text-[#302e2b]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#302e2b]/12 bg-white transition group-hover:-translate-x-1">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            <span className="hidden sm:inline">{localize(lang, "返回", "返回", "Back")}</span>
          </Link>
          <span className="h-5 w-px bg-[#302e2b]/12" />
          <BrandMark compact href={getLocalizedPath("/", lang)} />
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher lang={lang} onChange={setLang} />
          <Link
            href={`${getLocalizedPath("/", lang)}#beta`}
            className="hidden h-10 items-center gap-2 rounded-full bg-[#302e2b] px-5 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#514b41] sm:inline-flex"
          >
            {localize(lang, "申请内测", "申請內測", "Apply for beta")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function ExploreFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-[#22211f] px-5 py-8 text-xs text-white/55 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} PetHealthAI. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href={getLocalizedPath("/explore", lang)} className="transition hover:text-white">
            {localize(lang, "全站服务地图", "全站服務地圖", "Site map")}
          </Link>
          <Link href={getLocalizedPath("/team", lang)} className="transition hover:text-white">
            {localize(lang, "团队", "團隊", "Team")}
          </Link>
          <Link href={getLocalizedPath("/", lang)} className="transition hover:text-white">
            {localize(lang, "返回首页", "返回首頁", "Home")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
