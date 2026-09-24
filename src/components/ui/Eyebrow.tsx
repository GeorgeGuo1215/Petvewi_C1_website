import type { ReactNode } from "react";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`eyebrow-label mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.17em] ${light ? "text-[#dfcfad]" : "text-[#496258]"}`}>
      <span className={`h-px w-8 ${light ? "bg-[#dfcfad]" : "bg-[#759187]"}`} />
      {children}
    </div>
  );
}
