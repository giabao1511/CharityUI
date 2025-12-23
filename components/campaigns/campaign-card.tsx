"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BodyText } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/currency";
import { CampaignItem } from "@/types/fund";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface CampaignCardProps {
  campaign: CampaignItem;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const t = useTranslations("campaigns.card");
  const percentageFunded = Math.round(
    (campaign.currentAmount / campaign.targetAmount) * 100
  );
  const daysLeft = Math.ceil(
    (new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div
        className="aspect-video w-full overflow-hidden bg-muted"
        aria-hidden="true"
      >
        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">{t("image")}</span>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-xl min-h-[3.5rem]">
            {campaign.title}
          </CardTitle>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {campaign.category.categoryName}
          </span>
        </div>
        <CardDescription className="line-clamp-2">
          {campaign.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-lg">
              {formatCurrency(campaign.currentAmount)}
            </span>
            <span className="text-muted-foreground">
              of {formatCurrency(campaign.targetAmount)}
            </span>
          </div>
          <Progress value={percentageFunded} className="h-2" />
          <BodyText size="sm" muted className="mt-2">
            {percentageFunded}% {t("funded")}
          </BodyText>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>
              {daysLeft > 0 ? t("daysLeft", { days: daysLeft }) : t("ended")}
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {t("by")}{" "}
          {campaign.organization && (
            <Link
              href={`/organizations/${campaign.organization.orgId}`}
              className="font-medium text-foreground hover:text-primary transition-colors hover:underline"
            >
              {campaign.organization.orgName}
            </Link>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaign.campaignId}`}>
            {t("viewCampaign")}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
