"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/currency";
import { createPayment } from "@/lib/services/payment.service";
import { FundStatus } from "@/types/fund";
import { Calendar, Loader2, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { CurrencyInput } from "../ui/currency-input";
import { GuestDonationDialog } from "./guest-donation-dialog";
import { LoggedInDonationDialog } from "./logged-in-donation-dialog";

interface ContributionSidebarProps {
  readonly campaignId: string | number;
  readonly goalAmount: number;
  readonly currentAmount: number;
  readonly daysLeft: number;
  readonly percentageFunded: number;
  readonly campaignStatus: number;
}

export function ContributionSidebar({
  campaignId,
  goalAmount,
  currentAmount,
  daysLeft,
  percentageFunded,
  campaignStatus,
}: ContributionSidebarProps) {
  const { user } = useAuth();
  const t = useTranslations("campaigns.detail");

  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showLoggedInDialog, setShowLoggedInDialog] = useState(false);

  const isCampaignActive = campaignStatus === FundStatus.ACTIVE;
  const canDonate = isCampaignActive && daysLeft > 0;

  const getCampaignStatusText = () => {
    if (!isCampaignActive) return "Campaign Not Active";
    if (daysLeft > 0) return t("campaignActive");
    return t("campaignEnded");
  };

  const handleContribute = async (amount: number) => {
    if (!amount || amount <= 0) {
      toast.error(t("invalidAmount"), {
        description: t("invalidAmountDesc"),
      });
      return;
    }

    // Check if campaign is active
    if (!isCampaignActive) {
      toast.error("Campaign Not Active", {
        description: "This campaign is not currently accepting donations.",
      });
      return;
    }

    // Check if campaign has ended
    if (daysLeft <= 0) {
      toast.error("Campaign Ended", {
        description: "This campaign has already ended.",
      });
      return;
    }

    // If user is not logged in, show guest dialog
    if (!user) {
      setShowGuestDialog(true);
      return;
    }

    // User is logged in, show logged-in dialog with pre-filled email
    setShowLoggedInDialog(true);
  };

  const processPayment = async ({
    amount,
    email,
    phoneNumber,
    message,
    isAnonymous,
  }: {
    amount?: number;
    email?: string;
    phoneNumber?: string;
    message?: string;
    isAnonymous?: boolean;
  }) => {
    setIsProcessing(true);

    try {
      const amountInVND = Math.round(amount || contributionAmount);

      // Create payment and get VNPay URL
      const paymentUrl = await createPayment({
        amount: amountInVND,
        campaignId: Number(campaignId),
        userId: user?.userId,
        email,
        phoneNumber,
        message,
        isAnonymous,
      });

      // Redirect to VNPay payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const handleGuestDonation = async (guestData: {
    email?: string;
    phoneNumber?: string;
    message?: string;
    isAnonymous: boolean;
  }) => {
    setShowGuestDialog(false);
    await processPayment({
      amount: contributionAmount,
      ...guestData,
    });
  };

  const handleLoggedInDonation = async (userData: {
    email: string;
    phoneNumber?: string;
    message?: string;
    isAnonymous: boolean;
  }) => {
    setShowLoggedInDialog(false);
    await processPayment({
      amount: contributionAmount,
      ...userData,
    });
  };

  return (
    <>
      <GuestDonationDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
        amount={contributionAmount || 0}
        campaignId={campaignId}
        onSubmit={handleGuestDonation}
      />

      {user && (
        <LoggedInDonationDialog
          open={showLoggedInDialog}
          onOpenChange={setShowLoggedInDialog}
          amount={contributionAmount || 0}
          campaignId={campaignId}
          userEmail={user.email}
          onSubmit={handleLoggedInDonation}
        />
      )}

      <Card className="lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle className="text-2xl">
            {formatCurrency(currentAmount)}
          </CardTitle>
          <CardDescription>
            {t("pledged", {
              amount: formatCurrency(goalAmount),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Progress value={percentageFunded} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t("percentFunded", {
                percent: percentageFunded,
              })}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-medium">{daysLeft}</span>
              <span className="text-muted-foreground">{t("daysToGo")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className={`${!canDonate ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                {getCampaignStatusText()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="contribution-amount">
              {t("contributionAmount")}
            </Label>
            <CurrencyInput
              id="contribution-amount"
              value={contributionAmount}
              onChange={setContributionAmount}
              placeholder={t("enterAmount")}
              aria-required="true"
              aria-describedby="contribution-hint"
              disabled={!canDonate}
            />
            <p id="contribution-hint" className="text-xs text-muted-foreground">
              {t("minimumContribution")}
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => handleContribute(contributionAmount)}
              disabled={isProcessing || !canDonate}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>{t("backThisCampaign")}</>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContributionAmount(10000)}
              disabled={!canDonate}
            >
              {formatCurrency(10000)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContributionAmount(100000)}
              disabled={!canDonate}
            >
              {formatCurrency(100000)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContributionAmount(1000000)}
              disabled={!canDonate}
            >
              {formatCurrency(1000000)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
