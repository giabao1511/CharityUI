import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BodyText, Heading, Large } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { platformStats } from "@/lib/data";
import { ArrowRight, Heart, Target, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <Heading level={1} className="sm:text-5xl md:text-6xl lg:text-7xl">
              {t("hero.title")}
              <span className="block text-primary">
                {t("hero.titleHighlight")}
              </span>
            </Heading>
            <BodyText size="lg" className="sm:text-xl md:text-2xl" muted>
              {t("hero.subtitle")}
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/campaigns">
                  {t("hero.exploreCampaigns")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/campaigns">{t("hero.startFundraiser")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      {/* <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.totalRaised")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Large>${platformStats.totalRaised.toLocaleString()}</Large>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.totalRaisedDesc")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.totalFunds")}
                </CardTitle>
                <Target
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <Large>{platformStats.totalCampaigns}</Large>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.activeFundsCount", {
                    count: platformStats.activeCampaigns,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.activeFunds")}
                </CardTitle>
                <Heart
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <Large>{platformStats.activeCampaigns}</Large>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.raisingFundsNow")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("stats.totalBackers")}
                </CardTitle>
                <Users
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <Large>{platformStats.totalBackers.toLocaleString()}</Large>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("stats.peopleMakingDifference")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Featured Campaigns */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div className="space-y-2">
              <Heading level={2} className="md:text-4xl">
                {t("featured.title")}
              </Heading>
              <BodyText size="lg" muted>
                {t("featured.subtitle")}
              </BodyText>
            </div>
            <Button variant="outline" asChild className="mt-4 md:mt-0">
              <Link href="/campaigns">
                {t("featured.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Heading level={2} className="md:text-4xl lg:text-5xl">
              {t("cta.title")}
            </Heading>
            <BodyText size="lg" className="md:text-xl opacity-90">
              {t("cta.subtitle")}
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/campaigns">{t("cta.startFund")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/campaigns">{t("cta.browseFunds")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
