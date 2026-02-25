"use client";

import { motion } from "framer-motion";
import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";

interface ContactDict {
  title: string;
  name: string;
  email: string;
  message: string;
  submit: string;
}

interface ContactProps {
  dict: ContactDict;
}

export function Contact({ dict }: ContactProps) {
  return (
    <section
      id="contact"
      className="bg-muted py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground md:text-4xl"
        >
          {dict.title}
        </motion.h2>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          action={submitContact}
          method="post"
          className="mt-10 max-w-xl space-y-6"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-subtitle">
              {dict.name}
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              autoComplete="name"
              className="mt-2 block w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-subtitle placeholder:text-subtitle/50 focus:border-[#7B61FF] focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20"
              placeholder={dict.name}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-subtitle">
              {dict.email}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-2 block w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-subtitle placeholder:text-subtitle/50 focus:border-[#7B61FF] focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20"
              placeholder={dict.email}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-subtitle">
              {dict.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              className="mt-2 block w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-subtitle placeholder:text-subtitle/50 focus:border-[#7B61FF] focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/20 resize-y"
              placeholder={dict.message}
            />
          </div>

          
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-4 flex "
          
        ><Button type="submit" variant="primary">
        {dict.submit}
      </Button>
           </motion.div>

  
        
        </motion.form>
      </div>
    </section>
  );
}