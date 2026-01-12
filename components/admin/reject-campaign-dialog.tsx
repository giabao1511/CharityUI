"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { rejectCampaign } from "@/lib/services/admin.service";
import type { CampaignItem } from "@/types/fund";
import { formatCurrency } from "@/lib/currency";

interface RejectCampaignDialogProps {
  campaign: CampaignItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RejectCampaignDialog({
  campaign,
  open,
  onOpenChange,
  onSuccess,
}: RejectCampaignDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    reasonRejected: z
      .string()
      .min(1, "Rejection reason is required")
      .min(10, "Reason must be at least 10 characters"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reasonRejected: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!campaign) return;

    try {
      setIsSubmitting(true);
      await rejectCampaign(campaign.campaignId, values.reasonRejected);

      toast.success("Campaign rejected successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error rejecting campaign:", error);
      toast.error(error.message || "Failed to reject campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Reject Campaign
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this campaign. The organization will be notified.
          </DialogDescription>
        </DialogHeader>

        {campaign && (
          <div className="space-y-4 py-4">
            {/* Campaign Info */}
            <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Campaign ID:</span>
                <span className="font-medium">#{campaign.campaignId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium truncate max-w-[250px]">
                  {campaign.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-medium">{campaign.organization.orgName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(campaign.targetAmount)}
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="reasonRejected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rejection Reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why this campaign is being rejected..."
                          className="resize-none"
                          rows={5}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear and detailed explanation. This will be sent to the organization.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <XCircle className="mr-2 h-4 w-4" />
                    Confirm Reject
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
