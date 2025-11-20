"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RewardTier } from "@/types";
import { BodyText } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";
import { createPayment } from "@/lib/services/payment.service";
import { GuestDonationDialog } from "./guest-donation-dialog";
import { LoggedInDonationDialog } from "./logged-in-donation-dialog";
import { useAuth } from "@/lib/auth-context";

interface ContributionSidebarProps {
  campaignId: string | number;
  goalAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  percentageFunded: number;
  rewardTiers?: RewardTier[];
  selectedTierId?: string | null;
}

export function ContributionSidebar({
  campaignId,
  goalAmount,
  currentAmount,
  backers,
  daysLeft,
  percentageFunded,
  rewardTiers = [],
  selectedTierId: externalSelectedTierId = null,
}: ContributionSidebarProps) {
  const locale = useLocale() as 'en' | 'vi';
  const { user } = useAuth();
  const [contributionAmount, setContributionAmount] = useState("");
  const [selectedTierId, setSelectedTierId] = useState<string | null>(externalSelectedTierId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showLoggedInDialog, setShowLoggedInDialog] = useState(false);

  // Derive the selected tier and amount from props
  // When externalSelectedTierId changes, update local state
  const currentSelectedTierId = externalSelectedTierId || selectedTierId;
  const selectedTier = useMemo(
    () => rewardTiers.find(t => t.id === currentSelectedTierId),
    [rewardTiers, currentSelectedTierId]
  );

  // If external selection changed and amount is empty, set it from tier
  if (externalSelectedTierId && externalSelectedTierId !== selectedTierId && !contributionAmount) {
    setSelectedTierId(externalSelectedTierId);
    const tier = rewardTiers.find(t => t.id === externalSelectedTierId);
    if (tier) {
      setContributionAmount(tier.amount.toString());
    }
  }

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    const tier = rewardTiers.find(t => t.id === tierId);
    if (tier) {
      setContributionAmount(tier.amount.toString());
    }
  };

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
      const amountInVND = Math.round(Number.parseFloat(amount || contributionAmount));

      // Create payment and get VNPay URL
      const paymentUrl = await createPayment({
        amount: amountInVND,
        campaignId: Number(campaignId),
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
        description: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
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
          <CardTitle className="text-2xl">{formatCurrency(currentAmount)}</CardTitle>
          <CardDescription>pledged of {formatCurrency(goalAmount)} goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        <div>
          <Progress value={percentageFunded} className="h-3" />
          <p className="mt-2 text-sm text-muted-foreground">{percentageFunded}% funded</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium">{backers.toLocaleString()}</span>
            <span className="text-muted-foreground">backers</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium">{daysLeft}</span>
            <span className="text-muted-foreground">days to go</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">
              {daysLeft > 0 ? "Campaign Active" : "Campaign Ended"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="contribution-amount">Contribution Amount</Label>
          <Input
            id="contribution-amount"
            type="number"
            placeholder="Enter amount"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            min="1"
            aria-required="true"
            aria-describedby="contribution-hint"
          />
          <p id="contribution-hint" className="text-xs text-muted-foreground">
            Enter the amount you would like to contribute (minimum $1)
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
              "Back This Campaign"
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setContributionAmount("25")}
          >
            $25
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setContributionAmount("50")}
          >
            $50
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setContributionAmount("100")}
          >
            $100
          </Button>
        </div>

        {/* Selected reward tier display */}
        {selectedTierId && rewardTiers.length > 0 && (
          <div className="p-4 border rounded-lg bg-primary/5">
            <BodyText weight="semibold" size="sm" className="mb-2">
              Selected Reward:
            </BodyText>
            <BodyText size="sm">
              {rewardTiers.find(t => t.id === selectedTierId)?.title}
            </BodyText>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
