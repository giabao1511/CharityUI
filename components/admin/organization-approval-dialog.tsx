"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  Loader2,
  Mail,
  Phone,
  MapPin,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { approveOrganization } from "@/lib/services/admin.service";
import type { AdminOrganization } from "@/lib/services/admin.service";
import Image from "next/image";

interface OrganizationApprovalDialogProps {
  organization: AdminOrganization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function OrganizationApprovalDialog({
  organization,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: OrganizationApprovalDialogProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (!organization) return;

    try {
      setIsApproving(true);
      await approveOrganization(organization.orgId);

      toast.success("Organization approved successfully");
      onOpenChange(false);
      onApprove?.();
    } catch (error: any) {
      console.error("Error approving organization:", error);
      toast.error(error.message || "Failed to approve organization");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = () => {
    onOpenChange(false);
    onReject?.();
  };

  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Review Organization
          </DialogTitle>
          <DialogDescription>
            Review the organization details before approving or rejecting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Organization Avatar */}
          {organization.avatar && (
            <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
              <Image
                src={organization.avatar}
                alt={organization.orgName}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Organization Name */}
          <div>
            <h3 className="text-2xl font-bold mb-2">{organization.orgName}</h3>
          </div>

          {/* Organization Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organization.email && (
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Mail className="h-4 w-4" />
                  <p className="text-sm">Email</p>
                </div>
                <p className="font-medium">{organization.email}</p>
              </div>
            )}

            {organization.phoneNumber && (
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Phone className="h-4 w-4" />
                  <p className="text-sm">Phone Number</p>
                </div>
                <p className="font-medium">{organization.phoneNumber}</p>
              </div>
            )}

            {organization.website && (
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Globe className="h-4 w-4" />
                  <p className="text-sm">Website</p>
                </div>
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {organization.website}
                </a>
              </div>
            )}

            {organization.address && (
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm">Address</p>
                </div>
                <p className="font-medium">{organization.address}</p>
              </div>
            )}
          </div>

          <div className="border-t" />

          {/* Organization Details */}
          <div className="space-y-4">
            {organization.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {organization.description}
                </p>
              </div>
            )}

            {/* Organization Info Card */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Details
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-medium">#{organization.orgId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At:</span>
                  <span className="font-medium">
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {organization.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated At:</span>
                    <span className="font-medium">
                      {new Date(organization.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                <Clock className="h-3 w-3 mr-1" />
                Pending Review
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApproving}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isApproving}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            variant="default"
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isApproving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Organization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
