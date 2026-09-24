import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import Link from "next/link";

type BrandMarkProps = {
  inverse?: boolean;
  compact?: boolean;
  href?: string;
};

export function BrandMark({ inverse = false, compact = false, href = "/" }: BrandMarkProps) {
  const markSize = compact ? "h-9 w-9 rounded-[13px]" : "h-10 w-10 rounded-[14px]";
  const imageSize = compact ? "h-7 w-7" : "h-8 w-8";

  return (
    <Link href={href} className="group flex items-center gap-3" aria-label="PetHealthAI">
      <span
        className={`relative grid place-items-center overflow-hidden border transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105 ${markSize} ${
          inverse ? "border-white/15 bg-white/10" : "border-[#302e2b]/10 bg-white"
        }`}
      >
        <Image src={assetPath("/logo.png")} alt="" draggable={false} width={34} height={34} className={`${imageSize} object-contain object-top`} priority />
      </span>
      <span className={`${compact ? "text-sm" : "text-[15px]"} font-bold tracking-[-0.035em] ${inverse ? "text-white" : "text-[#302e2b]"}`}>
        PetHealth<span className="text-[#5a7a6d]">AI</span>
      </span>
    </Link>
  );
}
