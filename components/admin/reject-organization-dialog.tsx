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
import { rejectOrganization } from "@/lib/services/admin.service";
import type { AdminOrganization } from "@/lib/services/admin.service";

interface RejectOrganizationDialogProps {
  organization: AdminOrganization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RejectOrganizationDialog({
  organization,
  open,
  onOpenChange,
  onSuccess,
}: RejectOrganizationDialogProps) {
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
    if (!organization) return;

    try {
      setIsSubmitting(true);
      await rejectOrganization(organization.orgId, values.reasonRejected);

      toast.success("Organization rejected successfully");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error rejecting organization:", error);
      toast.error(error.message || "Failed to reject organization");
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
            Reject Organization
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this organization. The organization will be notified.
          </DialogDescription>
        </DialogHeader>

        {organization && (
          <div className="space-y-4 py-4">
            {/* Organization Info */}
            <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Organization ID:</span>
                <span className="font-medium">#{organization.orgId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium truncate max-w-[250px]">
                  {organization.orgName}
                </span>
              </div>
              {organization.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium truncate max-w-[250px]">
                    {organization.email}
                  </span>
                </div>
              )}
              {organization.phoneNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{organization.phoneNumber}</span>
                </div>
              )}
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
                          placeholder="Explain why this organization is being rejected..."
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
