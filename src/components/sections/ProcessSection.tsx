"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { ProcessStepCard } from "@/components/ui/ProcessStepCard";
import type { ProcessDict } from "@/types/process";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export interface ProcessSectionProps {
  dict: ProcessDict;
  /** Override container stagger variants */
  containerVariants?: Variants;
  /** Override item scroll-reveal variants */
  itemVariants?: Variants;
}

export function ProcessSection({
  dict,
  containerVariants: containerVariantsOverride,
  itemVariants: itemVariantsOverride,
}: ProcessSectionProps) {
  const container = containerVariantsOverride ?? containerVariants;
  const item = itemVariantsOverride ?? itemVariants;

  return (
    <Section id="process">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-foreground md:text-4xl"
      >
        {dict.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="mt-3 text-lg text-subtitle/80"
      >
        {dict.subtitle}
      </motion.p>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={container}
        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {dict.steps.map((step) => (
          <motion.div key={step.stepNumber} variants={item}>
            <ProcessStepCard
              stepNumber={step.stepNumber}
              title={step.title}
              topics={step.topics}
              icon={step.icon}
              iconColor={step.iconColor}
            />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
