"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heading, BodyText } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("terms");
  
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <Heading level={1} gutterBottom>{t("title")}</Heading>
        <BodyText muted className="mb-8">
          {t("lastUpdated")}: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </BodyText>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <section>
              <Heading level={2} gutterBottom>{t("section1.title")}</Heading>
              <BodyText>
                {t("section1.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section2.title")}</Heading>
              <BodyText weight="semibold" className="mb-2">{t("section2.creationTitle")}:</BodyText>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><BodyText>{t("section2.item1")}</BodyText></li>
                <li><BodyText>{t("section2.item2")}</BodyText></li>
                <li><BodyText>{t("section2.item3")}</BodyText></li>
                <li><BodyText>{t("section2.item4")}</BodyText></li>
              </ul>
              <BodyText weight="semibold" className="mb-2">{t("section2.terminationTitle")}:</BodyText>
              <BodyText>
                {t("section2.terminationContent")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section3.title")}</Heading>
              <BodyText weight="semibold" className="mb-2">{t("section3.mustTitle")}:</BodyText>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><BodyText>{t("section3.must1")}</BodyText></li>
                <li><BodyText>{t("section3.must2")}</BodyText></li>
                <li><BodyText>{t("section3.must3")}</BodyText></li>
                <li><BodyText>{t("section3.must4")}</BodyText></li>
                <li><BodyText>{t("section3.must5")}</BodyText></li>
              </ul>
              <BodyText weight="semibold" className="mb-2">{t("section3.prohibitedTitle")}:</BodyText>
              <ul className="list-disc pl-6 space-y-2">
                <li><BodyText>{t("section3.prohibited1")}</BodyText></li>
                <li><BodyText>{t("section3.prohibited2")}</BodyText></li>
                <li><BodyText>{t("section3.prohibited3")}</BodyText></li>
                <li><BodyText>{t("section3.prohibited4")}</BodyText></li>
              </ul>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section4.title")}</Heading>
              <BodyText className="mb-4">
                {t("section4.intro")}
              </BodyText>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><BodyText>{t("section4.item1")}</BodyText></li>
                <li><BodyText>{t("section4.item2")}</BodyText></li>
                <li><BodyText>{t("section4.item3")}</BodyText></li>
              </ul>
              <BodyText>
                {t("section4.fee")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section5.title")}</Heading>
              <BodyText className="mb-4">
                {t("section5.content1")}
              </BodyText>
              <BodyText>
                {t("section5.content2")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section6.title")}</Heading>
              <BodyText className="mb-4">
                {t("section6.content1")}
              </BodyText>
              <BodyText>
                {t("section6.content2")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section7.title")}</Heading>
              <BodyText className="mb-4">
                {t("section7.intro")}
              </BodyText>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><BodyText>{t("section7.item1")}</BodyText></li>
                <li><BodyText>{t("section7.item2")}</BodyText></li>
                <li><BodyText>{t("section7.item3")}</BodyText></li>
                <li><BodyText>{t("section7.item4")}</BodyText></li>
              </ul>
              <BodyText>
                {t("section7.conclusion")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section8.title")}</Heading>
              <BodyText className="mb-4">
                {t("section8.intro")}
              </BodyText>
              <ul className="list-disc pl-6 space-y-2">
                <li><BodyText>{t("section8.item1")}</BodyText></li>
                <li><BodyText>{t("section8.item2")}</BodyText></li>
                <li><BodyText>{t("section8.item3")}</BodyText></li>
                <li><BodyText>{t("section8.item4")}</BodyText></li>
                <li><BodyText>{t("section8.item5")}</BodyText></li>
                <li><BodyText>{t("section8.item6")}</BodyText></li>
              </ul>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section9.title")}</Heading>
              <BodyText>
                {t("section9.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section10.title")}</Heading>
              <BodyText>
                {t("section10.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section11.title")}</Heading>
              <BodyText>
                {t("section11.intro")}
              </BodyText>
              <ul className="list-none mt-4 space-y-1">
                <li><BodyText weight="semibold">{t("section11.email")}</BodyText></li>
                <li><BodyText weight="semibold">{t("section11.address")}</BodyText></li>
                <li><BodyText weight="semibold">{t("section11.phone")}</BodyText></li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
