"use client";
import { assetPath } from "@/lib/assetPath";

import {
  Activity,
  Brain,
  Clock3,
  Heart,
  HeartPulse,
  MapPin,
  PawPrint,
  Radar,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations } from "@/i18n/translations";

const PAIN_ICONS = [Stethoscope, Activity, ShieldCheck] as const;
const AI_ICONS = [HeartPulse, Activity, Sparkles, Brain] as const;
const PHONE_ICONS = [Activity, Sparkles, Heart] as const;
const PHONE_ICON_TONES = [
  "bg-[#ffd5cb] text-[#a33e2e]",
  "bg-[#dbf8a8] text-[#446b10]",
  "bg-[#dce9e3] text-[#655d50]",
] as const;
const HARDWARE_SPECS = ["60 GHz", "GPS", "LBS", "WiFi", "6-Axis IMU"] as const;

export function ProblemSection() {
  const { lang } = useLanguage();
  const t = translations[lang].pain;

  return (
    <section className="relative overflow-hidden bg-[#282724] text-white">
      <div className="paper-grid-dark absolute inset-0 opacity-30" />
      <div className="mx-auto grid max-w-[1480px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[460px] overflow-hidden sm:min-h-[560px] lg:min-h-[820px]">
          <Image
            src={assetPath("/hero-main.jpg")}
            draggable={false}
            alt={localize(
              lang,
              "主人陪伴佩戴 PetHealthAI 项圈的宠物",
              "主人陪伴佩戴 PetHealthAI 項圈的寵物",
              "Pet owner with a dog wearing the PetHealthAI collar",
            )}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,23,19,0.04),rgba(12,23,19,0.2)_50%,rgba(12,23,19,0.95))] lg:bg-[linear-gradient(90deg,rgba(12,23,19,0.05),rgba(12,23,19,0.22)_60%,rgba(12,23,19,1))]" />
          <div className="absolute right-6 bottom-8 left-6 flex items-end justify-between sm:right-10 sm:bottom-10 sm:left-10">
            <div>
              <p className="font-mono text-xs tracking-[0.14em] text-white/72 uppercase">Signal / 001</p>
              <p className="mt-2 max-w-sm text-base leading-7 text-white/88">
                {localize(
                  lang,
                  "陪伴不该从症状出现后才开始。",
                  "陪伴不該從症狀出現後才開始。",
                  "Care should begin before symptoms become visible.",
                )}
              </p>
            </div>
            <HeartPulse className="h-9 w-9 text-[#dfcfad]" strokeWidth={1.4} />
          </div>
        </div>

        <div className="relative flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28 xl:px-24">
          <Eyebrow light>{t.label}</Eyebrow>
          <h2 className="display-heading display-heading--wide max-w-[650px] text-[clamp(3rem,6vw,6.5rem)] leading-[0.93] font-semibold tracking-[-0.065em] whitespace-pre-line">
            {t.title}
          </h2>
          <p className="editorial-copy font-display mt-7 max-w-lg text-2xl leading-tight text-[#bdc9c4] italic sm:text-3xl">
            {localize(lang, "但身体一直在表达。", "但身體一直在表達。", "But the body is always speaking.")}
          </p>

          <div className="mt-10 border-t border-white/12 sm:mt-14">
            {t.items.map((item, index) => {
              const Icon = PAIN_ICONS[index];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.09 }}
                  className="group grid grid-cols-[44px_1fr] gap-4 border-b border-white/12 py-7 sm:grid-cols-[56px_1fr]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-[#dfcfad] transition group-hover:bg-[#dfcfad] group-hover:text-[#302e2b]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-lg font-semibold tracking-[-0.025em]">{item.title}</h3>
                      <span className="font-mono text-xs text-white/55">0{index + 1}</span>
                    </div>
                    <p className="mt-2 max-w-lg text-base leading-8 text-white/72">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HardwareSection() {
  const { lang } = useLanguage();
  const t = translations[lang].hardware;

  return (
    <section id="hardware" className="relative scroll-mt-[76px] overflow-hidden bg-[#f5f3ed] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Eyebrow>{t.label}</Eyebrow>
            <h2 className="display-heading display-heading--wide max-w-[880px] text-[clamp(3rem,7vw,7.2rem)] leading-[0.9] font-semibold tracking-[-0.07em] text-[#302e2b]">
              {t.title}
              <span className="font-display font-normal text-[#668277] italic"> / Sensor</span>
            </h2>
          </div>
          <div className="pb-2">
            <p className="text-xl font-semibold tracking-[-0.035em] text-[#302e2b] sm:text-2xl">{t.subtitle}</p>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#566a60]">{t.desc}</p>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[28px] bg-[#0b1411] sm:mt-14 sm:rounded-[52px]">
          <div className="paper-grid-dark absolute inset-0 opacity-20" />
          <div className="grid min-h-[580px] items-stretch lg:grid-cols-[1.25fr_0.75fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[320px] sm:min-h-[360px] lg:min-h-[620px]"
            >
              <Image
                src={assetPath("/hardware-dog.png")}
                draggable={false}
                alt={localize(
                  lang,
                  "毫米波雷达穿透宠物毛发进行感知",
                  "毫米波雷達穿透寵物毛髮進行感知",
                  "mmWave radar sensing through pet fur",
                )}
                fill
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-contain p-4 sm:p-8"
              />
              <div className="absolute top-6 left-6 rounded-full border border-white/12 bg-white/10 px-4 py-2 font-mono text-[11px] tracking-[0.13em] text-[#dfcfad] uppercase backdrop-blur-xl sm:top-9 sm:left-9">
                {localize(lang, "穿透毛发 / 实时感知", "穿透毛髮 / 即時感知", "Fur penetration / live sensing")}
              </div>
            </motion.div>

            <div className="relative flex flex-col justify-center border-t border-white/10 px-6 py-9 lg:border-t-0 lg:border-l lg:px-10 xl:px-14">
              {t.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/10 py-7 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#dfcfad]">SENSOR / 0{index + 1}</span>
                    <Radar className="h-4 w-4 text-white/35" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{feature.title}</h3>
                  <p className="mt-2 text-base leading-8 text-white/68">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-5">
            {HARDWARE_SPECS.map((spec) => (
              <div
                key={spec}
                className="border-b border-white/10 px-6 py-5 font-mono text-xs font-bold tracking-[0.12em] text-white/78 uppercase last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
              >
                {spec}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneInterface() {
  const { lang } = useLanguage();
  const t = translations[lang].phone;

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="absolute -inset-12 rounded-full bg-[#dfcfad]/16 blur-[80px]" />
      <motion.div
        initial={{ opacity: 0, rotateY: -12, y: 30 }}
        whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[46px] border-[8px] border-[#18241f] bg-[#eef2ed] shadow-[0_50px_100px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between px-6 pt-4 pb-3 font-mono text-[11px] font-bold text-[#302e2b]">
          <span>19:12</span>
          <div className="flex items-center gap-2">
            <Wifi className="h-3 w-3" />
            <span className="h-2.5 w-5 rounded-[3px] border border-[#302e2b]/40 p-[1px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-[#302e2b]" />
            </span>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.11em] text-[#60766b] uppercase">PetMind / Luna</p>
              <h3 className="mt-1 text-lg font-bold tracking-[-0.04em] text-[#302e2b]">{t.title}</h3>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#302e2b] text-[#dfcfad]">
              <PawPrint className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] bg-[#302e2b] p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.12em] text-white/65 uppercase">
                  {localize(lang, "实时心率", "即時心率", "Live heart rate")}
                </p>
                <p className="mt-1 font-mono text-3xl font-bold">
                  92 <span className="text-[11px] text-[#dfcfad]">BPM</span>
                </p>
              </div>
              <Heart className="h-6 w-6 fill-[#f27762] text-[#f27762]" />
            </div>
            <svg viewBox="0 0 260 72" className="mt-4 h-20 w-full" aria-hidden="true">
              <path
                d="M0 41 C18 41 20 41 30 41 L42 41 L50 16 L62 62 L72 32 L82 41 C98 41 104 41 118 41 L128 41 L137 20 L148 58 L160 30 L171 41 C190 41 202 41 218 41 C232 41 240 36 260 39"
                pathLength={1}
                fill="none"
                stroke="#dfcfad"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="signal-trace"
              />
            </svg>
            <div className="flex justify-between font-mono text-[11px] tracking-[0.09em] text-white/60 uppercase">
              <span>18:00</span>
              <span>{localize(lang, "实时", "即時", "Live")}</span>
              <span>19:12</span>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-[#5f7369]">{t.desc}</p>
          <div className="mt-4 space-y-2.5">
            {t.features.map((feature, index) => {
              const Icon = PHONE_ICONS[index];
              return (
                <div
                  key={feature.title}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_8px_24px_rgba(48,46,43,0.05)]"
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${PHONE_ICON_TONES[index]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[#302e2b]">{feature.title}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-[#657970]">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function IntelligenceSection() {
  const { lang } = useLanguage();
  const t = translations[lang].ai;

  return (
    <section
      id="intelligence"
      className="relative scroll-mt-[76px] overflow-hidden bg-[#e7e6dd] py-16 sm:py-24 lg:py-32"
    >
      <div className="paper-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-[1360px] items-center gap-12 px-5 sm:gap-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
        <PhoneInterface />
        <div>
          <Eyebrow>{t.label}</Eyebrow>
          <h2 className="display-heading display-heading--wide max-w-3xl text-[clamp(3.2rem,6.8vw,7rem)] leading-[0.9] font-semibold tracking-[-0.07em] text-[#302e2b]">
            {t.title}
            <span className="font-display block font-normal text-[#668277] italic">PetMind.</span>
          </h2>
          <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-[#302e2b] sm:text-2xl">{t.subtitle}</h3>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#53675d]">{t.desc}</p>

          <div className="mt-10 grid border-t border-l border-[#302e2b]/12 sm:grid-cols-2">
            {t.features.map((feature, index) => {
              const Icon = AI_ICONS[index];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group min-h-[150px] border-r border-b border-[#302e2b]/12 p-6 transition hover:bg-white/55 sm:min-h-[190px] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[#36584a]" strokeWidth={1.6} />
                    <span className="font-mono text-[11px] text-[#687d73]">AI / 0{index + 1}</span>
                  </div>
                  <h4 className="mt-6 text-base font-bold tracking-[-0.025em] text-[#302e2b] sm:mt-8">
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-[#5e7368]">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EverydayCareSection() {
  const { lang } = useLanguage();
  const moments = [
    {
      icon: Clock3,
      time: localize(lang, "夜间", "夜間", "Night"),
      title: localize(lang, "睡眠与休息", "睡眠與休息", "Sleep & rest"),
      desc: localize(
        lang,
        "在最安静的时刻建立心率与呼吸基线，观察长期趋势。",
        "在最安靜的時刻建立心率與呼吸基線，觀察長期趨勢。",
        "Build a heart and breathing baseline during the calmest hours and watch long-term trends.",
      ),
    },
    {
      icon: Activity,
      time: localize(lang, "出门", "出門", "Outside"),
      title: localize(lang, "散步与运动", "散步與運動", "Walks & activity"),
      desc: localize(
        lang,
        "把活动强度与生理反应放在一起看，理解真正适合它的节奏。",
        "把活動強度與生理反應放在一起看，理解真正適合牠的節奏。",
        "See activity intensity together with physiological response to understand the pace that suits them.",
      ),
    },
    {
      icon: MapPin,
      time: localize(lang, "独处", "獨處", "Alone"),
      title: localize(lang, "在家与位置", "在家與位置", "Home & location"),
      desc: localize(
        lang,
        "当你不在身边，仍能了解活动状态与位置变化。",
        "當你不在身邊，仍能了解活動狀態與位置變化。",
        "Stay informed about activity and location changes while you are away.",
      ),
    },
    {
      icon: HeartPulse,
      time: localize(lang, "恢复", "恢復", "Recovery"),
      title: localize(lang, "复诊与康复", "覆診與康復", "Recovery & follow-up"),
      desc: localize(
        lang,
        "用连续记录补充诊室里的单次测量，为沟通提供更完整的上下文。",
        "用連續記錄補充診室裡的單次測量，為溝通提供更完整的上下文。",
        "Add continuous context to one-time clinic readings and support more informed conversations.",
      ),
    },
  ];

  return (
    <section id="use-cases" className="scroll-mt-[76px] overflow-hidden bg-[#f5f3ed] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden rounded-[34px] border border-[#302e2b]/8 bg-[#eee3d5] sm:rounded-[52px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[520px] overflow-hidden sm:min-h-[620px] lg:min-h-[850px]">
            <Image
              src={assetPath("/hero-warm.jpg")}
              draggable={false}
              alt={localize(
                lang,
                "主人陪伴佩戴 PetHealthAI 项圈的宠物",
                "主人陪伴佩戴 PetHealthAI 項圈的寵物",
                "Pet owner with a dog wearing the PetHealthAI collar",
              )}
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover object-[38%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(48,46,43,0.02)_35%,rgba(48,46,43,0.84)_100%)]" />
            <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/25 bg-[#302e2b]/45 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-white uppercase backdrop-blur-xl sm:top-10 sm:left-10">
              <span className="h-2 w-2 rounded-full bg-[#dfcfad] shadow-[0_0_12px_#dfcfad]" />
              {localize(lang, "日常基线学习中", "日常基線學習中", "Learning daily baseline")}
            </div>
            <div className="absolute right-6 bottom-7 left-6 grid grid-cols-3 overflow-hidden rounded-[24px] border border-white/15 bg-[#302e2b]/70 text-white backdrop-blur-2xl sm:right-10 sm:bottom-10 sm:left-10">
              {[
                ["92", "BPM"],
                ["18", "RPM"],
                ["Calm", localize(lang, "状态", "狀態", "Status")],
              ].map(([value, label], index) => (
                <div key={label} className={`p-4 sm:p-6 ${index > 0 ? "border-l border-white/12" : ""}`}>
                  <p className="font-mono text-xl font-bold tracking-[-0.04em] sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[11px] tracking-[0.1em] text-white/70 uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20">
            <Eyebrow>{localize(lang, "每一天 / 每一刻", "每一天 / 每一刻", "Every day / every moment")}</Eyebrow>
            <h2 className="display-heading display-heading--compact text-[clamp(3.2rem,6vw,6.6rem)] leading-[0.9] font-semibold tracking-[-0.07em] whitespace-pre-line text-[#302e2b]">
              {localize(
                lang,
                "先认识平常，\n才发现异常。",
                "先認識平常，\n才發現異常。",
                "Know normal.\nNotice change.",
              )}
            </h2>
            <p className="editorial-copy font-display mt-7 max-w-xl text-xl leading-tight text-[#6d6b5f] italic sm:text-2xl">
              {localize(
                lang,
                "健康不是一个瞬间，而是一条随时间变化的曲线。",
                "健康不是一個瞬間，而是一條隨時間變化的曲線。",
                "Health is not a moment. It is a curve across time.",
              )}
            </p>

            <div className="mt-10 border-t border-[#302e2b]/12 sm:mt-12">
              {moments.map((moment, index) => {
                const Icon = moment.icon;
                return (
                  <motion.div
                    key={moment.title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="grid grid-cols-[42px_1fr] gap-4 border-b border-[#302e2b]/12 py-6"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-[#302e2b]/15 bg-white/50 text-[#655d50]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-bold tracking-[-0.025em] text-[#302e2b]">{moment.title}</h3>
                        <span className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#667a71] uppercase">
                          {moment.time} / 0{index + 1}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[#586c62]">{moment.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
