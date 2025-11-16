"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heading, BodyText } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  
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
              <BodyText className="mb-4">
                {t("section1.intro")}
              </BodyText>
              <BodyText weight="semibold" className="mb-2">{t("section1.youProvideTitle")}:</BodyText>
              <ul className="list-disc pl-6 space-y-2">
                <li><BodyText>{t("section1.item1")}</BodyText></li>
                <li><BodyText>{t("section1.item2")}</BodyText></li>
                <li><BodyText>{t("section1.item3")}</BodyText></li>
                <li><BodyText>{t("section1.item4")}</BodyText></li>
              </ul>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section2.title")}</Heading>
              <BodyText className="mb-4">
                {t("section2.intro")}
              </BodyText>
              <ul className="list-disc pl-6 space-y-2">
                <li><BodyText>{t("section2.item1")}</BodyText></li>
                <li><BodyText>{t("section2.item2")}</BodyText></li>
                <li><BodyText>{t("section2.item3")}</BodyText></li>
                <li><BodyText>{t("section2.item4")}</BodyText></li>
                <li><BodyText>{t("section2.item5")}</BodyText></li>
              </ul>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section3.title")}</Heading>
              <BodyText className="mb-4">
                {t("section3.intro")}
              </BodyText>
              <ul className="list-disc pl-6 space-y-2">
                <li><BodyText>{t("section3.item1")}</BodyText></li>
                <li><BodyText>{t("section3.item2")}</BodyText></li>
                <li><BodyText>{t("section3.item3")}</BodyText></li>
                <li><BodyText>{t("section3.item4")}</BodyText></li>
              </ul>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section4.title")}</Heading>
              <BodyText>
                {t("section4.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section5.title")}</Heading>
              <BodyText className="mb-4">
                {t("section5.intro")}
              </BodyText>
              <ul className="list-disc pl-6 space-y-2">
                <li><BodyText>{t("section5.item1")}</BodyText></li>
                <li><BodyText>{t("section5.item2")}</BodyText></li>
                <li><BodyText>{t("section5.item3")}</BodyText></li>
                <li><BodyText>{t("section5.item4")}</BodyText></li>
                <li><BodyText>{t("section5.item5")}</BodyText></li>
              </ul>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section6.title")}</Heading>
              <BodyText>
                {t("section6.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section7.title")}</Heading>
              <BodyText>
                {t("section7.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section8.title")}</Heading>
              <BodyText>
                {t("section8.content")}
              </BodyText>
            </section>

            <section>
              <Heading level={2} gutterBottom>{t("section9.title")}</Heading>
              <BodyText>
                {t("section9.intro")}
              </BodyText>
              <ul className="list-none mt-4 space-y-1">
                <li><BodyText weight="semibold">{t("section9.email")}</BodyText></li>
                <li><BodyText weight="semibold">{t("section9.address")}</BodyText></li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
