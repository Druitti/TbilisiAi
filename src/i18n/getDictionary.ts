import type { Locale } from "@/lib/constants";
import en from "./en.json";
import ptBR from "./pt-BR.json";

const dictionaries = { en, "pt-BR": ptBR } as const;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}
