"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/currency";
import {
  deleteCampaign,
  getAdminCampaigns,
  updateCampaign,
} from "@/lib/services/admin.service";
import { CampaignItem, FundStatus, FundStatusNames } from "@/types/fund";
import {
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  Eye,
  Loader2,
  Search,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  [FundStatus.ACTIVE]: {
    variant: "default" as const,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  [FundStatus.COMPLETED]: {
    variant: "default" as const,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  [FundStatus.CLOSED]: {
    variant: "destructive" as const,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
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

  // Stats
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
    averageProgress: 0,
  });

  const limit = 12;

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

      // Calculate stats
      const activeCampaigns = data.campaigns.filter(
        (c) => c.status.campaignStatusId === FundStatus.ACTIVE
      ).length;
      const totalRaised = data.campaigns.reduce(
        (sum, c) => sum + c.currentAmount,
        0
      );
      const avgProgress =
        data.campaigns.length > 0
          ? data.campaigns.reduce((sum, c) => {
              const progress =
                c.targetAmount > 0
                  ? (c.currentAmount / c.targetAmount) * 100
                  : 0;
              return sum + progress;
            }, 0) / data.campaigns.length
          : 0;

      setStats({
        totalCampaigns: data.total,
        activeCampaigns,
        totalRaised,
        averageProgress: Math.round(avgProgress),
      });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading level={1} gutterBottom>
          Campaigns Management
        </Heading>
        <p className="text-muted-foreground">
          Manage all fundraising campaigns on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRaised)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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

      {/* Campaigns Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No campaigns found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const progress =
                campaign.targetAmount > 0
                  ? Math.round(
                      (campaign.currentAmount / campaign.targetAmount) * 100
                    )
                  : 0;
              const statusId =
                campaign.status.campaignStatusId || FundStatus.ACTIVE;
              const status =
                STATUS_CONFIG[statusId as keyof typeof STATUS_CONFIG];

              return (
                <Card
                  key={campaign.campaignId}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                    {campaign.media?.[0]?.url ? (
                      <Image
                        src={campaign.media[0].url}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Target className="h-16 w-16 text-primary/20" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={status?.color}>
                        {
                          FundStatusNames[
                            statusId as keyof typeof FundStatusNames
                          ]
                        }
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="pt-6 space-y-4">
                    {/* Campaign Info */}
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                        {campaign.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">
                          {campaign.organization.orgName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(campaign.targetAmount)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{progress}% funded</span>
                        <Badge variant="outline" className="text-xs">
                          {campaign.category?.categoryName || "General"}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        href={`/campaigns/${campaign.campaignId}`}
                        className="flex-1"
                      >
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      {statusId === FundStatus.PAUSED && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            handleStatusChange(campaign, FundStatus.ACTIVE)
                          }
                          disabled={processingId === campaign.campaignId}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(campaign)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, total)} of {total} campaigns
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  loadCampaigns(page);
                }}
              />
            </div>
          )}
        </>
      )}

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
              <strong>{selectedCampaign?.title}</strong>. This action cannot be
              undone and will affect all associated data.
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
