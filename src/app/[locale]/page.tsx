import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/constants";
import { getDictionary } from "@/i18n/getDictionary";
import { Hero } from "@/components/sections/Hero";
// import { Services } from "@/components/sections/Services";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import type { ProcessDict } from "@/types/process";

export default async function LocalePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Hero dict={dict.hero} locale={locale} />
      {/* <Authority dict={dict.authority} /> */}
      {/* <Services dict={dict.services} /> */}
      <ProcessSection dict={dict.process as ProcessDict} />
      <About dict={dict.about} />
      <Contact dict={dict.contact} />
    </>
  );
}
