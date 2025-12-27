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
import { useTranslations } from "next-intl";
import { rejectWithdrawal } from "@/lib/services/withdrawal.service";
import type { Withdrawal } from "@/types/withdrawal";

interface RejectWithdrawalDialogProps {
  withdrawal: Withdrawal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RejectWithdrawalDialog({
  withdrawal,
  open,
  onOpenChange,
  onSuccess,
}: RejectWithdrawalDialogProps) {
  const t = useTranslations("admin.withdrawals");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    reasonRejected: z
      .string()
      .min(1, t("reasonRequired"))
      .min(3, t("reasonTooShort")),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reasonRejected: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!withdrawal) return;

    try {
      setIsSubmitting(true);
      await rejectWithdrawal(withdrawal.withdrawalId, values.reasonRejected);

      toast.success(t("rejectSuccess"));
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error rejecting withdrawal:", error);
      toast.error(error.message || t("rejectError"));
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
            {t("rejectWithdrawal")}
          </DialogTitle>
          <DialogDescription>{t("rejectWithdrawalDescription")}</DialogDescription>
        </DialogHeader>

        {withdrawal && (
          <div className="space-y-4 py-4">
            {/* Withdrawal Info */}
            <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("withdrawalId")}:
                </span>
                <span className="font-medium">#{withdrawal.withdrawalId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("amount")}:</span>
                <span className="font-bold text-lg">
                  {parseFloat(withdrawal.amount).toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("requester")}:</span>
                <span className="font-medium">
                  {withdrawal.requester.firstName} {withdrawal.requester.lastName}
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
                      <FormLabel>{t("rejectionReason")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("rejectionReasonPlaceholder")}
                          className="resize-none"
                          rows={4}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("provideDetailedReason")}
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
                    {t("cancel")}
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
                    {t("confirmReject")}
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
