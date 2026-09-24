"use client";
import { assetPath } from "@/lib/assetPath";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { BrandMark } from "@/components/brand/BrandMark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { getLocalizedPath } from "@/i18n/config";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localize, translations } from "@/i18n/translations";

const SECTION_IDS = ["product", "hardware", "intelligence", "company"] as const;

function useActiveSection() {
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -62%", threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function HomeHeader() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const activeSection = useActiveSection();
  const navigationLabel = localize(lang, "主导航", "主導覽", "Main navigation");
  const mobileNavigationLabel = localize(lang, "移动端导航", "行動版導覽", "Mobile navigation");
  const menuButtonLabel = open
    ? localize(lang, "关闭导航", "關閉導覽", "Close navigation")
    : localize(lang, "打开导航", "開啟導覽", "Open navigation");
  useBodyScrollLock(open);

  React.useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setScrolled(window.scrollY > 30));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  const links = React.useMemo(
    () => [
      { id: "product", href: "#product", label: localize(lang, "产品系统", "產品系統", "Product") },
      { id: "hardware", href: "#hardware", label: localize(lang, "核心科技", "核心科技", "Technology") },
      { id: "intelligence", href: "#intelligence", label: "PetMind" },
      { id: "company", href: "#company", label: localize(lang, "关于我们", "關於我們", "Company") },
      {
        id: "explore",
        href: getLocalizedPath("/explore", lang),
        label: localize(lang, "服务地图", "服務地圖", "Explore"),
      },
    ],
    [lang],
  );

  const navigateToSection = React.useCallback((href: string) => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    });
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[#302e2b]/8 bg-[#f4f0e9]/88 shadow-[0_10px_40px_rgba(48,46,43,0.06)] backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <BrandMark href={getLocalizedPath("/", lang)} />

        <nav className="hidden items-center gap-9 lg:flex" aria-label={navigationLabel}>
          {links.map((link) => (
            <a
              key={link.href}
              href={assetPath(link.href)}
              aria-current={activeSection === link.id ? "location" : undefined}
              className={`text-[13px] font-semibold transition-colors ${
                activeSection === link.id ? "text-[#302e2b]" : "text-[#5b6d65] hover:text-[#302e2b]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <LanguageSwitcher lang={lang} onChange={setLang} />
          </div>
          <a
            href="#beta"
            className="hidden h-10 items-center gap-2 rounded-full bg-[#302e2b] px-5 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#514b41] sm:inline-flex"
          >
            {t.nav.preorder}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#302e2b]/10 bg-white/70 text-[#302e2b] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={menuButtonLabel}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#302e2b]/8 bg-[#f4f0e9] lg:hidden"
          >
            <nav className="space-y-1 px-5 py-5" aria-label={mobileNavigationLabel}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={assetPath(link.href)}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  onClick={(event) => {
                    if (link.href.startsWith("#")) {
                      event.preventDefault();
                      navigateToSection(link.href);
                    } else {
                      setOpen(false);
                    }
                  }}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-[#40564d] hover:bg-white"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
              <div className="grid gap-3 px-4 pt-3 sm:hidden">
                <LanguageSwitcher lang={lang} onChange={setLang} fullWidth onSelect={() => setOpen(false)} />
                <a
                  href="#beta"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToSection("#beta");
                  }}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#302e2b] text-[13px] font-bold text-white"
                >
                  {t.nav.preorder}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
