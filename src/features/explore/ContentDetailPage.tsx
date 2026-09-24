"use client";

import { ArrowUpRight, Check, CircleDashed, Database, FileText, PanelsTopLeft, PlugZap } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  getContentEntry,
  getContentPath,
  getExistingContentPath,
  getStatusLabel,
  type SiteAreaId,
} from "@/content/siteMap";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageProvider";
import { localize, type Lang } from "@/i18n/translations";

import { ExploreFooter, ExploreHeader } from "./ExploreShell";

const AREA_COLORS = {
  product: "#e5e5db",
  commerce: "#efe4d7",
  support: "#e7e6dd",
  company: "#e6e1d7",
  community: "#e4d5c5",
} satisfies Record<SiteAreaId, string>;

function getContentModules(lang: Lang, area: SiteAreaId) {
  const modules = {
    product: [
      ["内容概览", "內容概覽", "Overview"],
      ["使用体验与流程", "使用體驗與流程", "Experience & flow"],
      ["规格、提示与问答", "規格、提示與問答", "Specs, notes & FAQ"],
    ],
    commerce: [
      ["商品或方案信息", "商品或方案信息", "Offer information"],
      ["购买与查询流程", "購買與查詢流程", "Purchase & lookup flow"],
      ["配送、服务与政策", "配送、服務與政策", "Delivery, service & policies"],
    ],
    support: [
      ["支持内容摘要", "支持內容摘要", "Support overview"],
      ["自助处理流程", "自助處理流程", "Self-service flow"],
      ["人工服务入口", "人工服務入口", "Human support"],
    ],
    company: [
      ["主题介绍", "主題介紹", "Introduction"],
      ["事实、时间线与资料", "事實、時間線與資料", "Facts, timeline & materials"],
      ["联系与参与方式", "聯繫與參與方式", "Contact & participation"],
    ],
    community: [
      ["精选内容", "精選內容", "Featured content"],
      ["分类与更新", "分類與更新", "Categories & updates"],
      ["参与与分享", "參與與分享", "Participate & share"],
    ],
  } satisfies Record<SiteAreaId, [string, string, string][]>;

  return modules[area].map(([zh, zhTw, en]) => localize(lang, zh, zhTw, en));
}

function getIntegrationLabels(lang: Lang, area: SiteAreaId) {
  const labels = {
    product: [
      ["产品内容与媒体", "產品內容與媒體", "Product content & media"],
      ["规格与版本数据", "規格與版本數據", "Specification data"],
      ["App 流程与截图", "App 流程與截圖", "App flows & captures"],
    ],
    commerce: [
      ["商品与套餐目录", "商品與套餐目錄", "Catalog & plans"],
      ["订单与物流服务", "訂單與物流服務", "Orders & fulfillment"],
      ["采购与咨询表单", "採購與諮詢表單", "Purchase inquiry forms"],
    ],
    support: [
      ["说明书与政策内容", "說明書與政策內容", "Manuals & policies"],
      ["维修与工单系统", "維修與工單系統", "Repairs & tickets"],
      ["客服与帮助中心", "客服與幫助中心", "Support & help center"],
    ],
    company: [
      ["公司内容管理", "公司內容管理", "Company CMS"],
      ["新闻与职位数据", "新聞與職位數據", "News & careers data"],
      ["联系与合作线索", "聯繫與合作線索", "Contact & partnership leads"],
    ],
    community: [
      ["文章与故事内容", "文章與故事內容", "Stories & articles"],
      ["活动与报名数据", "活動與報名數據", "Events & registration"],
      ["社媒与订阅渠道", "社媒與訂閱渠道", "Social & subscriptions"],
    ],
  } satisfies Record<SiteAreaId, [string, string, string][]>;

  return labels[area].map(([zh, zhTw, en]) => localize(lang, zh, zhTw, en));
}

