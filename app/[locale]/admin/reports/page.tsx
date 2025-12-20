"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Flag, Loader2, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getReportsByCampaign, updateReportStatus } from "@/lib/services/report.service";
import { getCampaigns } from "@/lib/services/campaign.service";
import { Report } from "@/types";
import { Campaign } from "@/types/campaign";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

export default function ReportsManagementPage() {
  const t = useTranslations("admin.reports");
  const tCommon = useTranslations("common");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  // Load reports when campaign is selected
  useEffect(() => {
    if (selectedCampaignId) {
      loadReports(selectedCampaignId);
    } else {
      setReports([]);
    }
  }, [selectedCampaignId]);

  const loadCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      const response = await getCampaigns();
      // getCampaigns returns { funds: [...], pagination: {...} }
      setCampaigns(response.funds || []);
    } catch (error) {
      console.error("Error loading campaigns:", error);
      toast.error(t("errorLoadingCampaigns"));
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const loadReports = async (campaignId: number) => {
    try {
      setIsLoadingReports(true);
      const response = await getReportsByCampaign(campaignId);
      // Handle both array response and paginated response
      setReports(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error(t("errorLoadingReports"));
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleStatusUpdate = async (newStatus: "pending" | "reviewed" | "rejected" | "approved") => {
    if (!selectedReport) return;

    try {
      setIsUpdating(true);
      await updateReportStatus(selectedReport.reportId, newStatus);

      // Update the report in the list
      setReports(reports.map(r =>
        r.reportId === selectedReport.reportId
          ? { ...r, status: newStatus }
          : r
      ));

      toast.success(t("statusUpdated"));
      setIsDialogOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error(t("errorUpdatingStatus"));
    } finally {
      setIsUpdating(false);
    }
  };

  const openReportDialog = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "reviewed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCampaign = campaigns.find(c => c.campaignId === selectedCampaignId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading level={1} gutterBottom>
          {t("title")}
        </Heading>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Campaign Selection */}
      <Card>
        <CardHeader>
          <CardTitle>{t("selectCampaign")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchCampaign")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Campaign List */}
          {isLoadingCampaigns ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-2 max-h-[400px] overflow-y-auto">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCampaignId === campaign.campaignId
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedCampaignId(campaign.campaignId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {campaign.organization?.orgName}
                      </p>
                    </div>
                    <Flag className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}

              {filteredCampaigns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? t("noCampaignsFound") : t("noCampaigns")}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reports List */}
      {selectedCampaignId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t("reportsFor")} {selectedCampaign?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t("noReports")}</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reportId")}</TableHead>
                      <TableHead>{t("reporter")}</TableHead>
                      <TableHead>{t("reason")}</TableHead>
                      <TableHead>{t("description")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("createdAt")}</TableHead>
                      <TableHead className="text-right">{tCommon("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.reportId}>
                        <TableCell className="font-medium">#{report.reportId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {report.reporter.firstName} {report.reporter.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.reporter.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{report.reason.title}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {report.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(report.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReportDialog(report)}
                          >
                            {t("review")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("reportDetails")}</DialogTitle>
            <DialogDescription>
              {t("reviewAndUpdate")}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Reporter Info */}
              <div>
                <h3 className="font-semibold mb-2">{t("reporterInfo")}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">{t("name")}:</span>{" "}
                    {selectedReport.reporter.firstName} {selectedReport.reporter.lastName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">{t("email")}:</span>{" "}
                    {selectedReport.reporter.email}
                  </p>
                </div>
              </div>

              {/* Campaign Info */}
              <div>
                <h3 className="font-semibold mb-2">{t("campaignInfo")}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">{t("campaignTitle")}:</span>{" "}
                    {selectedReport.target.title}
                  </p>
                </div>
              </div>

              {/* Report Details */}
              <div>
                <h3 className="font-semibold mb-2">{t("reportInfo")}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">{t("reason")}:</span>{" "}
                    {selectedReport.reason.title}
                  </p>
                  <p>
                    <span className="text-muted-foreground">{t("description")}:</span>
                  </p>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedReport.description}
                  </div>
                  <p>
                    <span className="text-muted-foreground">{t("submittedAt")}:</span>{" "}
                    {format(new Date(selectedReport.createdAt), "PPpp")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">{t("currentStatus")}:</span>{" "}
                    <Badge variant={getStatusBadgeVariant(selectedReport.status)}>
                      {selectedReport.status}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">{t("updateStatus")}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate("pending")}
                    disabled={isUpdating || selectedReport.status === "pending"}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("markPending")
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusUpdate("reviewed")}
                    disabled={isUpdating || selectedReport.status === "reviewed"}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("markReviewed")
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={isUpdating || selectedReport.status === "rejected"}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("markRejected")
                    )}
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleStatusUpdate("approved")}
                    disabled={isUpdating || selectedReport.status === "approved"}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("markApproved")
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
