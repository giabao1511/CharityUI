"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCampaignAmount } from "@/types/campaign";
import type { Milestone } from "@/types/campaign";
import { MilestoneStatus } from "@/types/campaign";
import { Target, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface MilestoneManagerProps {
  readonly milestones: Milestone[];
  readonly campaignId: number;
}

export function MilestoneManager({
  milestones,
  campaignId,
}: MilestoneManagerProps) {
  const t = useTranslations("creator.milestones");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedMilestones, setEditedMilestones] =
    useState<Milestone[]>(milestones);

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return CheckCircle2;
      case MilestoneStatus.IN_PROGRESS:
        return PlayCircle;
      case MilestoneStatus.PENDING:
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return "text-green-600 dark:text-green-400";
      case MilestoneStatus.IN_PROGRESS:
        return "text-blue-600 dark:text-blue-400";
      case MilestoneStatus.PENDING:
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadgeVariant = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return "default";
      case MilestoneStatus.IN_PROGRESS:
        return "secondary";
      case MilestoneStatus.PENDING:
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusName = (status: MilestoneStatus): string => {
    switch (status) {
      case MilestoneStatus.COMPLETED:
        return t("completed");
      case MilestoneStatus.IN_PROGRESS:
        return t("inProgress");
      case MilestoneStatus.PENDING:
        return t("pending");
      default:
        return t("pending");
    }
  };

  const handleEdit = (milestoneId: number) => {
    setEditingId(milestoneId);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedMilestones(milestones);
  };

  const handleSave = (milestoneId: number) => {
    // Simulate API call
    toast.success(t("updated"));
    setEditingId(null);
  };

  const handleAchievedAmountChange = (
    milestoneId: number,
    newAmount: string
  ) => {
    const amount = parseFloat(newAmount) || 0;
    setEditedMilestones((prev) =>
      prev.map((m) =>
        m.milestoneId === milestoneId ? { ...m, achievedAmount: amount } : m
      )
    );
  };

  const handleStatusChange = (milestoneId: number, newStatus: string) => {
    const statusId = parseInt(newStatus) as MilestoneStatus;
    setEditedMilestones((prev) =>
      prev.map((m) =>
        m.milestoneId === milestoneId ? { ...m, milestoneStatusId: statusId } : m
      )
    );
  };

  const calculateProgress = (achieved: number, target: number): number => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((achieved / target) * 100));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent>
        {editedMilestones.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No milestones defined for this campaign
          </p>
        ) : (
          <div className="space-y-4">
            {editedMilestones.map((milestone) => {
              const Icon = getStatusIcon(milestone.milestoneStatusId);
              const statusColor = getStatusColor(milestone.milestoneStatusId);
              const progress = calculateProgress(
                milestone.achievedAmount,
                milestone.targetAmount
              );
              const isEditing = editingId === milestone.milestoneId;

              return (
                <div
                  key={milestone.milestoneId}
                  className="border rounded-lg p-4 space-y-4"
                >
                  {/* Milestone Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-0.5 ${statusColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(
                        milestone.milestoneStatusId
                      )}
                    >
                      {getStatusName(milestone.milestoneStatusId)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  {!isEditing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCampaignAmount(milestone.achievedAmount)}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCampaignAmount(milestone.targetAmount)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {progress}% achieved
                      </div>
                    </div>
                  )}

                  {/* Edit Form */}
                  {isEditing && (
                    <div className="grid gap-4 pt-4 border-t">
                      <div className="grid gap-2">
                        <Label htmlFor={`amount-${milestone.milestoneId}`}>
                          {t("achievedAmount")}
                        </Label>
                        <Input
                          id={`amount-${milestone.milestoneId}`}
                          type="number"
                          min="0"
                          max={milestone.targetAmount}
                          value={milestone.achievedAmount}
                          onChange={(e) =>
                            handleAchievedAmountChange(
                              milestone.milestoneId,
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                        />
                        <p className="text-xs text-muted-foreground">
                          {t("targetAmount")}:{" "}
                          {formatCampaignAmount(milestone.targetAmount)}
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`status-${milestone.milestoneId}`}>
                          {t("status")}
                        </Label>
                        <Select
                          value={milestone.milestoneStatusId.toString()}
                          onValueChange={(value) =>
                            handleStatusChange(milestone.milestoneId, value)
                          }
                        >
                          <SelectTrigger
                            id={`status-${milestone.milestoneId}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={MilestoneStatus.PENDING.toString()}>
                              {t("pending")}
                            </SelectItem>
                            <SelectItem
                              value={MilestoneStatus.IN_PROGRESS.toString()}
                            >
                              {t("inProgress")}
                            </SelectItem>
                            <SelectItem
                              value={MilestoneStatus.COMPLETED.toString()}
                            >
                              {t("completed")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(milestone.milestoneId)}
                          size="sm"
                        >
                          {t("saveChanges")}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                        >
                          {t("cancel")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Edit Button */}
                  {!isEditing && (
                    <Button
                      onClick={() => handleEdit(milestone.milestoneId)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {t("updateMilestone")}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