function ContentDetailPageInner({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const result = getContentEntry(lang, slug);
  if (!result) return null;

  const { area, entry } = result;
  const modules = getContentModules(lang, area.id);
  const integrations = getIntegrationLabels(lang, area.id);
  const siblings = area.items.filter((candidate) => candidate.slug !== entry.slug).slice(0, 3);
  const isReady = entry.status === "ready";
  const isFoundation = entry.status === "foundation";

  const statusCopy = isReady
    ? localize(
        lang,
        "该主题已有正式内容。此页面作为统一入口，也保留了后续扩展的位置。",
        "該主題已有正式內容。此頁面作為統一入口，也保留了後續擴展的位置。",
        "This topic already has live content. This page is its unified entry point and leaves room for future expansion.",
      )
    : isFoundation
      ? localize(
          lang,
          "已有基础展示，但完整流程、政策或资料仍待补充；页面结构与内容接口已经准备好。",
          "已有基礎展示，但完整流程、政策或資料仍待補充；頁面結構與內容接口已經準備好。",
          "A foundation is visible, while full flows, policies or materials remain to be added. The page structure and content boundary are ready.",
        )
      : localize(
          lang,
          "入口与页面结构已经就绪。正式资料确认前，这里不会展示未经验证的政策、功能或承诺。",
          "入口與頁面結構已經就緒。正式資料確認前，這裡不會展示未經驗證的政策、功能或承諾。",
          "The route and page structure are ready. Until materials are confirmed, no unverified policies, features or promises are shown here.",
        );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f0e9] text-[#302e2b]">
      <ExploreHeader backTo="/explore" />

      <section
        className="relative overflow-hidden px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24 lg:px-12 lg:pt-44 lg:pb-28"
        style={{ backgroundColor: AREA_COLORS[area.id] }}
      >
        <div className="paper-grid absolute inset-0 opacity-45" />
        <div className="absolute top-28 -right-32 h-[500px] w-[500px] rounded-full border border-[#302e2b]/10" />
        <div className="absolute top-48 -right-2 h-[300px] w-[300px] rounded-full border border-[#302e2b]/8" />
        <div className="relative mx-auto max-w-[1480px]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>
                {area.number} / {area.title}
              </Eyebrow>
              <span
                className={`mb-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.1em] uppercase ${isReady ? "bg-[#302e2b] text-white" : "border border-[#302e2b]/12 bg-white/55 text-[#496158]"}`}
              >
                {isReady ? <Check className="h-3 w-3" /> : <CircleDashed className="h-3 w-3" />}
                {getStatusLabel(lang, entry.status)}
              </span>
            </div>
            <h1 className="display-heading display-heading--team max-w-[1180px] text-[clamp(3.8rem,9vw,9.5rem)] leading-[0.84] font-semibold tracking-[-0.08em]">
              {entry.title}
            </h1>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <p className="editorial-copy font-display max-w-3xl text-2xl leading-tight text-[#655d50] italic sm:text-4xl">
                {entry.summary}
              </p>
              <div className="max-w-xl rounded-[26px] border border-[#302e2b]/10 bg-white/55 p-6 backdrop-blur-sm lg:justify-self-end">
                <p className="text-sm leading-7 text-[#52675e]">{statusCopy}</p>
                {entry.existingHref && (
                  <Link
                    href={getExistingContentPath(entry.existingHref, lang)}
                    className="group mt-5 inline-flex items-center gap-3 text-sm font-bold text-[#302e2b]"
                  >
                    {localize(lang, "查看当前内容", "查看當前內容", "View current content")}
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#302e2b] text-white transition group-hover:rotate-45">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f7f5ef] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <Eyebrow>{localize(lang, "即将带来", "即將帶來", "Coming next")}</Eyebrow>
              <h2 className="display-heading display-heading--compact max-w-5xl text-[clamp(2.8rem,6vw,6.3rem)] leading-[0.92] font-semibold tracking-[-0.065em]">
                {localize(
                  lang,
                  "你需要的信息，\n正在逐步完善。",
                  "你需要的資訊，\n正在逐步完善。",
                  "More guidance,\none step at a time.",
                )}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5c7067] sm:text-base sm:leading-8 lg:justify-self-end">
              {localize(
                lang,
                "我们正在整理相关介绍、使用指南与服务说明。已开放的内容可通过上方入口查看。",
                "我們正在整理相關介紹、使用指南與服務說明。已開放的內容可透過上方入口查看。",
                "Product information, guidance and service details are being prepared. Follow the link above to explore what is already available.",
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-3">
            {modules.map((module, index) => {
              const Icon = [FileText, PanelsTopLeft, Database][index];
              return (
                <motion.article
                  key={module}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="min-h-[300px] rounded-[30px] border border-[#302e2b]/8 bg-[#fbfaf6] p-7 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e2e9e3] text-[#655d50]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[11px] text-[#72837b]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold tracking-[-0.045em]">{module}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#63756d]">
                    {localize(
                      lang,
                      "相关内容准备中，确认后将在此发布。",
                      "相關內容準備中，確認後將在此發布。",
                      "Details are being prepared and will be published here once confirmed.",
                    )}
                  </p>
                  <div className="mt-8 h-px bg-[#302e2b]/10" />
                  <p className="mt-4 font-mono text-[10px] tracking-[0.1em] text-[#718078] uppercase">
                    {localize(lang, "敬请期待", "敬請期待", "Coming soon")}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#282724] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="paper-grid-dark absolute inset-0 opacity-25" />
        <div className="relative mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#dfcfad] text-[#302e2b]">
              <PlugZap className="h-6 w-6" />
            </span>
            <p className="mt-8 font-mono text-[11px] font-bold tracking-[0.14em] text-[#dfcfad] uppercase">
              {localize(lang, "服务预告", "服務預告", "Service preview")}
            </p>
            <h2 className="display-heading display-heading--compact mt-4 max-w-3xl text-[clamp(2.7rem,5vw,5.6rem)] leading-[0.94] font-semibold tracking-[-0.06em]">
              {localize(
                lang,
                "更多服务，\n围绕日常所需。",
                "更多服務，\n圍繞日常所需。",
                "More support\nfor everyday care.",
              )}
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[30px] border border-white/12 bg-white/12 sm:grid-cols-3">
            {integrations.map((label, index) => (
              <div key={label} className="min-h-[180px] bg-[#282724] p-6 sm:min-h-[220px] sm:p-8">
                <span className="font-mono text-[11px] text-[#dfcfad]">0{index + 1}</span>
                <p className="mt-12 max-w-[220px] text-lg font-semibold tracking-[-0.025em] text-white/84">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="bg-[#ebe7de] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1480px]">
            <Eyebrow>{localize(lang, "同一栏目", "同一欄目", "In this area")}</Eyebrow>
            <div className="grid gap-3 md:grid-cols-3">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  href={getContentPath(sibling.slug, lang)}
                  className="group flex min-h-[190px] flex-col justify-between rounded-[26px] border border-[#302e2b]/8 bg-[#fbfaf6] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(48,46,43,0.07)]"
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-[#6b7c74] uppercase">
                      {getStatusLabel(lang, sibling.status)}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.035em]">{sibling.title}</h3>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#655d50] transition group-hover:rotate-45" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ExploreFooter />
    </main>
  );
}

export function ContentDetailPage({ slug, initialLang = "zh" }: { slug: string; initialLang?: Lang }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <MotionConfig reducedMotion="user">
        <ContentDetailPageInner slug={slug} />
      </MotionConfig>
    </LanguageProvider>
  );
}
