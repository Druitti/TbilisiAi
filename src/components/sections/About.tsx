"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";

interface AboutDict {
  title: string;
  paragraph: string;
}

interface AboutProps {
  dict: AboutDict;
}

export function About({ dict }: AboutProps) {
  return (
    <Section id="about" muted>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl"
      >
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          {dict.title}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-subtitle/85">
          {dict.paragraph}
        </p>
      </motion.div>
    </Section>
  );
}