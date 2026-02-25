"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { ProcessStepIcon } from "@/components/icons/ProcessStepIcon";

export interface ProcessStepCardProps {
  stepNumber: string;
  title: string;
  topics: string[];
  /** Icon name from JSON (e.g. "lightbulb", "pen-ruler"). Rendered via Font Awesome if present. */
  icon?: string;
  /** CSS color for the icon (e.g. "#7B61FF"). */
  iconColor?: string;
  /** Override scroll-reveal variants from parent */
  variants?: Variants;
  initial?: string;
  animate?: string;
  transition?: { duration?: number; delay?: number };
  /** Override hover animation; default: { scale: 1.02 } */
  whileHover?: { scale?: number } | false;
}

const defaultWhileHover = { scale: 1.02 };

export function ProcessStepCard({
  stepNumber,
  title,
  topics,
  icon,
  iconColor,
  variants,
  initial = "hidden",
  animate = "show",
  transition,
  whileHover = defaultWhileHover,
}: ProcessStepCardProps) {
  const resolvedIconColor = icon ? (iconColor ?? "#7B61FF") : undefined;

  return (
    <motion.div
  {...(variants && { variants, initial, animate, transition })}
  {...(whileHover !== false && { whileHover: whileHover })}
  className="
    relative
    h-full
    rounded-2xl
    bg-background
    p-6
    shadow-sm
    transition-shadow
    hover:shadow-glow
    process-card-border
    px-6
    flex flex-col
  "
>
  {icon && resolvedIconColor && (
    <div
      className="absolute left-4 top-4 flex h-14 w-14 items-center justify-center rounded-full border-[3px]"
      style={{
        backgroundColor: `${resolvedIconColor}22`,
        borderColor: resolvedIconColor,
      }}
      aria-hidden
    >
      <ProcessStepIcon icon={icon} color={resolvedIconColor} className="text-xl" />
    </div>
  )}
  <span
    className="
    absolute right-4 top-4
    flex items-center justify-center
    h-8 w-8
    rounded-full
    bg-[#7B61FF]/10
    text-[#7B61FF]
    text-xs font-semibold
    border border-[#7B61FF]/30
    backdrop-blur-sm
  "
  aria-hidden
>
  {stepNumber}
</span>

<div className="space-y-4 mt-16 flex-1 flex flex-col">
  <h3 className="text-lg font-semibold text-subtitle">{title}</h3>

  <ul className="space-y-2 text-sm text-subtitle/70 mt-2">
    {topics.map((topic, i) => (
      <li key={i} className="flex items-start gap-0">
        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-subtitle/40" />
        <span>{topic}</span>
      </li>
    ))}
  </ul>
</div>
</motion.div>
  );
}
