"use client";

import { useState } from "react";
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
import type { VolunteerRegistration } from "@/types/creator";
import { Users, Mail, Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateVolunteerStatus } from "@/lib/services/creator.service";

interface VolunteerListProps {
  readonly volunteers: VolunteerRegistration[];
  readonly campaignId: number;
}

export function VolunteerList({
  volunteers,
  campaignId,
}: VolunteerListProps) {
  const t = useTranslations("creator.volunteers");
  const [volunteerList, setVolunteerList] =
    useState<VolunteerRegistration[]>(volunteers);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const getStatusBadgeVariant = (
    status: VolunteerRegistration["status"]
  ) => {
    switch (status) {
      case "active":
        return "default";
      case "approved":
        return "secondary";
      case "pending":
        return "outline";
      case "rejected":
        return "destructive";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleStatusUpdate = async (
    volunteerId: number,
    newStatus: VolunteerRegistration["status"],
    successMessage: string
  ) => {
    setLoadingStates((prev) => ({ ...prev, [volunteerId]: true }));

    try {
      // Call the API to update volunteer status
      await updateVolunteerStatus(volunteerId, newStatus);

      // Update local state on success
      setVolunteerList((prev) =>
        prev.map((v) =>
          v.volunteerId === volunteerId ? { ...v, status: newStatus } : v
        )
      );
      toast.success(successMessage);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [volunteerId]: false }));
    }
  };

  const handleApprove = (volunteerId: number) => {
    handleStatusUpdate(volunteerId, "approved", t("approved"));
  };

  const handleReject = (volunteerId: number) => {
    handleStatusUpdate(volunteerId, "rejected", t("rejected"));
  };

  const handleActivate = (volunteerId: number) => {
    handleStatusUpdate(volunteerId, "active", t("statusUpdated"));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
                        {t(`status.${volunteer.status}`)}
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
                        {volunteer.status === "pending" && (
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
                        {volunteer.status === "approved" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleActivate(volunteer.volunteerId)}
                            disabled={loadingStates[volunteer.volunteerId]}
                          >
                            {loadingStates[volunteer.volunteerId] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {t("actions.activate")}
                          </Button>
                        )}
                        {(volunteer.status === "active" ||
                          volunteer.status === "rejected" ||
                          volunteer.status === "inactive") && (
                          <Badge variant="outline" className="capitalize">
                            {t(`status.${volunteer.status}`)}
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
