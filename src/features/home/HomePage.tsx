"use client";

import { MotionConfig } from "motion/react";

import { ScrollProgress } from "@/components/ScrollProgress";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import type { Lang } from "@/i18n/translations";

import { CompanySection, SocialSection } from "./CompanySections";
import { ContentGatewaySection } from "./ContentGatewaySection";
import { BetaSection, ComparisonSection, FAQSection } from "./ConversionSections";
import { HeroSection, ProductSystemSection } from "./HeroSections";
import { HomeFooter } from "./HomeFooter";
import { HomeHeader } from "./HomeHeader";
import { TeamPreviewSection } from "./TeamPreviewSection";
import { EverydayCareSection, HardwareSection, IntelligenceSection, ProblemSection } from "./TechnologySections";

export function HomePage({ initialLang = "zh" }: { initialLang?: Lang }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <MotionConfig reducedMotion="user">
        <main className="min-h-screen overflow-x-hidden bg-[#f4f0e9] text-[#302e2b]">
          <ScrollProgress />
          <HomeHeader />
          <HeroSection />
          <ProductSystemSection />
          <ProblemSection />
          <HardwareSection />
          <IntelligenceSection />
          <EverydayCareSection />
          <SocialSection />
          <CompanySection />
          <TeamPreviewSection />
          <ComparisonSection />
          <FAQSection />
          <ContentGatewaySection />
          <BetaSection />
          <HomeFooter />
        </main>
      </MotionConfig>
    </LanguageProvider>
  );
}
