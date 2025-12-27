"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyText, Heading } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/currency";
import type { Organization } from "@/types/organization";
import { ArrowRight, Briefcase, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface OrganizationTabsProps {
  organization: Organization;
}

export function OrganizationTabs({ organization }: OrganizationTabsProps) {
  const [activeTab, setActiveTab] = useState("about");
  const t = useTranslations("organizations.detail");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">{t("about")}</TabsTrigger>
        <TabsTrigger value="campaigns">
          {t("campaigns")} ({organization.campaigns?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="media">
          {t("media")} ({organization.media?.length || 0})
        </TabsTrigger>
      </TabsList>

      {/* About Tab */}
      <TabsContent value="about" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Heading level={3} gutterBottom>
              {organization.orgName}
            </Heading>
            <div className="prose dark:prose-invert max-w-none">
              <BodyText muted className="whitespace-pre-wrap">
                {organization.description ||
                  t("noDescription", {
                    defaultValue: "No description available",
                  })}
              </BodyText>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Campaigns Tab */}
      <TabsContent value="campaigns" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Heading level={3} className="mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t("campaigns")}
            </Heading>
            {organization.campaigns && organization.campaigns.length > 0 ? (
              <div className="space-y-4">
                {organization.campaigns.map((campaign) => (
                  <Link
                    key={campaign.campaignId}
                    href={`/campaigns/${campaign.campaignId}`}
                    className="block border rounded-lg p-4 hover:bg-accent/50 hover:border-primary transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Heading
                        level={4}
                        className="mb-0 group-hover:text-primary transition-colors"
                      >
                        {campaign.title}
                      </Heading>
                      <Badge
                        variant={
                          campaign.status.campaignStatusId === 1
                            ? "default"
                            : "secondary"
                        }
                      >
                        {campaign.status.statusName}
                      </Badge>
                    </div>
                    <BodyText size="sm" muted className="line-clamp-2 mb-3">
                      {campaign.description}
                    </BodyText>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          {t("raisedOf")}{" "}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(campaign.targetAmount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {Math.round(
                            (campaign.currentAmount / campaign.targetAmount) *
                              100
                          )}
                          %
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <BodyText muted>{t("noCampaigns")}</BodyText>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Media Tab */}
      <TabsContent value="media" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Heading level={3} className="mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              {t("mediaGallery")}
            </Heading>
            {organization.media && organization.media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {organization.media.map((media) => (
                  <div
                    key={media.orgMediaId}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={media.url}
                      alt={`${organization.orgName} media`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <BodyText muted>{t("noMedia")}</BodyText>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
