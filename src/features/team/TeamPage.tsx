"use client";

import { ArrowUpRight, PawPrint } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import Link from "next/link";

import { ExploreHeader, ExploreFooter } from "@/features/explore/ExploreShell";
import { getLocalizedPath } from "@/i18n/config";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations, type Lang } from "@/i18n/translations";

import { TeamMemberCard } from "./TeamMemberCard";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-12 grid items-end gap-6 sm:mb-16 lg:grid-cols-[1fr_0.7fr]">
      <div>
        <div className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-[#dfcfad] uppercase">
          <span className="h-px w-8 bg-[#dfcfad]" />
          {eyebrow}
        </div>
        <h2 className="display-heading display-heading--compact text-[clamp(2.8rem,5vw,5.6rem)] leading-[0.92] font-semibold tracking-[-0.06em] text-white">
          {title}
        </h2>
      </div>
      {description && <p className="max-w-xl text-base leading-8 text-white/58">{description}</p>}
    </div>
  );
}

function TeamPageContent() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const team = t.team;
  const coreIds = ["ceo", "scientist", "cto", "cdo"] as const;
  const supportIds = ["prof_liu", "prof_guo", "prof_chan"] as const;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f0e9] text-[#302e2b]">
      <ExploreHeader />

      <section className="relative overflow-hidden bg-[#282724] px-5 pt-28 pb-16 text-white sm:px-8 sm:pt-36 sm:pb-24 lg:px-12 lg:pt-44 lg:pb-32">
        <div className="paper-grid-dark absolute inset-0 opacity-30" />
        <div className="absolute top-28 -right-32 h-[520px] w-[520px] rounded-full border border-[#dfcfad]/16" />
        <div className="absolute top-52 -right-10 h-[320px] w-[320px] rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-[1480px]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-[#dfcfad] uppercase">
              <span className="h-px w-8 bg-[#dfcfad]" />
              {team.label}
            </div>
            <h1 className="display-heading display-heading--team max-w-[1150px] text-[clamp(4rem,10vw,10rem)] leading-[0.82] font-semibold tracking-[-0.08em]">
              {team.title}
            </h1>
            <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <p className="editorial-copy font-display max-w-2xl text-2xl leading-tight text-white/65 italic sm:text-4xl">
                {localize(
                  lang,
                  "把生命科学、毫米波工程与人本设计放在同一张桌上。",
                  "把生命科學、毫米波工程與人本設計放在同一張桌上。",
                  "Veterinary science, mmWave engineering and humane design — at one table.",
                )}
              </p>
              <p className="max-w-xl text-base leading-8 text-white/68 lg:justify-self-end">{team.desc}</p>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-white/12 bg-white/12 sm:mt-16 sm:grid-cols-3">
            {[
              ["01", localize(lang, "动物医学", "動物醫學", "Veterinary medicine")],
              ["02", localize(lang, "毫米波工程", "毫米波工程", "mmWave engineering")],
              ["03", localize(lang, "AI 与体验设计", "AI 與體驗設計", "AI & experience design")],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-5 bg-[#282724] px-6 py-5">
                <span className="font-mono text-[11px] text-[#dfcfad]">{number}</span>
                <span className="text-sm font-semibold text-white/82">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/8 bg-[#302e2b] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="paper-grid-dark absolute inset-0 opacity-20" />
        <div className="absolute top-20 -left-40 h-[480px] w-[480px] rounded-full bg-[#655d50]/18 blur-[120px]" />
        <div className="relative mx-auto max-w-[1380px]">
          <SectionHeading
            eyebrow={localize(lang, "核心 / 01", "核心 / 01", "Core / 01")}
            title={team.core}
            description={localize(
              lang,
              "从临床问题、底层传感器、AI 推理到最终体验，核心团队覆盖产品的完整技术链路。",
              "從臨床問題、底層感測器、AI 推理到最終體驗，核心團隊覆蓋產品的完整技術鏈路。",
              "From clinical questions and sensing hardware to AI reasoning and experience, the core team spans the full product stack.",
            )}
          />
          <div className="grid justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {coreIds.map((id, index) => (
              <TeamMemberCard key={id} member={team.members[id]} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/8 bg-[#35322e] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="paper-grid-dark absolute inset-0 opacity-15" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-[#e4d5c5]/10 blur-[130px]" />
        <div className="relative mx-auto max-w-[1380px]">
          <SectionHeading
            eyebrow={localize(lang, "顾问 / 02", "顧問 / 02", "Advisory / 02")}
            title={team.support}
            description={localize(
              lang,
              "临床、雷达与商业化三条路径上的资深指导，为产品提供长期校准。",
              "臨床、雷達與商業化三條路徑上的資深指導，為產品提供長期校準。",
              "Senior guidance across clinical science, radar systems and commercialization keeps the product calibrated for the long term.",
            )}
          />
          <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {supportIds.map((id, index) => (
              <TeamMemberCard key={id} member={team.members[id]} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/8 bg-[#2d2b28] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="paper-grid-dark absolute inset-0 opacity-20" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-[#dfcfad]/8 blur-[140px]" />
        <div className="relative mx-auto max-w-[1380px]">
          <SectionHeading
            eyebrow={localize(lang, "新生 / 03", "新生 / 03", "Next / 03")}
            title={team.intern_label}
            description={localize(
              lang,
              "年轻成员把产品、数据与 Agent 工程推向下一轮迭代。",
              "年輕成員把產品、數據與 Agent 工程推向下一輪迭代。",
              "Emerging talent advances the next iteration across product, data and Agent engineering.",
            )}
          />
          <div className="mx-auto grid max-w-[1240px] justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {Object.values(team.interns).map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#282724] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="paper-grid-dark absolute inset-0 opacity-25" />
        <div className="relative mx-auto flex max-w-[1480px] flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#dfcfad] text-[#302e2b]">
              <PawPrint className="h-6 w-6" />
            </span>
            <p className="display-heading display-heading--compact mt-8 max-w-4xl text-[clamp(2.6rem,5vw,5.8rem)] leading-[0.94] font-semibold tracking-[-0.06em] sm:mt-10">
              {t.footer.mission}
            </p>
          </div>
          <Link
            href={getLocalizedPath("/", lang)}
            className="group inline-flex h-14 items-center gap-4 rounded-full bg-[#dfcfad] px-6 text-sm font-bold text-[#302e2b]"
          >
            {localize(lang, "返回官网", "返回官網", "Return to website")}
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </Link>
        </div>
      </section>

      <ExploreFooter />
    </main>
  );
}

export function TeamPage({ initialLang = "zh" }: { initialLang?: Lang }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <MotionConfig reducedMotion="user">
        <TeamPageContent />
      </MotionConfig>
    </LanguageProvider>
  );
}
