"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/constants";

interface NavDict {
  nav: {
    home: string;
    services: string;
    about: string;
    contact: string;
    bookCall: string;
  };
}

interface NavbarProps {
  locale: Locale;
  dict: NavDict;
}

const navLinks = [
  { href: "", key: "home" as const },
  { href: "#process", key: "services" as const },
  { href: "#about", key: "about" as const },
  { href: "#contact", key: "contact" as const },
];

export function Navbar({ locale, dict }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-foreground/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href={base}
          className="inline-flex items-center gap-2 text-xl font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#7B61FF] focus:ring-offset-2 rounded"
        >
          <Image
            src="/logo.png"
            alt=""
            width={30}
            height={30}
            className="h-10 w-auto shrink-0"
            priority
          />
          Tbilisi AI
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map(({ href, key }) => (
            <Link
              key={key}
              href={href === "" ? base : `${base}${href}`}
              className="text-sm font-medium text-subtitle/80 hover:text-subtitle transition focus:outline-none focus:ring-2 focus:ring-[#7B61FF] focus:ring-offset-2 rounded"
            >
              {dict.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <div className="hidden md:block">
            <Button href={`${base}#contact`} variant="primary">
              {dict.nav.bookCall}
            </Button>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            id="mobile-menu-btn"
            className="md:hidden flex flex-col gap-1.5 p-2 text-subtitle focus:outline-none focus:ring-2 focus:ring-[#7B61FF] focus:ring-offset-2 rounded"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-foreground/5 bg-background"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {navLinks.map(({ href, key }) => (
                <Link
                  key={key}
                  href={href === "" ? base : `${base}${href}`}
                  className="py-2 text-sm font-medium text-subtitle/80 hover:text-subtitle"
                  onClick={() => setOpen(false)}
                >
                  {dict.nav[key]}
                </Link>
              ))}
              <div className="pt-2">
                <Button href={`${base}#contact`} variant="primary">
                  {dict.nav.bookCall}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}