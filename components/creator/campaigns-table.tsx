"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CampaignStatus, formatCampaignAmount } from "@/types/campaign";
import { CampaignItem } from "@/types/fund";
import { Edit, Eye, Target, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface CampaignsTableProps {
  readonly campaigns: CampaignItem[];
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const t = useTranslations("creator.campaigns");

  const getStatusBadgeVariant = (status: number) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return "default";
      case CampaignStatus.PAUSED:
        return "secondary";
      case CampaignStatus.COMPLETED:
        return "outline";
      case CampaignStatus.CLOSED:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const calculateProgress = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold">{t("noCampaigns")}</p>
        <p className="text-sm text-muted-foreground mt-2">{t("getStarted")}</p>
        <Link href="/creator/campaigns/new">
          <Button className="mt-4">{t("createNew")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.campaign")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.raised")}</TableHead>
            <TableHead>{t("table.endDate")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => {
            const progress = calculateProgress(
              campaign.currentAmount,
              campaign.targetAmount
            );

            return (
              <TableRow key={campaign.campaignId}>
                <TableCell className="font-medium max-w-xs">
                  <div className="space-y-1">
                    <div className="font-semibold">{campaign.title}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {campaign.campaignId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(
                      campaign.status.campaignStatusId
                    )}
                  >
                    {campaign.status.statusName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-2 min-w-[180px]">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCampaignAmount(campaign.currentAmount)}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCampaignAmount(campaign.targetAmount)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {progress}% funded
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(campaign.endDate)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/creator/campaigns/${campaign.campaignId}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        {t("table.manage")}
                      </Button>
                    </Link>
                    <Link href={`/creator/campaigns/${campaign.campaignId}/edit`}>
                      <Button size="sm" variant="default">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
