"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RewardTier } from "@/types";
import { BodyText } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/currency";
import { useLocale, useTranslations } from "next-intl";
import { createPayment } from "@/lib/services/payment.service";
import { GuestDonationDialog } from "./guest-donation-dialog";
import { LoggedInDonationDialog } from "./logged-in-donation-dialog";
import { useAuth } from "@/lib/auth-context";

interface ContributionSidebarProps {
  campaignId: string | number;
  goalAmount: number;
  currentAmount: number;
  daysLeft: number;
  percentageFunded: number;
  selectedTierId?: string | null;
}

export function ContributionSidebar({
  campaignId,
  goalAmount,
  currentAmount,
  daysLeft,
  percentageFunded,
  selectedTierId: externalSelectedTierId = null,
}: ContributionSidebarProps) {
  const { user } = useAuth();
  const t = useTranslations("campaigns.detail");
  const [contributionAmount, setContributionAmount] = useState("");
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    externalSelectedTierId
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showLoggedInDialog, setShowLoggedInDialog] = useState(false);

  const handleContribute = async (amount: string) => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid contribution amount.",
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
    amount?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
    isAnonymous?: boolean;
  }) => {
    setIsProcessing(true);

    try {
      const amountInVND = Math.round(
        Number.parseFloat(amount || contributionAmount)
      );

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
        amount={Number.parseFloat(contributionAmount) || 0}
        campaignId={campaignId}
        onSubmit={handleGuestDonation}
      />

      {user && (
        <LoggedInDonationDialog
          open={showLoggedInDialog}
          onOpenChange={setShowLoggedInDialog}
          amount={Number.parseFloat(contributionAmount) || 0}
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
              <span className="text-muted-foreground">
                {daysLeft > 0 ? t("campaignActive") : t("campaignEnded")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="contribution-amount">
              {t("contributionAmount")}
            </Label>
            <Input
              id="contribution-amount"
              type="number"
              placeholder={t("enterAmount")}
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              min="1"
              aria-required="true"
              aria-describedby="contribution-hint"
            />
            <p id="contribution-hint" className="text-xs text-muted-foreground">
              {t("minimumContribution")}
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => handleContribute(contributionAmount)}
              disabled={isProcessing || daysLeft <= 0}
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
              onClick={() => setContributionAmount("10000")}
            >
              {formatCurrency(10000)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContributionAmount("100000")}
            >
              {formatCurrency(100000)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContributionAmount("1000000")}
            >
              {formatCurrency(1000000)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
