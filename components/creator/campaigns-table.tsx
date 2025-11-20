"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCampaignAmount } from "@/types/campaign";
import type { CreatorCampaignItem } from "@/types/creator";
import { CampaignStatus, CampaignStatusNames } from "@/types/campaign";
import Link from "next/link";
import { Eye, Edit, Users, Target } from "lucide-react";
import { useTranslations } from "next-intl";

interface CampaignsTableProps {
  readonly campaigns: CreatorCampaignItem[];
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const t = useTranslations("creator.campaigns");

  const getStatusBadgeVariant = (status: number) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return "default";
      case CampaignStatus.DRAFT:
        return "secondary";
      case CampaignStatus.COMPLETED:
        return "outline";
      case CampaignStatus.SUSPENDED:
        return "destructive";
      case CampaignStatus.CANCELLED:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const calculateProgress = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  const formatDate = (dateString: string): string => {
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
            <TableHead className="text-center">{t("table.backers")}</TableHead>
            <TableHead className="text-center">
              {t("table.volunteers")}
            </TableHead>
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
              <TableRow key={campaign.fundId}>
                <TableCell className="font-medium max-w-xs">
                  <div className="space-y-1">
                    <div className="font-semibold">{campaign.fundName}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {campaign.fundId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(campaign.status)}>
                    {campaign.statusName}
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
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">
                      {campaign.backersCount.toLocaleString()}
                    </span>
                    <Users className="h-3 w-3 text-muted-foreground mt-1" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">
                      {campaign.volunteersCount}
                    </span>
                    <Users className="h-3 w-3 text-muted-foreground mt-1" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{formatDate(campaign.endDate)}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/creator/campaigns/${campaign.fundId}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        {t("table.manage")}
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
