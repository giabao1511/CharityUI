"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Target,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { approveCampaign } from "@/lib/services/admin.service";
import type { CampaignItem } from "@/types/fund";
import { formatCurrency } from "@/lib/currency";
import Image from "next/image";

interface CampaignApprovalDialogProps {
  campaign: CampaignItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function CampaignApprovalDialog({
  campaign,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: CampaignApprovalDialogProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (!campaign) return;

    try {
      setIsApproving(true);
      await approveCampaign(campaign.campaignId);

      toast.success("Campaign approved successfully");
      onOpenChange(false);
      onApprove?.();
    } catch (error: any) {
      console.error("Error approving campaign:", error);
      toast.error(error.message || "Failed to approve campaign");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = () => {
    onOpenChange(false);
    onReject?.();
  };

  if (!campaign) return null;

  const progress =
    campaign.targetAmount > 0
      ? Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
      : 0;

  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const daysRemaining = Math.ceil(
    (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Review Campaign
          </DialogTitle>
          <DialogDescription>
            Review the campaign details before approving or rejecting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Campaign Banner */}
          {campaign.media?.[0]?.url && (
            <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
              <Image
                src={campaign.media[0].url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Campaign Title */}
          <div>
            <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{campaign.organization.orgName}</span>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Target Amount</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(campaign.targetAmount)}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Current Amount</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(campaign.currentAmount)}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="text-lg font-bold">
                {campaign.category?.categoryName || "General"}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="text-lg font-bold">{daysRemaining} days</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Funding Progress</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="border-t" />

          {/* Campaign Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Campaign Period
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{endDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>

            {/* Organization Info */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Information
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {campaign.organization.orgName}
                  </span>
                </div>
                {campaign.organization.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">
                      {campaign.organization.email}
                    </span>
                  </div>
                )}
                {campaign.organization.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {campaign.organization.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                <Clock className="h-3 w-3 mr-1" />
                Pending Review
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isApproving}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            variant="default"
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isApproving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
