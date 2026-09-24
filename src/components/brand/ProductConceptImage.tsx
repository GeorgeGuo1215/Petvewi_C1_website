"use client";

import Image from "next/image";
import { assetPath } from "@/lib/assetPath";

import { useLanguage } from "@/i18n/LanguageProvider";
import { localize } from "@/i18n/translations";

export function ProductConceptImage({ priority = false }: { priority?: boolean }) {
  const { lang } = useLanguage();
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#f4eee6]">
      <Image
        src={assetPath("/collar-new.png")}
        alt={localize(
          lang,
          "PetHealthAI 智能健康项圈：白色织带与圆角健康监测模块",
          "PetHealthAI 智能健康項圈：白色織帶與圓角健康監測模組",
          "PetHealthAI smart health collar with a white woven strap and rounded monitoring module",
        )}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 48vw, 100vw"
        className="object-contain p-4"
      />
      <span className="absolute right-3 bottom-3 rounded-full border border-[#302e2b]/10 bg-[#fbfaf6]/90 px-3 py-1.5 text-[10px] font-medium text-[#655d50]">
        {localize(lang, "产品研发中 · 尚未发售", "產品研發中 · 尚未發售", "In development · Not yet available")}
      </span>
    </div>
  );
}
