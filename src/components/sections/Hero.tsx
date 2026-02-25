"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const InfiniteNeuralField = dynamic(
  () =>
    import("@/components/backgrounds/NeuralBackground").then((m) => m.InfiniteNeuralField),
  { ssr: false }
);

interface HeroDict {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

interface HeroProps {
  dict: HeroDict;
  locale: string;
}

export function Hero({ dict, locale }: HeroProps) {
  const base = `/${locale}`;
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background px-6 pt-24 pb-20 md:px-8"
    >
      {/* 3D infinite neural background */}
      <InfiniteNeuralField  />

      {/* Subtle grid background (below 3D canvas) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(123,97,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(123,97,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          {dict.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg text-subtitle/80 sm:text-xl md:text-2xl"
        >
          {dict.subheadline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href={`${base}#contact`} variant="primary">
            {dict.ctaPrimary}
          </Button>
          <Button href={`${base}#contact`} variant="secondary">
            {dict.ctaSecondary}
          </Button>
        </motion.div>
      </div>

      {/* Soft gradient glow at bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#7B61FF]/5 to-transparent"
        aria-hidden
      />
    </section>
  );
}