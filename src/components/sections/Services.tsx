"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";

interface ServiceItem {
  id: string;
  title: string;
}

interface ServicesDict {
  title: string;
  items: ServiceItem[];
}

interface ServicesProps {
  dict: ServicesDict;
}

const icons: Record<string, React.ReactNode> = {
  chatbots: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#7B61FF]"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  workflow: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#00C2FF]"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  crm: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#00E5A8]"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  leads: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#7B61FF]"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-4-4v-2" />
      <path d="M18 11a4 4 0 0 1 0 8" />
    </svg>
  ),
};

export function Services({ dict }: ServicesProps) {
  return (
    <Section id="services" className="relative overflow-hidden">



      <div className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-subtitle md:text-4xl"
      >
        
        {dict.title}
      </motion.h2>
      
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {dict.items.map((service) => (
          <motion.div
            key={service.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm transition-shadow hover:shadow-glow"
          >
            <div className="mb-4">
              {icons[service.id] ?? icons.chatbots}
            </div>
            <h3 className="text-lg font-semibold text-subtitle">
              {service.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
      
    </Section>
  );
}