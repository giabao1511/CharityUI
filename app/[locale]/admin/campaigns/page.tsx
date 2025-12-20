"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  getAdminCampaigns,
  updateCampaign,
  deleteCampaign,
} from "@/lib/services/admin.service";
import { CampaignItem, FundStatus, FundStatusNames } from "@/types/fund";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "@/i18n/navigation";

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: FundStatus.PAUSED.toString(), label: "Paused" },
  { value: FundStatus.ACTIVE.toString(), label: "Active" },
  { value: FundStatus.COMPLETED.toString(), label: "Completed" },
  { value: FundStatus.CLOSED.toString(), label: "Closed" },
];

const STATUS_CONFIG = {
  [FundStatus.PAUSED]: {
    variant: "secondary" as const,
    color: "text-gray-600",
  },
  [FundStatus.ACTIVE]: { variant: "default" as const, color: "text-green-600" },
  [FundStatus.COMPLETED]: {
    variant: "default" as const,
    color: "text-blue-600",
  },
  [FundStatus.CLOSED]: {
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(
    null
  );

  const limit = 10;

  const [formData, setFormData] = useState({
    fundName: "",
    description: "",
    status: FundStatus.ACTIVE,
  });

  const loadCampaigns = async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit,
      };

      if (search) params.search = search;
      if (statusFilter !== "all") params.status = parseInt(statusFilter);

      const data = await getAdminCampaigns(params);
      setCampaigns(data.campaigns);
      setTotal(data.total);
    } catch (err) {
      console.error("Error loading campaigns:", err);
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns(1);
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleEdit = (campaign: CampaignItem) => {
    setSelectedCampaign(campaign);
    setFormData({
      fundName: campaign.title,
      description: campaign.description,
      status: campaign.status.campaignStatusId || FundStatus.ACTIVE,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCampaign) return;

    try {
      setProcessingId(selectedCampaign.campaignId);
      await updateCampaign(selectedCampaign.campaignId, formData);
      toast.success("Campaign updated successfully");
      setEditDialogOpen(false);
      loadCampaigns();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update campaign"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClick = (campaign: CampaignItem) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    try {
      setProcessingId(selectedCampaign.campaignId);
      await deleteCampaign(selectedCampaign.campaignId);
      toast.success("Campaign deleted successfully");
      setDeleteDialogOpen(false);
      loadCampaigns();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete campaign"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleStatusChange = async (
    campaign: CampaignItem,
    newStatus: FundStatus
  ) => {
    try {
      setProcessingId(campaign.campaignId);
      await updateCampaign(campaign.campaignId, {
        statusId: newStatus,
      });
      toast.success(
        `Campaign ${newStatus === FundStatus.ACTIVE ? "approved" : "suspended"}`
      );
      loadCampaigns();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Heading level={1} gutterBottom>
          Campaigns
        </Heading>
        <p className="text-muted-foreground">
          Manage all fundraising campaigns on the platform
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns List</CardTitle>
            <div className="text-sm text-muted-foreground">
              {total} total campaigns
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No campaigns found</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Raised</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => {
                      const progress =
                        campaign.targetAmount > 0
                          ? Math.round(
                              (campaign.currentAmount / campaign.targetAmount) *
                                100
                            )
                          : 0;
                      const statusId =
                        campaign.status.campaignStatusId || FundStatus.ACTIVE;
                      const status =
                        STATUS_CONFIG[statusId as keyof typeof STATUS_CONFIG];

                      return (
                        <TableRow key={campaign.campaignId}>
                          <TableCell className="font-medium">
                            {campaign.campaignId}
                          </TableCell>
                          <TableCell className="font-semibold max-w-[200px] truncate">
                            {campaign.title}
                          </TableCell>
                          <TableCell>
                            {campaign.organization.orgName || ""}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(campaign.targetAmount)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(campaign.currentAmount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground min-w-[40px]">
                                {progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={status?.variant || "default"}
                              className={status?.color}
                            >
                              {
                                FundStatusNames[
                                  statusId as keyof typeof FundStatusNames
                                ]
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {campaign.category?.categoryName || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/campaigns/${campaign.campaignId}`}>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              {statusId === FundStatus.PAUSED && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusChange(
                                      campaign,
                                      FundStatus.ACTIVE
                                    )
                                  }
                                  disabled={
                                    processingId === campaign.campaignId
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                  Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(campaign)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClick(campaign)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, total)} of {total} campaigns
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        loadCampaigns(newPage);
                      }}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        loadCampaigns(newPage);
                      }}
                      disabled={currentPage === totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update campaign information and status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name *</Label>
              <Input
                value={formData.fundName}
                onChange={(e) =>
                  setFormData({ ...formData, fundName: e.target.value })
                }
                placeholder="Campaign name"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Campaign description"
                rows={4}
              />
            </div>
            <div>
              <Label>Status *</Label>
              <Select
                value={formData.status.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: parseInt(value) as FundStatus,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FundStatus.ACTIVE.toString()}>
                    Active
                  </SelectItem>
                  <SelectItem value={FundStatus.PAUSED.toString()}>
                    Paused
                  </SelectItem>
                  <SelectItem value={FundStatus.COMPLETED.toString()}>
                    Completed
                  </SelectItem>
                  <SelectItem value={FundStatus.CLOSED.toString()}>
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={processingId === selectedCampaign?.campaignId}
              >
                {processingId === selectedCampaign?.campaignId && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign{" "}
              <strong>{selectedCampaign?.title}</strong>. This action cannot
              be undone and will affect all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={processingId === selectedCampaign?.campaignId}
            >
              {processingId === selectedCampaign?.campaignId && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
