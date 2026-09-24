"use client";

import { ArrowUpRight, Brain, Globe2, MapPin, Radar, Sparkles, Stethoscope, Users } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { getLocalizedPath } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations } from "@/i18n/translations";

const SOCIAL_ICONS = [Globe2, MapPin, Users] as const;

export function SocialSection() {
  const { lang } = useLanguage();
  const t = translations[lang].social;

  return (
    <section className="bg-[#f5f3ed] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="relative min-h-[660px] overflow-hidden rounded-[28px] sm:min-h-[760px] sm:rounded-[52px] lg:min-h-[820px]">
          <Image
            src={assetPath("/scene-park.jpg")}
            draggable={false}
            alt={localize(
              lang,
              "公园中佩戴 PetHealthAI 项圈的宠物社群",
              "公園中佩戴 PetHealthAI 項圈的寵物社群",
              "Pet community in a park wearing PetHealthAI collars",
            )}
            fill
            sizes="(min-width: 1480px) 1384px, calc(100vw - 40px)"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,20,16,0.92)_0%,rgba(9,20,16,0.72)_38%,rgba(9,20,16,0.08)_75%)]" />
          <div className="paper-grid-dark absolute inset-0 opacity-20" />

          <div className="relative flex min-h-[660px] max-w-[680px] flex-col justify-between p-6 text-white sm:min-h-[760px] sm:p-10 lg:min-h-[820px] lg:p-16">
            <div>
              <Eyebrow light>{t.label}</Eyebrow>
              <h2 className="display-heading display-heading--wide text-[clamp(3.1rem,6vw,6.6rem)] leading-[0.9] font-semibold tracking-[-0.065em]">
                {t.title}
              </h2>
              <p className="editorial-copy font-display mt-6 max-w-xl text-2xl leading-tight text-white/70 italic sm:text-3xl">
                {t.subtitle}
              </p>
            </div>

            <div className="mt-10 divide-y divide-white/15 border-y border-white/15 backdrop-blur-sm sm:mt-16">
              {t.features.map((feature, index) => {
                const Icon = SOCIAL_ICONS[index];
                return (
                  <div
                    key={feature.title}
                    className="grid grid-cols-[40px_1fr] gap-4 py-5 sm:grid-cols-[48px_1fr] sm:py-6"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#dfcfad]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-white/72 sm:text-base">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanySection() {
  const { lang } = useLanguage();
  const disciplines = [
    {
      icon: Stethoscope,
      label: localize(lang, "动物医学", "動物醫學", "Veterinary medicine"),
      desc: localize(
        lang,
        "从真实临床问题出发，定义什么值得被监测与解释。",
        "從真實臨床問題出發，定義什麼值得被監測與解釋。",
        "Start with real clinical questions to define what is worth sensing and explaining.",
      ),
    },
    {
      icon: Radar,
      label: localize(lang, "毫米波工程", "毫米波工程", "mmWave engineering"),
      desc: localize(
        lang,
        "从天线、模组到生物信号算法，打磨穿透毛发的感知能力。",
        "從天線、模組到生物訊號演算法，打磨穿透毛髮的感知能力。",
        "Engineer antennas, modules and biosignal algorithms to sense through fur.",
      ),
    },
    {
      icon: Brain,
      label: localize(lang, "宠物健康 AI", "寵物健康 AI", "Pet health AI"),
      desc: localize(
        lang,
        "让 PetMind 结合长期数据与专业知识，理解个体变化。",
        "讓 PetMind 結合長期數據與專業知識，理解個體變化。",
        "Combine longitudinal data and domain knowledge to understand each individual.",
      ),
    },
    {
      icon: Sparkles,
      label: localize(lang, "人本体验", "人本體驗", "Humane experience"),
      desc: localize(
        lang,
        "把复杂技术变成宠物无感、主人看得懂的日常体验。",
        "把複雜技術變成寵物無感、主人看得懂的日常體驗。",
        "Turn complex technology into an effortless experience pets barely notice and people understand.",
      ),
    },
  ];
  const metrics = [
    [
      "≈10",
      localize(lang, "年毫米波生物雷达研究积累", "年毫米波生物雷達研究積累", "Years of mmWave biosensing research"),
    ],
    [
      "40+",
      localize(lang, "篇生物雷达相关国际论文", "篇生物雷達相關國際論文", "International biosensing publications"),
    ],
    ["4", localize(lang, "个跨学科研发领域", "個跨學科研發領域", "Integrated R&D disciplines")],
    ["24/7", localize(lang, "连续健康守护愿景", "連續健康守護願景", "Continuous-care vision")],
  ];
  const researchPath = [
    localize(lang, "生命信号采集", "生命訊號採集", "Signal capture"),
    localize(lang, "算法对照验证", "演算法對照驗證", "Algorithm validation"),
    localize(lang, "居家场景产品化", "居家場景產品化", "At-home productization"),
    localize(lang, "长期数据迭代", "長期數據迭代", "Longitudinal learning"),
  ];

  return (
    <section id="company" className="relative scroll-mt-[76px] overflow-hidden bg-[#e6e1d7] py-16 sm:py-24 lg:py-32">
      <div className="paper-grid absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 sm:gap-10 lg:grid-cols-[1.16fr_0.84fr]">
          <div>
            <Eyebrow>{localize(lang, "关于 PetHealthAI", "關於 PetHealthAI", "About PetHealthAI")}</Eyebrow>
            <h2 className="display-heading display-heading--wide max-w-[1000px] text-[clamp(2.75rem,7vw,7.4rem)] leading-[0.88] font-semibold tracking-[-0.075em] whitespace-pre-line text-[#302e2b]">
              {localize(
                lang,
                "不只做一枚项圈，\n而是宠物健康的\n基础设施。",
                "不只做一枚項圈，\n而是寵物健康的\n基礎設施。",
                "More than a collar.\nInfrastructure for pet health.",
              )}
            </h2>
          </div>
          <div className="pb-2">
            <p className="max-w-xl text-base leading-8 text-[#53675e]">
              {localize(
                lang,
                "我们把动物医学、毫米波工程、人工智能与体验设计放在同一张研发桌上，目标是让连续健康数据真正进入每一个宠物家庭。",
                "我們把動物醫學、毫米波工程、人工智能與體驗設計放在同一張研發桌上，目標是讓連續健康數據真正進入每一個寵物家庭。",
                "We bring veterinary medicine, mmWave engineering, AI and experience design to one R&D table—so continuous health insight can become part of everyday pet care.",
              )}
            </p>
            <Link
              href={getLocalizedPath("/team", lang)}
              className="group mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#302e2b]"
            >
              {localize(lang, "了解团队与研究背景", "了解團隊與研究背景", "Meet the team and research network")}
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#302e2b]/25 transition group-hover:rotate-45 group-hover:bg-[#302e2b] group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[30px] bg-[#282724] text-white sm:mt-14 sm:rounded-[52px]">
          <div className="paper-grid-dark absolute inset-0 opacity-25" />
          <div className="relative grid border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="border-b border-white/10 p-6 last:border-b-0 sm:p-8 lg:border-r lg:border-b-0 lg:last:border-r-0 sm:[&:nth-child(odd)]:border-r"
              >
                <p className="font-mono text-4xl font-semibold tracking-[-0.08em] text-[#dfcfad] sm:text-5xl">
                  {value}
                </p>
                <p className="mt-3 max-w-[210px] text-xs leading-5 font-semibold tracking-[0.07em] text-white/62 uppercase">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="relative grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-white/10 p-6 sm:p-10 lg:border-r lg:border-b-0 lg:p-12 xl:p-16">
              <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#dfcfad] uppercase">
                {localize(lang, "融合研发", "融合研發", "Integrated R&D")}
              </p>
              <h3 className="display-heading display-heading--compact mt-5 text-[clamp(2.4rem,4vw,4.8rem)] leading-[0.95] font-semibold tracking-[-0.06em] whitespace-pre-line">
                {localize(
                  lang,
                  "技术跨界，\n但目标始终单纯。",
                  "技術跨界，\n但目標始終單純。",
                  "Different disciplines.\nOne simple goal.",
                )}
              </h3>
              <p className="editorial-copy font-display mt-6 max-w-md text-xl leading-tight text-white/50 italic sm:text-2xl">
                {localize(
                  lang,
                  "让每一位宠物主真正地安心。",
                  "讓每一位寵物主真正地安心。",
                  "True peace of mind for every pet owner.",
                )}
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {disciplines.map((discipline, index) => {
                const Icon = discipline.icon;
                return (
                  <motion.article
                    key={discipline.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="group min-h-[220px] border-b border-white/10 p-6 transition hover:bg-white/5 sm:min-h-[260px] sm:border-r sm:p-8 sm:[&:nth-child(even)]:border-r-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-[#dfcfad] transition group-hover:bg-[#dfcfad] group-hover:text-[#302e2b]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[11px] text-white/55">0{index + 1}</span>
                    </div>
                    <h4 className="mt-7 text-lg font-bold tracking-[-0.03em] sm:mt-9">{discipline.label}</h4>
                    <p className="mt-3 text-sm leading-7 text-white/65">{discipline.desc}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <div className="relative border-t border-white/10 px-6 py-8 sm:px-10 lg:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#dfcfad] uppercase">
                  {localize(lang, "研发路径", "研發路徑", "R&D path")}
                </p>
                <p className="mt-2 text-base text-white/68">
                  {localize(
                    lang,
                    "从实验室能力到长期家庭价值",
                    "從實驗室能力到長期家庭價值",
                    "From laboratory capability to lasting value at home",
                  )}
                </p>
              </div>
              <ol className="grid flex-1 gap-2 sm:grid-cols-4 lg:max-w-[820px]">
                {researchPath.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3"
                  >
                    <span className="font-mono text-[11px] text-[#dfcfad]">0{index + 1}</span>
                    <span className="text-xs font-semibold text-white/82">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
