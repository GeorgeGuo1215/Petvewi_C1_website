"use client";

import {
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Clock3,
  HeartPulse,
  MapPin,
  PawPrint,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { ProductConceptImage } from "@/components/brand/ProductConceptImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Modal } from "@/components/ui/Modal";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations, type Lang } from "@/i18n/translations";
import { assetPath } from "@/lib/assetPath";
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const PRODUCT_COLORS = ["#121816", "#eeeae2", "#7faedc"] as const;
const PRODUCT_FEATURE_ICONS = [HeartPulse, MapPin, Clock3, Waves, Brain, Zap] as const;
const FORM_FIELD_KEYS = ["name", "wechat", "email"] as const;
const EMPTY_FORM = { name: "", wechat: "", email: "", website: "" };

type FormState = typeof EMPTY_FORM;
type SubmissionContext = { lang: Lang; color: string; plan: string };
type SubmissionStatus = "idle" | "submitting" | "success" | "error";

function useBetaApplication() {
  const [selectedColor, setSelectedColor] = React.useState(0);
  const [selectedPlan, setSelectedPlan] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [status, setStatus] = React.useState<SubmissionStatus>("idle");
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);

  const openModal = React.useCallback(() => {
    setStatus("idle");
    setModalOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setStatus("idle");
    setModalOpen(false);
  }, []);

  const resetApplication = React.useCallback(() => {
    setStatus("idle");
    setModalOpen(false);
    setForm(EMPTY_FORM);
  }, []);

  const updateField = React.useCallback((field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus((current) => (current === "error" ? "idle" : current));
  }, []);

  const submitApplication = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>, context: SubmissionContext) => {
      event.preventDefault();
      if (staticExport) return;
      if (status === "submitting") return;

      setStatus("submitting");
      try {
        const response = await fetch(assetPath("/api/beta-applications"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, ...context }),
        });
        if (!response.ok) throw new Error(`Application request failed with ${response.status}`);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [form, status],
  );

  return {
    selectedColor,
    setSelectedColor,
    selectedPlan,
    setSelectedPlan,
    modalOpen,
    status,
    submitted: status === "success",
    submitting: status === "submitting",
    form,
    openModal,
    closeModal,
    resetApplication,
    updateField,
    submitApplication,
  };
}

