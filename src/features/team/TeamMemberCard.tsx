"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";

import { getInitials } from "@/lib/name";

import type { TeamMember } from "./types";

export function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex h-full w-full flex-col rounded-[28px] border border-[#dfcfad]/30 bg-[#f8f6f1] p-6 text-[#302e2b] sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[#c9b994]/60 bg-[#e7ded0]">
          {member.image ? (
            <Image src={assetPath(member.image)} alt={member.name} fill sizes="80px" className="object-cover" />
          ) : (
            <span className="font-mono text-2xl font-medium tracking-[-0.05em] text-[#655d50]">
              {getInitials(member.name)}
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-[#746c60]">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em]">{member.name}</h3>
      <p className="mt-3 self-start rounded-full border border-[#c9b994]/50 bg-[#eee6d8] px-3 py-1.5 text-xs font-semibold text-[#655d50]">
        {member.role}
      </p>
      <ul className="mt-6 space-y-3 border-t border-[#302e2b]/10 pt-5">
        {member.desc.map((description) => (
          <li key={description} className="flex gap-3 text-sm leading-7 text-[#655f56]">
            <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-[#a99670]" />
            <span>{description}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
