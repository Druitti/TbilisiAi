"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/constants";

export function LangSetter({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
