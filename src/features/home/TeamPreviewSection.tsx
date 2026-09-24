"use client";

import { ArrowUpRight, Radar, Sparkles, Stethoscope, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import type { TeamMember } from "@/features/team/types";
import { getLocalizedPath } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations, type Lang } from "@/i18n/translations";
import { getInitials } from "@/lib/name";

type TeamCluster = {
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
  members: TeamMember[];
};

export function TeamPreviewSection() {
  const { lang } = useLanguage();
  const team = translations[lang].team;
  const clusters = createTeamClusters(lang, team.members);

  return (
    <section id="team" className="scroll-mt-[76px] overflow-hidden bg-[#e4d5c5] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <TeamPreviewHeader label={team.label} title={team.title} description={team.desc} lang={lang} />

        <div className="mt-10 overflow-hidden rounded-[30px] border border-[#302e2b]/12 bg-[#f8f6f1] shadow-[0_28px_80px_rgba(89,47,31,0.12)] sm:mt-14 sm:rounded-[48px] lg:grid lg:grid-cols-[0.36fr_0.64fr]">
          <TeamNetworkSummary lang={lang} />
          <div className="divide-y divide-[#302e2b]/10">
            {clusters.map((cluster, index) => (
              <TeamClusterRow key={cluster.code} cluster={cluster} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamPreviewHeader({
  label,
  title,
  description,
  lang,
}: {
  label: string;
  title: string;
  description: string;
  lang: Lang;
}) {
  return (
    <div className="grid items-end gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2 className="display-heading display-heading--wide max-w-[900px] text-[clamp(3.2rem,7vw,7.6rem)] leading-[0.88] font-semibold tracking-[-0.075em] text-[#302e2b]">
          {title}
        </h2>
      </div>
      <div className="pb-2">
        <p className="max-w-xl text-base leading-7 text-[#354d43]">{description}</p>
        <Link
          href={getLocalizedPath("/team", lang)}
          className="group mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#302e2b]"
        >
          {localize(lang, "认识完整团队", "認識完整團隊", "Meet the full team")}
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#302e2b]/30 transition group-hover:rotate-45 group-hover:bg-[#302e2b] group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function TeamNetworkSummary({ lang }: { lang: Lang }) {
  return (
    <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-[#302e2b] p-7 text-white sm:min-h-[430px] sm:p-10 lg:min-h-full lg:p-12">
      <div className="paper-grid-dark absolute inset-0 opacity-25" />
      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full border border-[#dfcfad]/20" />
      <div className="absolute right-3 bottom-3 h-44 w-44 rounded-full border border-white/10" />

      <div className="relative">
        <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#dfcfad] uppercase">
          {localize(lang, "协作网络 / Team system", "協作網絡 / Team system", "Collaboration network / Team system")}
        </p>
        <p className="mt-7 font-mono text-[clamp(4.5rem,9vw,8rem)] leading-none font-semibold tracking-[-0.1em]">
          4<span className="mx-2 text-[#dfcfad]">+</span>3
        </p>
        <p className="mt-5 text-lg font-semibold tracking-[-0.02em] sm:text-xl">
          {localize(lang, "核心研发 × 顶尖指导", "核心研發 × 頂尖指導", "Core builders × expert advisors")}
        </p>
      </div>

      <div className="relative mt-12 border-t border-white/12 pt-6">
        <div className="heartbeat-mini mb-5 h-7 w-24 brightness-[2.2]" aria-hidden="true" />
        <p className="max-w-sm text-sm leading-7 text-white/62">
          {localize(
            lang,
            "不是各自独立的头衔，而是一条从临床问题到家庭产品的共同研发链路。",
            "不是各自獨立的頭銜，而是一條從臨床問題到家庭產品的共同研發鏈路。",
            "Not isolated titles, but one shared path from clinical questions to everyday care.",
          )}
        </p>
      </div>
    </div>
  );
}

function TeamClusterRow({ cluster, index }: { cluster: TeamCluster; index: number }) {
  const Icon = cluster.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group grid gap-6 p-6 transition hover:bg-[#edf1ea] sm:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:p-9"
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#302e2b] text-[#dfcfad] transition group-hover:rotate-[-6deg]">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#648074] uppercase">
            {cluster.code}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-bold tracking-[-0.03em] text-[#302e2b] sm:text-xl">{cluster.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#5b7066]">{cluster.description}</p>
      </div>

      <div className="flex flex-wrap gap-2.5 lg:justify-end">
        {cluster.members.map((member) => (
          <TeamMemberChip key={member.name} member={member} />
        ))}
      </div>
    </motion.article>
  );
}

function TeamMemberChip({ member }: { member: TeamMember }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-full border border-[#302e2b]/10 bg-white px-3 py-2 pr-4 shadow-[0_8px_24px_rgba(48,46,43,0.06)]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e5e5db] font-mono text-[10px] font-bold text-[#655d50]">
        {getInitials(member.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-bold text-[#302e2b]">{member.name}</span>
        <span className="mt-0.5 block font-mono text-[9px] tracking-[0.08em] text-[#74877e] uppercase">
          {member.role}
        </span>
      </span>
    </div>
  );
}

function createTeamClusters(lang: Lang, members: (typeof translations)[Lang]["team"]["members"]): TeamCluster[] {
  return [
    {
      icon: Stethoscope,
      code: "01 / CLINICAL",
      title: localize(lang, "临床理解与健康智能", "臨床理解與健康智能", "Clinical insight & health intelligence"),
      description: localize(
        lang,
        "从动物医学问题出发，定义 PetMind 应该理解和解释的变化。",
        "從動物醫學問題出發，定義 PetMind 應該理解和解釋的變化。",
        "Start with veterinary questions to define the changes PetMind should understand and explain.",
      ),
      members: [members.ceo, members.cto, members.prof_liu],
    },
    {
      icon: Radar,
      code: "02 / SENSING",
      title: localize(lang, "毫米波感知系统", "毫米波感知系統", "mmWave sensing systems"),
      description: localize(
        lang,
        "把雷达理论、硬件模组与生物信号算法连接成可靠的感知链路。",
        "把雷達理論、硬體模組與生物訊號演算法連接成可靠的感知鏈路。",
        "Connect radar theory, sensing hardware and biosignal algorithms into one reliable system.",
      ),
      members: [members.scientist, members.prof_guo],
    },
    {
      icon: Sparkles,
      code: "03 / EXPERIENCE",
      title: localize(lang, "体验设计与产品转化", "體驗設計與產品轉化", "Experience & product translation"),
      description: localize(
        lang,
        "让医疗级技术走出实验室，成为宠物无感、主人易懂的日常产品。",
        "讓醫療級技術走出實驗室，成為寵物無感、主人易懂的日常產品。",
        "Translate medical-grade technology into an effortless product for pets and their people.",
      ),
      members: [members.cdo, members.prof_chan],
    },
  ];
}
