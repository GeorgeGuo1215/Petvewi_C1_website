"use client";

import { Activity, ArrowUpRight, Building2, Headphones, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSiteAreas, type SiteAreaId } from "@/content/siteMap";
import { getLocalizedPath } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize } from "@/i18n/translations";

const ICONS = {
  product: Activity,
  commerce: ShoppingBag,
  support: Headphones,
  company: Building2,
  community: Sparkles,
} satisfies Record<SiteAreaId, typeof Activity>;

const TONES = {
  product: "bg-[#302e2b] text-white",
  commerce: "bg-[#efe4d7] text-[#302e2b]",
  support: "bg-[#e5e5db] text-[#302e2b]",
  company: "bg-[#e6e1d7] text-[#302e2b]",
  community: "bg-[#e4d5c5] text-[#302e2b]",
} satisfies Record<SiteAreaId, string>;

export function ContentGatewaySection() {
  const { lang } = useLanguage();
  const areas = getSiteAreas(lang);

  return (
    <section id="explore" className="relative scroll-mt-[76px] overflow-hidden bg-[#f5f3ed] py-16 sm:py-24 lg:py-32">
      <div className="paper-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Eyebrow>{localize(lang, "完整服务版图 / 04", "完整服務版圖 / 04", "Complete service map / 04")}</Eyebrow>
            <h2 className="display-heading display-heading--wide max-w-[1050px] text-[clamp(2.8rem,7vw,7.2rem)] leading-[0.88] font-semibold tracking-[-0.075em] whitespace-pre-line">
              {localize(
                lang,
                "从产品开始，\n把长期陪伴补完整。",
                "從產品開始，\n把長期陪伴補完整。",
                "Start with product.\nBuild complete care.",
              )}
            </h2>
          </div>
          <div className="pb-2">
            <p className="editorial-copy font-display max-w-xl text-2xl leading-tight text-[#587267] italic sm:text-3xl">
              {localize(
                lang,
                "已有的继续打磨，缺失的先留好位置。",
                "已有的繼續打磨，缺失的先留好位置。",
                "Refine what exists. Prepare what comes next.",
              )}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5d7067] sm:text-base sm:leading-8">
              {localize(
                lang,
                "产品体验、购买零售、服务支持、品牌公司与内容社区已经整理为五条清晰路径。进入服务地图，可查看当前完成度与后续内容接口。",
                "產品體驗、購買零售、服務支持、品牌公司與內容社區已經整理為五條清晰路徑。進入服務地圖，可查看當前完成度與後續內容接口。",
                "Product, commerce, support, company and community now form five clear paths. Open the service map to see what is live and what is ready to grow.",
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-2 lg:grid-cols-6">
          {areas.map((area, index) => {
            const Icon = ICONS[area.id];
            const readyCount = area.items.filter((entry) => entry.status === "ready").length;
            const preparedCount = area.items.length - readyCount;
            const dark = area.id === "product";
            return (
              <motion.article
                key={area.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className={`overflow-hidden rounded-[30px] border border-[#302e2b]/8 ${TONES[area.id]} ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}
              >
                <Link
                  href={`${getLocalizedPath("/explore", lang)}#${area.id}`}
                  className="group flex h-full min-h-[360px] flex-col p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${dark ? "bg-[#dfcfad] text-[#302e2b]" : "border border-[#302e2b]/10 bg-white/50 text-[#655d50]"}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={`font-mono text-[11px] tracking-[0.12em] ${dark ? "text-[#dfcfad]" : "text-[#61736b]"}`}
                    >
                      {area.number}
                    </span>
                  </div>
                  <div className="mt-12 flex-1">
                    <p
                      className={`font-mono text-[10px] font-bold tracking-[0.12em] uppercase ${dark ? "text-white/50" : "text-[#657970]"}`}
                    >
                      {area.kicker}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{area.title}</h3>
                    <div
                      className={`mt-7 flex flex-wrap gap-2 text-[11px] font-bold ${dark ? "text-white/72" : "text-[#50665c]"}`}
                    >
                      <span className={`rounded-full px-3 py-1.5 ${dark ? "bg-white/9" : "bg-white/55"}`}>
                        {localize(lang, "已有", "已有", "Live")} {readyCount}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 ${dark ? "border border-white/12" : "border border-[#302e2b]/10"}`}
                      >
                        {localize(lang, "待完善", "待完善", "Prepared")} {preparedCount}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`mt-8 flex items-center justify-between border-t pt-5 ${dark ? "border-white/12" : "border-[#302e2b]/10"}`}
                  >
                    <span className="text-xs font-bold">{localize(lang, "查看栏目", "查看欄目", "Explore area")}</span>
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full transition group-hover:rotate-45 ${dark ? "bg-[#dfcfad] text-[#302e2b]" : "bg-[#302e2b] text-white"}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
