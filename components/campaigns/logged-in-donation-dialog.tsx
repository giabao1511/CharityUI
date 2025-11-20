"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/currency";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

interface LoggedInDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  campaignId: string | number;
  userEmail: string;
  onSubmit: (data: {
    email: string;
    phoneNumber?: string;
    message?: string;
    isAnonymous: boolean;
  }) => Promise<void>;
}

export function LoggedInDonationDialog({
  open,
  onOpenChange,
  amount,
  campaignId,
  userEmail,
  onSubmit,
}: LoggedInDonationDialogProps) {
  const locale = useLocale() as "en" | "vi";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await onSubmit({
        email: userEmail,
        phoneNumber: phoneNumber.trim() || undefined,
        message: message.trim() || undefined,
        isAnonymous,
      });
    } catch (error) {
      // Error handling is done in parent component
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Donation</DialogTitle>
          <DialogDescription>
            You're about to donate {formatCurrency(amount)} to this campaign.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email (Read-only, from user account) */}
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={userEmail}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              From your account. We'll send you a receipt and campaign updates.
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="user-phone">Phone Number (Optional)</Label>
            <Input
              id="user-phone"
              type="tel"
              placeholder="+84 123 456 789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isProcessing || isAnonymous}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="user-message">Message (Optional)</Label>
            <Textarea
              id="user-message"
              placeholder="Leave a message of support..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isProcessing}
              rows={3}
            />
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="user-anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => {
                setIsAnonymous(checked as boolean);
                if (checked) {
                  setPhoneNumber("");
                }
              }}
              disabled={isProcessing}
            />
            <Label
              htmlFor="user-anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Donate anonymously
            </Label>
          </div>

          {isAnonymous && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Your donation will be shown as "Anonymous" and your phone number will not be collected.
                We'll still send updates to your email for record keeping.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Donate ${formatCurrency(amount)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
