"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateVolunteerStatus } from "@/lib/services/creator.service";
import { Volunteer } from "@/types/fund";

interface VolunteerListProps {
  readonly volunteers: Volunteer[];
  readonly campaignId: number;
  readonly onUpdate?: () => void;
}

export function VolunteerList({
  volunteers,
  campaignId,
  onUpdate,
}: VolunteerListProps) {
  const t = useTranslations("creator.volunteers");
  const [volunteerList, setVolunteerList] =
    useState<Volunteer[]>(volunteers);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Sync with incoming volunteers prop
  useEffect(() => {
    setVolunteerList(volunteers);
  }, [volunteers]);

  const getStatusBadgeVariant = (
    status: Volunteer["status"]
  ) => {
    switch (status.volunteerStatusId) {
      case 2: // active
        return "default";
      case 1: // pending
        return "outline";
      case 3: // rejected
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleStatusUpdate = async (
    volunteerId: number,
    statusId: 1 | 2 | 3,
    statusName: string,
    successMessage: string
  ) => {
    setLoadingStates((prev) => ({ ...prev, [volunteerId]: true }));

    try {
      // Map status ID to status string for the API
      const statusString = statusId === 1 ? "pending" : statusId === 2 ? "active" : "rejected";

      // Call the API to update volunteer status
      await updateVolunteerStatus(volunteerId, statusString);

      // Update local state on success
      const newStatus: Volunteer["status"] = {
        volunteerStatusId: statusId,
        statusName: statusName
      };

      setVolunteerList((prev) =>
        prev.map((v) =>
          v.registrationId === volunteerId
            ? { ...v, status: newStatus }
            : v
        )
      );
      toast.success(successMessage);

      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [volunteerId]: false }));
    }
  };

  const handleApprove = (volunteerId: number) => {
    handleStatusUpdate(volunteerId, 2, "Active", t("approved"));
  };

  const handleReject = (volunteerId: number) => {
    handleStatusUpdate(volunteerId, 3, "Rejected", t("rejected"));
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent>
        {volunteerList.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">{t("noVolunteers")}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.name")}</TableHead>
                  <TableHead>{t("table.email")}</TableHead>
                  <TableHead>{t("table.registeredAt")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.skills")}</TableHead>
                  <TableHead>{t("table.availability")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteerList.map((volunteer) => (
                  <TableRow key={volunteer.volunteerId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        {volunteer.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {volunteer.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(volunteer.registeredAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(volunteer.status)}
                        className="capitalize"
                      >
                        {volunteer.status.statusName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {volunteer.skills && volunteer.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.map((skill) => (
                            <Badge
                              key={`${volunteer.volunteerId}-${skill}`}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {volunteer.availability || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {volunteer.status.volunteerStatusId === 1 && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(volunteer.volunteerId)}
                              disabled={loadingStates[volunteer.volunteerId]}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              {loadingStates[volunteer.volunteerId] ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              {t("actions.approve")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(volunteer.volunteerId)}
                              disabled={loadingStates[volunteer.volunteerId]}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {loadingStates[volunteer.volunteerId] ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              {t("actions.reject")}
                            </Button>
                          </>
                        )}
                        {(volunteer.status.volunteerStatusId === 2 ||
                          volunteer.status.volunteerStatusId === 3) && (
                          <Badge variant="outline" className="capitalize">
                            {volunteer.status.statusName}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
