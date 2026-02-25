import { notFound } from "next/navigation";
import { LOCALES, isValidLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/i18n/getDictionary";
import { Navbar } from "@/components/layout/Navbar";
import { LangSetter } from "@/components/LangSetter";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <a
        href="#contact"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-6 focus:z-[100] focus:rounded focus:ring-2 focus:ring-[#7B61FF] focus:ring-offset-2 focus:px-4 focus:py-2 focus:bg-background"
      >
        {(dict as { common: { skipToContact: string } }).common.skipToContact}
      </a>
      <LangSetter locale={locale as Locale} />
      <Navbar locale={locale as Locale} dict={dict} />
      <main id="main-content">{children}</main>
    </>
  );
}
