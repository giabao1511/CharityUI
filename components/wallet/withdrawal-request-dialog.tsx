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
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createWithdrawal } from "@/lib/services/withdrawal.service";
import { formatCurrency } from "@/lib/currency";
import type { Wallet } from "@/types/wallet";

interface WithdrawalRequestDialogProps {
  wallet: Wallet;
  onSuccess?: () => void;
}

export function WithdrawalRequestDialog({
  wallet,
  onSuccess,
}: WithdrawalRequestDialogProps) {
  const t = useTranslations("wallet");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    amount: z
      .string()
      .min(1, t("amountRequired"))
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num > 0;
        },
        { message: t("amountMustBePositive") }
      )
      .refine(
        (val) => {
          const num = parseFloat(val);
          const balance = parseFloat(wallet.balance);
          return !isNaN(num) && num <= balance;
        },
        { message: t("amountExceedsBalance") }
      ),
    purpose: z.string().min(1, t("purposeRequired")),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      purpose: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Validate that wallet has a campaign
      if (!wallet.campaign) {
        toast.error(t("walletNoCampaign"));
        return;
      }

      const data = {
        amount: parseFloat(values.amount),
        campaignId: wallet.campaign.campaignId,
        fromWalletId: wallet.walletId,
        purpose: values.purpose,
      };

      const result = await createWithdrawal(data);

      toast.success(t("withdrawalRequestSuccess"));
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating withdrawal:", error);
      toast.error(error.message || t("withdrawalRequestError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only allow withdrawal for campaign wallets with balance
  const canWithdraw =
    wallet.campaign &&
    parseFloat(wallet.balance) > 0 &&
    wallet.type.walletTypeName.toLowerCase().includes("ví chiến dịch");

  console.log("wallet", wallet);

  if (!canWithdraw) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          {t("requestWithdrawal")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("createWithdrawalRequest")}</DialogTitle>
          <DialogDescription>
            {t("withdrawalRequestDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Wallet Info */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("currentBalance")}:
              </span>
              <span className="font-bold text-lg">
                {formatCurrency(parseFloat(wallet.balance))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("campaign")}:</span>
              <span className="font-medium">{wallet.campaign?.title}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("withdrawalAmount")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("maxAmount")}:{" "}
                      {formatCurrency(parseFloat(wallet.balance))}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("withdrawalPurpose")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("withdrawalPurposePlaceholder")}
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("describePurposeOfWithdrawal")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("submitRequest")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
