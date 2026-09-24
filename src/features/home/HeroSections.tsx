"use client";

import { ArrowDown, ArrowUpRight, Brain, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

import { ProductConceptImage } from "@/components/brand/ProductConceptImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations } from "@/i18n/translations";

function ProductStage() {
  const { lang } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[36px] border border-[#c9b994]/45 bg-[#eee6dc] p-4 shadow-[0_24px_70px_rgba(48,46,43,0.08)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-2 text-[11px] font-medium tracking-[0.08em] text-[#655d50]">
        <span>PetHealthAI / In development</span>
        <span>{localize(lang, "温润 · 轻巧 · 贴身", "溫潤 · 輕巧 · 貼身", "Soft · Compact · Personal")}</span>
      </div>
      <div className="mt-5 aspect-[1.35] sm:aspect-[1.25]">
        <ProductConceptImage priority />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-5 px-2 py-6">
        <div>
          <p className="text-[11px] text-[#746c60]">
            {localize(lang, "为日常陪伴而设计", "為日常陪伴而設計", "Designed for everyday companionship")}
          </p>
          <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#302e2b]">
            {localize(lang, "让科技，轻轻靠近。", "讓科技，輕輕靠近。", "Care, closer to life.")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <section className="relative overflow-hidden bg-[#f4f0e9] pt-[76px]">
      <div className="paper-grid absolute inset-0 opacity-55" />
      <div className="absolute top-36 -left-24 h-72 w-72 rounded-full bg-[#e4d5c5]/20 blur-[90px]" />
      <div className="absolute top-[10%] right-[12%] h-80 w-80 rounded-full bg-[#dfcfad]/15 blur-[100px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-[1480px] items-center gap-9 px-5 py-10 sm:gap-12 sm:px-8 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:py-20">
        <motion.div style={{ y }} className="relative z-10 max-w-[660px]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <Eyebrow>
              {localize(lang, "宠物健康的下一代界面", "寵物健康的下一代介面", "The next interface for pet health")}
            </Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="hero-wordmark max-w-[620px] text-[clamp(3.7rem,8.4vw,8.4rem)] leading-[0.84] font-bold tracking-[-0.075em] text-[#302e2b]"
          >
            <span className="block">PetHealth</span>
            <span className="font-display font-normal tracking-[-0.045em] text-[#5d7d70] italic">AI.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
            className="mt-9 border-l border-[#302e2b]/20 pl-5 sm:pl-7"
          >
            <p className="reading-title max-w-[560px] text-[clamp(1.45rem,2.5vw,2.45rem)] leading-[1.12] font-semibold tracking-[-0.045em] text-[#302e2b]">
              {t.hero.subtitle}
            </p>
            <p className="mt-4 max-w-[540px] text-[15px] leading-7 text-[#50635a] sm:text-base">{t.hero.desc}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <a
              href="#beta"
              className="group inline-flex h-13 items-center gap-3 rounded-full bg-[#302e2b] px-5 text-[13px] font-bold text-white transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(48,46,43,0.2)] sm:h-14 sm:px-7 sm:text-sm"
            >
              {t.hero.cta1}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dfcfad] text-[#302e2b] transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <a
              href="#hardware"
              className="inline-flex h-13 items-center gap-3 rounded-full border border-[#302e2b]/15 bg-white/55 px-5 text-[13px] font-bold text-[#302e2b] backdrop-blur transition hover:border-[#302e2b]/35 hover:bg-white sm:h-14 sm:px-7 sm:text-sm"
            >
              {t.hero.cta2}
              <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-8 flex items-center gap-4 text-xs font-bold tracking-[0.14em] text-[#5e766c] uppercase sm:mt-12"
          >
            <div className="heartbeat-mini h-7 w-20" aria-hidden="true" />
            {t.hero.badge}
          </motion.div>
        </motion.div>

        <div className="relative z-10 lg:pl-6">
          <ProductStage />
        </div>
      </div>

      <div className="relative border-y border-[#302e2b]/10 bg-[#e8e5de]/70">
        <div className="mx-auto grid max-w-[1480px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {t.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="border-[#302e2b]/10 px-3 py-7 odd:border-l lg:border-l lg:px-7 lg:first:border-l-0"
            >
              <p className="font-mono text-xl font-bold tracking-[-0.05em] text-[#302e2b] sm:text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-[#5f7269] uppercase sm:text-[13px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSystemSection() {
  const { lang } = useLanguage();
  const specs = [
    ["28g", localize(lang, "轻量机身", "輕量機身", "Lightweight")],
    ["20–45cm", localize(lang, "适配颈围", "適配頸圍", "Neck fit")],
    ["IP68", localize(lang, "防水防尘", "防水防塵", "Water resistant")],
    ["72–120h", localize(lang, "续航范围", "續航範圍", "Battery range")],
  ];
  const systemCards = [
    {
      icon: MapPin,
      code: "GPS · LBS · WiFi",
      title: localize(lang, "位置与活动", "位置與活動", "Location & activity"),
      desc: localize(
        lang,
        "在散步、独处与走失风险中，保持对当下状态的感知。",
        "在散步、獨處與走失風險中，保持對當下狀態的感知。",
        "Stay aware through walks, alone time and moments of location risk.",
      ),
      tone: "bg-[#e4d5c5]",
    },
    {
      icon: Brain,
      code: "PETMIND / BRIEF",
      title: localize(lang, "从信号到解释", "從訊號到解釋", "From signal to meaning"),
      desc: localize(
        lang,
        "结合品种、年龄与长期基线，给出值得关注的变化，而不是制造更多焦虑。",
        "結合品種、年齡與長期基線，給出值得關注的變化，而不是製造更多焦慮。",
        "Contextualize changes by breed, age and baseline—without creating more anxiety.",
      ),
      tone: "bg-[#ebe8df]",
    },
  ];

  return (
    <section id="product" className="relative scroll-mt-[76px] overflow-hidden bg-[#f7f5ef] py-16 sm:py-24 lg:py-32">
      <div className="paper-grid absolute inset-0 opacity-45" />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Eyebrow>{localize(lang, "产品系统 / 01", "產品系統 / 01", "Product system / 01")}</Eyebrow>
            <h2 className="display-heading display-heading--wide max-w-[980px] text-[clamp(2.75rem,7vw,7.4rem)] leading-[0.88] font-semibold tracking-[-0.075em] whitespace-pre-line text-[#302e2b]">
              {localize(
                lang,
                "一枚项圈，\n一条健康时间线。",
                "一枚項圈，\n一條健康時間線。",
                "One collar.\nA living health timeline.",
              )}
            </h2>
          </div>
          <div className="pb-2">
            <p className="editorial-copy font-display text-2xl leading-tight text-[#587267] italic sm:text-3xl">
              {localize(
                lang,
                "不是记录更多数据，而是更早理解变化。",
                "不是記錄更多數據，而是更早理解變化。",
                "Not more data. Earlier understanding.",
              )}
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5d7067]">
              {localize(
                lang,
                "精灵一代持续采集生命体征、活动与位置数据，PetMind 将碎片信号整理成日常基线、异常提醒与可行动的健康建议。",
                "精靈一代持續採集生命體徵、活動與位置數據，PetMind 將碎片訊號整理成日常基線、異常提醒與可行動的健康建議。",
                "Elf Gen 1 continuously senses vital signs, activity and location. PetMind turns those signals into a daily baseline, meaningful alerts and actionable care guidance.",
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75 }}
            className="relative min-h-[620px] overflow-hidden rounded-[30px] border border-[#302e2b]/8 bg-[#e7e6dd] p-6 sm:min-h-[680px] sm:rounded-[50px] sm:p-10"
          >
            <div className="paper-grid absolute inset-0 opacity-35" />
            <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-[#dfcfad]/24 blur-[90px]" />
            <div className="relative flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] font-bold tracking-[0.15em] text-[#4f6b60] uppercase">
                  PetHealthAI / Gen 01
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#302e2b] sm:text-4xl">
                  {localize(lang, "精灵一代", "精靈一代", "Elf Gen 1")}
                </h3>
              </div>
              <span className="rounded-full border border-[#302e2b]/12 bg-white/65 px-3 py-2 font-mono text-[11px] font-bold tracking-[0.12em] text-[#3e5d50] uppercase">
                {localize(lang, "内测中", "內測中", "In beta")}
              </span>
            </div>

            <div className="relative mx-auto mt-6 h-[290px] w-full max-w-[620px] sm:mt-8 sm:h-[390px]">
              <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#302e2b]/10" />
              <div className="absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#302e2b]/10" />
              <ProductConceptImage />
            </div>

            <div className="relative grid grid-cols-2 overflow-hidden rounded-[24px] border border-[#302e2b]/10 bg-white/52 backdrop-blur-sm sm:grid-cols-4">
              {specs.map(([value, label], index) => (
                <div
                  key={label}
                  className={`p-4 sm:p-5 ${index > 0 ? "border-l border-[#302e2b]/8" : ""} ${index > 1 ? "border-t sm:border-t-0" : ""}`}
                >
                  <p className="font-mono text-sm font-bold tracking-[-0.03em] text-[#302e2b]">{value}</p>
                  <p className="mt-1 text-[11px] font-semibold tracking-[0.08em] text-[#687c73] uppercase">{label}</p>
                </div>
              ))}
            </div>
          </motion.article>

          <div className="grid gap-3 sm:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="relative min-h-[340px] overflow-hidden rounded-[30px] bg-[#282724] p-6 text-white sm:col-span-2 sm:min-h-[390px] sm:rounded-[44px] sm:p-9"
            >
              <div className="paper-grid-dark absolute inset-0 opacity-25" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.14em] text-[#dfcfad] uppercase">
                    Live baseline / Luna
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    {localize(lang, "读懂平静时的它", "讀懂平靜時的牠", "Learn what normal looks like")}
                  </h3>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 font-mono text-[11px] tracking-[0.1em] text-white/78 uppercase">
                  <span className="h-2 w-2 rounded-full bg-[#dfcfad] shadow-[0_0_14px_#dfcfad]" /> Live
                </span>
              </div>

              <div className="relative mt-8 grid grid-cols-[0.7fr_1.3fr] items-end gap-5 sm:mt-10 sm:gap-6">
                <div>
                  <p className="font-mono text-[clamp(3.2rem,6vw,5rem)] leading-none font-semibold tracking-[-0.09em]">
                    92
                  </p>
                  <p className="mt-2 text-xs font-bold tracking-[0.12em] text-white/62 uppercase">BPM · Heart</p>
                  <div className="mt-8 flex gap-6">
                    <div>
                      <p className="font-mono text-xl font-bold">18</p>
                      <p className="mt-1 text-[11px] tracking-[0.1em] text-white/60 uppercase">RPM</p>
                    </div>
                    <div>
                      <p className="font-mono text-xl font-bold">{localize(lang, "平静", "平靜", "Calm")}</p>
                      <p className="mt-1 text-[11px] tracking-[0.1em] text-white/60 uppercase">
                        {localize(lang, "状态", "狀態", "Status")}
                      </p>
                    </div>
                  </div>
                </div>
                <svg viewBox="0 0 420 150" className="h-40 w-full" aria-hidden="true">
                  <path
                    d="M0 82 C35 82 42 82 66 82 L78 82 L90 28 L111 126 L132 55 L151 82 C190 82 205 82 239 82 L251 82 L265 39 L286 119 L307 60 L328 82 C360 82 381 74 420 79"
                    pathLength={1}
                    fill="none"
                    stroke="#dfcfad"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="signal-trace"
                  />
                  <path
                    d="M0 108 C80 94 142 119 216 104 C282 91 341 106 420 92"
                    fill="none"
                    stroke="rgba(255,255,255,.18)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </motion.article>

            {systemCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.code}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.14 + index * 0.07 }}
                  className={`flex min-h-[235px] flex-col justify-between rounded-[28px] border border-[#302e2b]/8 p-6 sm:min-h-[275px] sm:rounded-[38px] sm:p-7 ${card.tone}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#302e2b] text-[#dfcfad]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#486057] uppercase">
                      {card.code}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-[-0.035em] text-[#302e2b]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#4f655b]">{card.desc}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
