"use client";

import Link from "next/link";
import { assetPath } from "@/lib/assetPath";

import { BrandMark } from "@/components/brand/BrandMark";
import { getContentPath, getSiteAreas } from "@/content/siteMap";
import { getLocalizedPath } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations } from "@/i18n/translations";

export function HomeFooter() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const areas = getSiteAreas(lang);

  return (
    <footer className="bg-[#22211f] px-5 pt-12 pb-8 text-white sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
      <div className="mx-auto max-w-[1480px]">
        <div className="border-b border-white/10 pb-10 sm:pb-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <BrandMark inverse href={getLocalizedPath("/", lang)} />
              <p className="display-heading display-heading--compact mt-8 max-w-3xl text-[clamp(2rem,4vw,4.6rem)] leading-[0.98] font-semibold tracking-[-0.055em] text-white">
                {t.footer.mission}
              </p>
            </div>
            <div className="lg:justify-self-end">
              <p className="max-w-xl text-sm leading-7 text-white/52">
                {localize(
                  lang,
                  "从产品体验到长期服务，浏览完整的网站栏目与即将开放的内容。",
                  "從產品體驗到長期服務，瀏覽完整的網站欄目與即將開放的內容。",
                  "Explore the complete website—from product experience to long-term care and services coming next.",
                )}
              </p>
              <Link
                href={getLocalizedPath("/explore", lang)}
                className="mt-6 inline-flex items-center rounded-full bg-[#dfcfad] px-5 py-3 text-xs font-bold text-[#302e2b] transition hover:-translate-y-0.5"
              >
                {localize(lang, "打开全站服务地图", "打開全站服務地圖", "Open the full site map")}
              </Link>
            </div>
          </div>

          <nav
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 text-sm sm:grid-cols-3 lg:mt-16 lg:grid-cols-5"
            aria-label={localize(lang, "页脚导航", "頁尾導覽", "Footer navigation")}
          >
            {areas.map((area) => (
              <div key={area.id} className="space-y-3 text-white/48">
                <Link
                  href={`${getLocalizedPath("/explore", lang)}#${area.id}`}
                  className="mb-5 block font-mono text-[11px] tracking-[0.1em] text-[#dfcfad] uppercase transition hover:text-white"
                >
                  {area.number} {area.title}
                </Link>
                {area.items.slice(0, 4).map((entry) => (
                  <Link
                    key={entry.slug}
                    href={getContentPath(entry.slug, lang)}
                    className="block transition hover:text-white"
                  >
                    {entry.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <p className="font-mono tracking-[0.14em] uppercase">
            mmWave · PetMind · {localize(lang, "连续守护", "持續守護", "Continuous care")}
          </p>
          <a href={assetPath("/imu-review/")} className="transition hover:text-white">
            {localize(lang, "视频 / IMU 标签审阅", "影片 / IMU 標籤審閱", "Video / IMU review")}
          </a>
        </div>
      </div>
    </footer>
  );
}
