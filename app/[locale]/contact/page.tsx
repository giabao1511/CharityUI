import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Heading, BodyText } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <Heading level={1} gutterBottom>{t("title")}</Heading>
          <BodyText size="lg" muted>
            {t("subtitle")}
          </BodyText>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  {t("email")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">{t("sendEmail")}</p>
                <a href="mailto:support@charityhub.com" className="text-sm font-medium hover:text-primary transition-colors">
                  support@charityhub.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  {t("phone")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">{t("callUs")}</p>
                <a href="tel:+1234567890" className="text-sm font-medium hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t("office")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">{t("visitUs")}</p>
                <address className="text-sm font-medium not-italic">
                  UIT<br />
                  Ho Chi Minh City<br />
                  Vietnam
                </address>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>{t("officeHours")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>{t("mondayFriday")}</p>
                <p>{t("saturday")}</p>
                <p>{t("sunday")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Client Component */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
