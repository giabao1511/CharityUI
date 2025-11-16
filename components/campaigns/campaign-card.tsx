"use client";

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Fund } from "@/types";
import { Users, Calendar } from "lucide-react";
import { BodyText } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface CampaignCardProps {
  campaign: Fund;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const locale = useLocale() as 'en' | 'vi';
  const percentageFunded = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);
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
          <span className="text-muted-foreground text-sm">Campaign Image</span>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-xl min-h-[3.5rem]">{campaign.title}</CardTitle>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {campaign.category}
          </span>
        </div>
        <CardDescription className="line-clamp-2">
          {campaign.shortDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-lg">
              {formatCurrency(campaign.currentAmount, locale)}
            </span>
            <span className="text-muted-foreground">
              of {formatCurrency(campaign.goalAmount, locale)}
            </span>
          </div>
          <Progress value={percentageFunded} className="h-2" />
          <BodyText size="sm" muted className="mt-2">
            {percentageFunded}% funded
          </BodyText>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{campaign.backers} backers</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          by <span className="font-medium text-foreground">{campaign.creator}</span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={`/campaigns/${campaign.slug}`}>View Campaign</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
