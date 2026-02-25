"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProcessStepIcon } from "./processStepIcons";

export interface ProcessStepIconProps {
  /** Icon name from JSON (e.g. "lightbulb", "pen-ruler", "rocket"). Must be in processStepIcons registry. */
  icon: string;
  /** Optional color: CSS color (hex, rgb, or Tailwind class applied via style/className). */
  color?: string;
  /** Optional size: Font Awesome size (e.g. "sm", "lg", "2x") or Tailwind text class. */
  className?: string;
}

export function ProcessStepIcon({ icon, color, className = "text-xl" }: ProcessStepIconProps) {
  const definition = getProcessStepIcon(icon);
  if (!definition) return null;

  const style = color ? { color } : undefined;

  return (
    <span
      className={className}
      style={style}
      aria-hidden
    >
      <FontAwesomeIcon icon={definition} />
    </span>
  );
}