export function ComparisonSection() {
  const { lang } = useLanguage();
  const t = translations[lang].compare;

  return (
    <section id="compare" className="scroll-mt-[76px] bg-[#282724] py-16 text-white sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow light>{t.label}</Eyebrow>
            <h2 className="display-heading display-heading--wide text-[clamp(3.1rem,6vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.065em]">
              {t.title}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/72">{t.desc}</p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/12 sm:rounded-[40px]">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">{t.title}</caption>
              <thead className="bg-white/5 text-[11px] font-bold tracking-[0.09em] text-white/68 uppercase sm:text-xs">
                <tr>
                  <th scope="col" className="w-[36%] p-4 sm:p-6">
                    {t.col1}
                  </th>
                  <th scope="col" className="w-[32%] border-l border-white/12 p-4 sm:p-6">
                    {t.col2}
                  </th>
                  <th scope="col" className="w-[32%] border-l border-white/12 bg-[#dfcfad] p-4 text-[#302e2b] sm:p-6">
                    {t.col3}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, index) => (
                  <motion.tr
                    key={row.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="border-t border-white/10 text-xs sm:text-sm"
                  >
                    <th scope="row" className="p-4 font-semibold text-white/80 sm:p-6">
                      {row.label}
                    </th>
                    <td className="border-l border-white/10 p-4 text-white/60 sm:p-6">{row.old}</td>
                    <td className="border-l border-[#dfcfad]/20 bg-[#dfcfad]/8 p-4 font-bold text-[#dfcfad] sm:p-6">
                      {row.next}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const { lang } = useLanguage();
  const t = translations[lang].faq;
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-[76px] bg-[#f5f3ed] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-12">
        <div>
          <Eyebrow>{t.label}</Eyebrow>
          <h2 className="display-heading display-heading--compact text-[clamp(3rem,5vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.06em] text-[#302e2b]">
            {t.title}
          </h2>
        </div>

        <div className="border-t border-[#302e2b]/15">
          {t.items.map((item, index) => {
            const isOpen = open === index;
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;
            return (
              <div key={item.q} className="border-b border-[#302e2b]/15">
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-5 py-6 text-left sm:py-8"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="flex gap-4 sm:gap-7">
                      <span className="pt-1 font-mono text-[11px] text-[#63786e]">0{index + 1}</span>
                      <span className="text-base font-semibold tracking-[-0.02em] text-[#302e2b] sm:text-xl">
                        {item.q}
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#302e2b]/15"
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.section
                      id={answerId}
                      aria-labelledby={questionId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pr-8 pb-7 pl-10 text-[15px] leading-8 text-[#586c62] sm:pb-9 sm:pl-14 sm:text-base">
                        {item.a}
                      </p>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BetaSection() {
  const { lang } = useLanguage();
  const t = translations[lang].beta;
  const application = useBetaApplication();
  const modalTitleId = "beta-application-modal-title";

  return (
    <section id="beta" className="relative scroll-mt-[76px] overflow-hidden bg-[#e5e5db] py-16 sm:py-24 lg:py-32">
      <div className="paper-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#302e2b]/10 bg-white/50 px-4 py-2 text-xs font-bold tracking-[0.11em] text-[#3e5b4f] uppercase">
            <Zap className="h-3.5 w-3.5 fill-[#f27762] text-[#f27762]" />
            {t.badge}
          </span>
          <h2 className="display-heading display-heading--wide mx-auto mt-6 max-w-4xl text-[clamp(3.2rem,6vw,6.8rem)] leading-[0.9] font-semibold tracking-[-0.07em] text-[#302e2b]">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#566b61]">{t.desc}</p>
        </div>

        <div className="overflow-hidden rounded-[34px] bg-[#f8f6f1] shadow-[0_35px_100px_rgba(48,46,43,0.13)] sm:rounded-[52px]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[430px] overflow-hidden bg-[#302e2b] p-6 sm:min-h-[680px] sm:p-10">
              <div className="paper-grid-dark absolute inset-0 opacity-25" />
              <div className="absolute top-12 -right-20 h-80 w-80 rounded-full border border-[#dfcfad]/18" />
              <div className="absolute top-24 -right-6 h-60 w-60 rounded-full border border-white/10" />
              <span className="relative z-10 inline-flex rounded-full bg-[#f27762] px-3 py-1.5 text-[11px] font-bold tracking-[0.09em] text-white uppercase">
                {t.limitedTag}
              </span>
              <div className="absolute inset-x-0 top-16 h-[320px] sm:top-28 sm:h-[440px]">
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-full w-full"
                >
                  <ProductConceptImage />
                </motion.div>
              </div>
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 sm:inset-x-10 sm:bottom-10">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.11em] text-white/65 uppercase">
                    {localize(lang, "配色意向", "配色意向", "Preferred finish")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{t.colors[application.selectedColor]}</p>
                </div>
                <fieldset className="m-0 flex min-w-0 gap-2 border-0 p-0" aria-label={t.colorLabel}>
                  {PRODUCT_COLORS.map((color, index) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => application.setSelectedColor(index)}
                      className={`h-8 w-8 rounded-full border-2 border-[#302e2b] outline-offset-2 transition ${application.selectedColor === index ? "outline outline-1 outline-[#dfcfad]" : "opacity-60 hover:opacity-100"}`}
                      style={{ backgroundColor: color }}
                      aria-label={t.colors[index]}
                      aria-pressed={application.selectedColor === index}
                    />
                  ))}
                </fieldset>
              </div>
            </div>

            <div className="p-6 sm:p-10 lg:p-14">
              <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#302e2b]/10 pb-7">
                <div>
                  <p className="text-xs font-bold tracking-[0.11em] text-[#61766c] uppercase">PetHealthAI / Gen 01</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.045em] text-[#302e2b] sm:text-3xl">
                    {t.productName}
                  </h3>
                  <p className="mt-2 text-sm text-[#667970]">{t.reviewNote}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold tracking-[-0.04em] text-[#302e2b]">{t.price}</p>
                  <p className="mt-1 max-w-xs text-sm text-[#71827a]">{t.priceNote}</p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {t.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 text-sm leading-6 text-[#50665c]">
                    <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#dfcfad] text-[#302e2b]">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs font-bold tracking-[0.11em] text-[#5b7066] uppercase">{t.planLabel}</p>
                <fieldset className="m-0 grid min-w-0 gap-2 border-0 p-0 sm:grid-cols-3" aria-label={t.planLabel}>
                  {t.plans.map((plan, index) => {
                    const selected = application.selectedPlan === index;
                    return (
                      <button
                        key={plan.label}
                        type="button"
                        onClick={() => application.setSelectedPlan(index)}
                        aria-pressed={selected}
                        className={`relative rounded-[18px] border p-4 text-left transition ${selected ? "border-[#302e2b] bg-[#302e2b] text-white" : "border-[#302e2b]/12 bg-white text-[#302e2b] hover:border-[#302e2b]/35"}`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2 right-3 rounded-full bg-[#f27762] px-2 py-0.5 text-[11px] font-bold text-white">
                            {plan.badge}
                          </span>
                        )}
                        <p className="text-xs font-bold">{plan.label}</p>
                        <p
                          className={`mt-2 font-mono text-sm font-bold ${selected ? "text-[#dfcfad]" : "text-[#3a5e4e]"}`}
                        >
                          {plan.price}
                        </p>
                        <p className={`mt-1 text-[11px] leading-5 ${selected ? "text-white/72" : "text-[#687b72]"}`}>
                          {plan.desc}
                        </p>
                      </button>
                    );
                  })}
                </fieldset>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {t.features.map((feature, index) => {
                  const Icon = PRODUCT_FEATURE_ICONS[index];
                  return (
                    <div key={feature} className="flex items-center gap-2 text-[13px] text-[#50665c]">
                      <Icon className="h-3.5 w-3.5 text-[#655d50]" />
                      {feature}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={application.openModal}
                className="group mt-9 flex h-14 w-full items-center justify-between rounded-full bg-[#dfcfad] px-6 text-sm font-bold text-[#302e2b] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(98,145,43,0.22)]"
              >
                {t.cta}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#302e2b] text-white transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-[#70827a]">{t.ctaNote}</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={application.modalOpen}
        onClose={application.closeModal}
        labelledBy={modalTitleId}
        panelClassName="relative my-auto w-full max-w-md rounded-[32px] bg-[#f8f6f1] p-7 shadow-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={application.closeModal}
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-[#302e2b]/10 text-[#54685e]"
          aria-label={localize(lang, "关闭", "關閉", "Close")}
        >
          <X className="h-4 w-4" />
        </button>

        {!application.submitted ? (
          <>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#302e2b] text-[#dfcfad]">
              <PawPrint className="h-5 w-5" />
            </span>
            <h3 id={modalTitleId} className="mt-6 text-2xl font-bold tracking-[-0.04em] text-[#302e2b]">
              {t.modal.title}
            </h3>
            <p className="mt-2 text-sm text-[#6c7d75]">{t.modal.desc}</p>
            {staticExport && <output className="mt-4 block text-sm text-[#9d382b]">
              {localize(lang, "当前为静态展示站，暂不接收申请，请联系团队。", "目前為靜態展示站，暫不接收申請，請聯絡團隊。", "This static site cannot receive applications. Please contact the team.")}
            </output>}
            <form
              className="mt-7 space-y-4"
              aria-busy={application.submitting}
              onSubmit={(event) =>
                application.submitApplication(event, {
                  lang,
                  color: t.colors[application.selectedColor],
                  plan: t.plans[application.selectedPlan].label,
                })
              }
            >
              {t.modal.fields.map((field, index) => {
                const key = FORM_FIELD_KEYS[index];
                const required = key !== "email";
                return (
                  <label key={field.label} className="block">
                    <span className="mb-2 block text-xs font-bold tracking-[0.09em] text-[#52685d] uppercase">
                      {field.label}
                    </span>
                    <input
                      name={key}
                      type={field.type}
                      value={application.form[key]}
                      onChange={(event) => application.updateField(key, event.target.value)}
                      placeholder={field.placeholder}
                      autoComplete={key === "name" ? "name" : key === "email" ? "email" : "off"}
                      required={required}
                      disabled={staticExport || application.submitting}
                      className="h-12 w-full rounded-2xl border border-[#302e2b]/12 bg-white px-4 text-sm text-[#302e2b] transition outline-none placeholder:text-[#9aa7a0] focus:border-[#45695a]"
                    />
                  </label>
                );
              })}
              <label className="absolute top-auto -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                Website
                <input
                  name="website"
                  value={application.form.website}
                  onChange={(event) => application.updateField("website", event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
              {application.status === "error" && (
                <p
                  role="alert"
                  className="rounded-2xl bg-[#f27762]/10 px-4 py-3 text-center text-xs leading-5 text-[#9d382b]"
                >
                  {localize(
                    lang,
                    "提交暂时失败，请稍后重试。",
                    "提交暫時失敗，請稍後重試。",
                    "Submission failed for now. Please try again shortly.",
                  )}
                </p>
              )}
              <button
                type="submit"
                disabled={staticExport || application.submitting}
                className="h-13 w-full rounded-full bg-[#302e2b] text-sm font-bold text-white transition hover:bg-[#514b41] disabled:cursor-wait disabled:opacity-65"
              >
                {application.submitting ? localize(lang, "提交中…", "提交中…", "Submitting…") : t.modal.submit}
              </button>
              <p className="text-center text-xs leading-5 text-[#74867d]">{t.modal.privacy}</p>
            </form>
          </>
        ) : (
          <div className="py-10 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dfcfad] text-[#302e2b]">
              <Check className="h-7 w-7" strokeWidth={2.4} />
            </span>
            <h3 id={modalTitleId} className="mt-6 text-2xl font-bold tracking-[-0.04em] text-[#302e2b]">
              {t.modal.successTitle}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#6a7b73]">{t.modal.successDesc}</p>
            <button
              type="button"
              onClick={application.resetApplication}
              className="mt-7 h-12 rounded-full bg-[#302e2b] px-8 text-sm font-bold text-white"
            >
              {t.modal.close}
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
