"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface GuestDonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  campaignId: string | number;
  onSubmit: (data: {
    email?: string;
    phoneNumber?: string;
    message?: string;
    isAnonymous: boolean;
  }) => Promise<void>;
}

export function GuestDonationDialog({
  open,
  onOpenChange,
  amount,
  campaignId,
  onSubmit,
}: GuestDonationDialogProps) {
  const locale = useLocale() as "en" | "vi";
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await onSubmit({
        email: email.trim() || undefined,
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
            Please provide your information (optional).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email (Optional)</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isProcessing || isAnonymous}
            />
            <p className="text-xs text-muted-foreground">
              We'll send you a receipt and campaign updates
            </p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="guest-phone">Phone Number (Optional)</Label>
            <Input
              id="guest-phone"
              type="tel"
              placeholder="+84 123 456 789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isProcessing || isAnonymous}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="guest-message">Message (Optional)</Label>
            <Textarea
              id="guest-message"
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
              id="guest-anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => {
                setIsAnonymous(checked as boolean);
                if (checked) {
                  setEmail("");
                  setPhoneNumber("");
                }
              }}
              disabled={isProcessing}
            />
            <Label
              htmlFor="guest-anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Donate anonymously
            </Label>
          </div>

          {isAnonymous && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Your donation will be shown as "Anonymous" and contact information will not be collected.
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
