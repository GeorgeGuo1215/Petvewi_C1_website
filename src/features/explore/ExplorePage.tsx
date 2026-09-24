"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Check,
  CircleDashed,
  Headphones,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { getContentPath, getSiteAreas, getStatusLabel, type ContentStatus, type SiteAreaId } from "@/content/siteMap";
import { getLocalizedPath } from "@/i18n/config";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageProvider";
import { localize, type Lang } from "@/i18n/translations";

import { ExploreFooter, ExploreHeader } from "./ExploreShell";

const AREA_ICONS = {
  product: Activity,
  commerce: ShoppingBag,
  support: Headphones,
  company: Building2,
  community: Sparkles,
} satisfies Record<SiteAreaId, typeof Activity>;

const AREA_TONES = {
  product: "bg-[#e5e5db]",
  commerce: "bg-[#efe4d7]",
  support: "bg-[#e7e6dd]",
  company: "bg-[#e6e1d7]",
  community: "bg-[#e4d5c5]",
} satisfies Record<SiteAreaId, string>;

function StatusPill({ status }: { status: ContentStatus }) {
  const { lang } = useLanguage();
  const ready = status === "ready";
  const foundation = status === "foundation";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.08em] uppercase ${
        ready
          ? "bg-[#302e2b] text-white"
          : foundation
            ? "border border-[#302e2b]/12 bg-white/65 text-[#655d50]"
            : "border border-[#302e2b]/10 bg-transparent text-[#6a7b73]"
      }`}
    >
      {ready ? <Check className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
      {getStatusLabel(lang, status)}
    </span>
  );
}

function ExplorePageContent() {
  const { lang } = useLanguage();
  const areas = getSiteAreas(lang);
  const allItems = areas.flatMap((area) => area.items);
  const counts = {
    ready: allItems.filter((entry) => entry.status === "ready").length,
    foundation: allItems.filter((entry) => entry.status === "foundation").length,
    planned: allItems.filter((entry) => entry.status === "planned").length,
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f0e9] text-[#302e2b]">
      <ExploreHeader />

      <section className="relative overflow-hidden bg-[#282724] px-5 pt-28 pb-16 text-white sm:px-8 sm:pt-36 sm:pb-24 lg:px-12 lg:pt-44 lg:pb-32">
        <div className="paper-grid-dark absolute inset-0 opacity-30" />
        <div className="absolute top-20 -right-36 h-[560px] w-[560px] rounded-full border border-[#dfcfad]/16" />
        <div className="absolute top-44 -right-6 h-[330px] w-[330px] rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-[16%] h-72 w-72 rounded-full bg-[#655d50]/25 blur-[120px]" />

        <div className="relative mx-auto max-w-[1480px]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Eyebrow light>{localize(lang, "全站服务地图 / 04", "全站服務地圖 / 04", "Site map / 04")}</Eyebrow>
            <h1 className="display-heading display-heading--team max-w-[1220px] text-[clamp(3.8rem,9vw,9.4rem)] leading-[0.84] font-semibold tracking-[-0.08em]">
              {localize(
                lang,
                "从一枚项圈，\n到完整的陪伴。",
                "從一枚項圈，\n到完整的陪伴。",
                "From one collar\nto complete care.",
              )}
            </h1>
            <div className="mt-8 grid gap-7 sm:mt-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <p className="editorial-copy font-display max-w-3xl text-2xl leading-tight text-white/62 italic sm:text-4xl">
                {localize(
                  lang,
                  "产品、购买、支持、公司与社区，已经整理成一套可持续生长的内容结构。",
                  "產品、購買、支持、公司與社區，已經整理成一套可持續生長的內容結構。",
                  "Product, commerce, support, company and community—organized as one system built to grow.",
                )}
              </p>
              <p className="max-w-xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8 lg:justify-self-end">
                {localize(
                  lang,
                  "从了解产品到日常使用，在这里找到指南与支持。尚在准备中的栏目会明确标注，正式内容将逐步开放。",
                  "從了解產品到日常使用，在這裡找到指南與支持。尚在準備中的欄目會明確標註，正式內容將逐步開放。",
                  "Find guidance and support from your first look to everyday use. Sections still in preparation are clearly marked and will open as details are confirmed.",
                )}
              </p>
            </div>
          </motion.div>

          <div className="mt-12 grid overflow-hidden rounded-[28px] border border-white/12 bg-white/6 backdrop-blur-sm sm:mt-16 sm:grid-cols-3">
            {[
              [counts.ready, localize(lang, "已有内容", "已有內容", "Live")],
              [counts.foundation, localize(lang, "基础已具备", "基礎已具備", "Foundation ready")],
              [counts.planned, localize(lang, "入口已预留", "入口已預留", "Planned")],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-6 py-6 sm:px-8 sm:py-8 ${index > 0 ? "border-t border-white/10 sm:border-t-0 sm:border-l" : ""}`}
              >
                <p className="font-mono text-4xl font-semibold tracking-[-0.08em] text-[#dfcfad] sm:text-5xl">
                  {value}
                </p>
                <p className="mt-2 text-xs font-semibold tracking-[0.1em] text-white/58 uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav
        className="sticky top-[76px] z-30 border-b border-[#302e2b]/8 bg-[#f4f0e9]/92 backdrop-blur-2xl"
        aria-label={localize(lang, "服务分类", "服務分類", "Service categories")}
      >
        <div className="mx-auto flex max-w-[1480px] gap-2 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12">
          {areas.map((area) => (
            <a
              key={area.id}
              href={`#${area.id}`}
              className="shrink-0 rounded-full border border-[#302e2b]/10 bg-white/65 px-4 py-2 text-xs font-bold text-[#52675e] transition hover:border-[#302e2b]/25 hover:text-[#302e2b]"
            >
              {area.number} {area.title}
            </a>
          ))}
        </div>
      </nav>

      {areas.map((area, areaIndex) => {
        const Icon = AREA_ICONS[area.id];
        return (
          <section
            key={area.id}
            id={area.id}
            className={`scroll-mt-[132px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 ${areaIndex % 2 === 0 ? "bg-[#f5f3ed]" : "bg-[#ebe7de]"}`}
          >
            <div className="mx-auto max-w-[1480px]">
              <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.72fr]">
                <div>
                  <Eyebrow>
                    {area.number} / {area.kicker}
                  </Eyebrow>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#302e2b]/8 sm:h-16 sm:w-16 ${AREA_TONES[area.id]}`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <h2 className="display-heading display-heading--compact text-[clamp(2.8rem,6vw,6rem)] leading-[0.92] font-semibold tracking-[-0.065em]">
                      {area.title}
                    </h2>
                  </div>
                </div>
                <p className="max-w-xl text-sm leading-7 text-[#576b62] sm:text-base sm:leading-8 lg:justify-self-end">
                  {area.description}
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-2 xl:grid-cols-3">
                {area.items.map((entry, index) => (
                  <motion.article
                    key={entry.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: Math.min(index * 0.045, 0.24) }}
                  >
                    <Link
                      href={getContentPath(entry.slug, lang)}
                      className="group flex h-full min-h-[250px] flex-col rounded-[28px] border border-[#302e2b]/8 bg-[#fbfaf6] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#302e2b]/18 hover:shadow-[0_22px_60px_rgba(48,46,43,0.08)] sm:p-7"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <StatusPill status={entry.status} />
                        <span className="font-mono text-[10px] tracking-[0.1em] text-[#74847d]">
                          {area.number}.{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-8 text-2xl font-semibold tracking-[-0.045em] text-[#302e2b]">{entry.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-[#61736b]">{entry.summary}</p>
                      <div className="mt-7 flex items-center justify-between border-t border-[#302e2b]/9 pt-4 text-xs font-bold text-[#655d50]">
                        <span>{localize(lang, "查看内容结构", "查看內容結構", "View content structure")}</span>
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-[#302e2b]/12 transition group-hover:rotate-45 group-hover:bg-[#302e2b] group-hover:text-white">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="relative overflow-hidden bg-[#dfcfad] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="paper-grid absolute inset-0 opacity-35" />
        <div className="relative mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-9 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>{localize(lang, "持续生长", "持續生長", "Built to grow")}</Eyebrow>
            <h2 className="display-heading display-heading--compact max-w-5xl text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.07em]">
              {localize(
                lang,
                "入口已经准备好，\n内容可以从容长出来。",
                "入口已經準備好，\n內容可以從容長出來。",
                "The structure is ready.\nContent can grow into it.",
              )}
            </h2>
          </div>
          <Link
            href={getLocalizedPath("/", lang)}
            className="group inline-flex h-14 items-center gap-4 rounded-full bg-[#302e2b] px-6 text-sm font-bold text-white"
          >
            {localize(lang, "返回产品首页", "返回產品首頁", "Return to product")}
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </Link>
        </div>
      </section>

      <ExploreFooter />
    </main>
  );
}

export function ExplorePage({ initialLang = "zh" }: { initialLang?: Lang }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <MotionConfig reducedMotion="user">
        <ExplorePageContent />
      </MotionConfig>
    </LanguageProvider>
  );
}
