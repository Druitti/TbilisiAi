"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";

interface AuthorityDict {
  metric1: string;
  metric2: string;
  metric3: string;
}

interface AuthorityProps {
  dict: AuthorityDict;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Authority({ dict }: AuthorityProps) {
  const metrics = [dict.metric1, dict.metric2, dict.metric3];

  return (
    <Section id="authority" muted>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {metrics.map((text, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm transition-shadow hover:shadow-glow"
          >
            <p className="text-2xl font-semibold text-subtitle md:text-3xl">
              {text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}