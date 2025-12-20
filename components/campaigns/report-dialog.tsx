"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getReportReasons, createReport } from "@/lib/services/report.service";
import { isAuthenticated } from "@/lib/services/auth.service";
import { ReportReason } from "@/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface ReportDialogProps {
  campaignId: number;
  campaignTitle: string;
}

export function ReportDialog({ campaignId, campaignTitle }: ReportDialogProps) {
  const router = useRouter();
  const t = useTranslations("campaigns.report");
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userIsAuthenticated = isAuthenticated();

  // Fetch reasons when dialog opens
  useEffect(() => {
    if (open && userIsAuthenticated) {
      fetchReasons();
    }
  }, [open, userIsAuthenticated]);

  const fetchReasons = async () => {
    try {
      setIsLoading(true);
      const data = await getReportReasons();
      setReasons(data);
    } catch (error) {
      console.error("Error fetching report reasons:", error);
      toast.error(t("failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userIsAuthenticated) {
      toast.error(t("signInRequired"));
      router.push("/auth?tab=signin");
      setOpen(false);
      return;
    }

    if (!selectedReasonId) {
      toast.error(t("selectReasonError"));
      return;
    }

    if (!description.trim()) {
      toast.error(t("enterDetailsError"));
      return;
    }

    try {
      setIsSubmitting(true);

      await createReport({
        targetId: campaignId,
        reasonId: selectedReasonId,
        description: description.trim(),
      });

      toast.success(t("success"));

      // Reset form and close dialog
      setSelectedReasonId(null);
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(t("failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!userIsAuthenticated && isOpen) {
      toast.error(t("signInRequired"));
      router.push("/auth?tab=signin");
      return;
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="h-4 w-4 mr-2" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>
              {t("description")} {t("campaign")} <strong>{campaignTitle}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Reason Selection */}
                <div className="space-y-2">
                  <Label htmlFor="reason">{t("reasonLabel")}</Label>
                  <Select
                    value={selectedReasonId?.toString()}
                    onValueChange={(value) => setSelectedReasonId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectReason")} />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map((reason) => (
                        <SelectItem
                          key={reason.reasonId}
                          value={reason.reasonId.toString()}
                        >
                          {reason.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{t("detailsLabel")}</Label>
                  <Textarea
                    id="description"
                    placeholder={t("detailsPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("detailsHelp")}
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
