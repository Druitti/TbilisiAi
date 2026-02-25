"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/constants";
import { LOCALES } from "@/lib/constants";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const basePath = pathname?.replace(/^\/(en|pt-BR)/, "") || "";

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-foreground/80">
      {LOCALES.map((locale) => {
        const href = `/${locale}${basePath}`;
        const isActive = currentLocale === locale;
        return (
          <Link
            key={locale}
            href={href}
            className={`rounded px-2 py-1 transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[#7B61FF] focus:ring-offset-2 ${
              isActive ? "text-foreground font-semibold" : ""
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            {locale === "pt-BR" ? "PT" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}