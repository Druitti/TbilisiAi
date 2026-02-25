import { type ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  muted = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${muted ? "bg-muted" : "bg-background"} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {children}
      </div>
    </section>
  );
}