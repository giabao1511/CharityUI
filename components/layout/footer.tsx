import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { BodyText, Heading } from "@/components/ui/typography";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Heart
                className="h-6 w-6 text-primary"
                fill="currentColor"
                aria-hidden="true"
              />
              <span className="text-xl font-bold">CharityHub</span>
            </Link>
            <BodyText size="sm" muted>
              {t("description")}
            </BodyText>
          </div>

          {/* Quick Links */}
          <div>
            <Heading level={3} className="mb-4 text-sm">
              {t("quickLinks.title")}
            </Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("quickLinks.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("quickLinks.campaigns")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("quickLinks.contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <Heading level={3} className="mb-4 text-sm">
              {t("support.title")}
            </Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("support.helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("support.safetySecurity")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("support.termOfService")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("support.privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <Heading level={3} className="mb-4 text-sm">
              {t("community.title")}
            </Heading>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("community.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("community.successStories")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("community.press")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("community.career")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} CharityHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
