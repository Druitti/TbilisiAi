export const LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
