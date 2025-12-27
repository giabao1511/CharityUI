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
import { Wallet, Loader2, AlertCircle, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getWithdrawals, approveWithdrawal } from "@/lib/services/withdrawal.service";
import { Withdrawal } from "@/types/withdrawal";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { RejectWithdrawalDialog } from "@/components/admin/reject-withdrawal-dialog";

export default function WithdrawalsManagementPage() {
  const t = useTranslations("admin.withdrawals");
  const tCommon = useTranslations("common");

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  // Load withdrawals on mount and when filters change
  useEffect(() => {
    loadWithdrawals();
  }, [statusFilter, page]);

  const loadWithdrawals = async () => {
    try {
      setIsLoading(true);
      const filters: any = {
        page,
        limit,
      };

      // Add status filter if not "all"
      if (statusFilter !== "all") {
        filters.status = parseInt(statusFilter);
      }

      const response = await getWithdrawals(filters);
      setWithdrawals(response.data || []);
      setPagination(response.pagination || { total: 0, page: 1, limit: 10 });
    } catch (error) {
      console.error("Error loading withdrawals:", error);
      toast.error(t("errorLoadingWithdrawals"));
    } finally {
      setIsLoading(false);
    }
  };

  const openWithdrawalDialog = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedWithdrawal) return;

    try {
      setIsUpdating(true);
      await approveWithdrawal(selectedWithdrawal.withdrawalId);

      toast.success(t("approveSuccess"));
      setIsDialogOpen(false);
      setSelectedWithdrawal(null);
      // Reload withdrawals to get updated data
      loadWithdrawals();
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error(t("approveError"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = () => {
    setIsDialogOpen(false);
    setIsRejectDialogOpen(true);
  };

  const handleRejectSuccess = () => {
    setSelectedWithdrawal(null);
    loadWithdrawals();
  };

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading level={1} gutterBottom>
          {t("title")}
        </Heading>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                {t("status")}
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="1">{t("pending")}</SelectItem>
                  <SelectItem value="2">{t("approved")}</SelectItem>
                  <SelectItem value="3">{t("rejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("withdrawalsList")}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {t("total")}: {pagination.total}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("noWithdrawals")}</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("withdrawalId")}</TableHead>
                      <TableHead>{t("campaignId")}</TableHead>
                      <TableHead>{t("requester")}</TableHead>
                      <TableHead>{t("amount")}</TableHead>
                      <TableHead>{t("purpose")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("requestedAt")}</TableHead>
                      <TableHead className="text-right">{tCommon("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.withdrawalId}>
                        <TableCell className="font-medium">
                          #{withdrawal.withdrawalId}
                        </TableCell>
                        <TableCell>#{withdrawal.campaignId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {withdrawal.requester.firstName}{" "}
                              {withdrawal.requester.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {withdrawal.requester.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {parseFloat(withdrawal.amount).toLocaleString()}₫
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {withdrawal.purpose}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(
                              withdrawal.status.statusName
                            )}
                          >
                            {withdrawal.status.statusName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(withdrawal.requestedAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openWithdrawalDialog(withdrawal)}
                          >
                            {t("viewDetails")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    {t("page")} {pagination.page} {t("of")} {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t("previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      {t("next")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("withdrawalDetails")}</DialogTitle>
            <DialogDescription>
              {t("viewFullDetails")}
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("withdrawalId")}</h3>
                  <p className="text-sm">#{selectedWithdrawal.withdrawalId}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t("campaignId")}</h3>
                  <p className="text-sm">#{selectedWithdrawal.campaignId}</p>
                </div>
              </div>

              {/* Amount & Purpose */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("amount")}</h3>
                  <p className="text-2xl font-bold text-primary">
                    {parseFloat(selectedWithdrawal.amount).toLocaleString()}₫
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t("status")}</h3>
                  <Badge
                    variant={getStatusBadgeVariant(
                      selectedWithdrawal.status.statusName
                    )}
                    className="text-sm"
                  >
                    {selectedWithdrawal.status.statusName}
                  </Badge>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <h3 className="font-semibold mb-2">{t("purpose")}</h3>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">{selectedWithdrawal.purpose}</p>
                </div>
              </div>

              {/* Requester Info */}
              <div>
                <h3 className="font-semibold mb-2">{t("requesterInfo")}</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">{t("name")}:</span>{" "}
                    {selectedWithdrawal.requester.firstName}{" "}
                    {selectedWithdrawal.requester.lastName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">{t("email")}:</span>{" "}
                    {selectedWithdrawal.requester.email}
                  </p>
                </div>
              </div>

              {/* Approver Info */}
              {selectedWithdrawal.approver && (
                <div>
                  <h3 className="font-semibold mb-2">{t("approverInfo")}</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">{t("name")}:</span>{" "}
                      {selectedWithdrawal.approver.firstName}{" "}
                      {selectedWithdrawal.approver.lastName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">{t("email")}:</span>{" "}
                      {selectedWithdrawal.approver.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Wallet Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("fromWallet")}</h3>
                  <div className="space-y-1 text-sm p-3 bg-muted rounded-md">
                    <p>
                      <span className="text-muted-foreground">{t("walletId")}:</span>{" "}
                      #{selectedWithdrawal.fromWallet.walletId}
                    </p>
                    <p>
                      <span className="text-muted-foreground">{t("balance")}:</span>{" "}
                      {parseFloat(selectedWithdrawal.fromWallet.balance).toLocaleString()}₫
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t("toWallet")}</h3>
                  <div className="space-y-1 text-sm p-3 bg-muted rounded-md">
                    <p>
                      <span className="text-muted-foreground">{t("walletId")}:</span>{" "}
                      #{selectedWithdrawal.toWallet.walletId}
                    </p>
                    <p>
                      <span className="text-muted-foreground">{t("balance")}:</span>{" "}
                      {parseFloat(selectedWithdrawal.toWallet.balance).toLocaleString()}₫
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("requestedAt")}</h3>
                  <p className="text-sm">
                    {format(new Date(selectedWithdrawal.requestedAt), "PPpp")}
                  </p>
                </div>
                {selectedWithdrawal.approvedAt && (
                  <div>
                    <h3 className="font-semibold mb-2">{t("approvedAt")}</h3>
                    <p className="text-sm">
                      {format(new Date(selectedWithdrawal.approvedAt), "PPpp")}
                    </p>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              {selectedWithdrawal.reasonRejected && (
                <div>
                  <h3 className="font-semibold mb-2 text-destructive">
                    {t("reasonRejected")}
                  </h3>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm">{selectedWithdrawal.reasonRejected}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons - Only show for pending withdrawals */}
              {selectedWithdrawal.status.statusName.toLowerCase() === "pending" && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">{t("actions")}</h3>
                  <div className="flex gap-3">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleApprove}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {t("approve")}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleReject}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      {t("reject")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Withdrawal Dialog */}
      <RejectWithdrawalDialog
        withdrawal={selectedWithdrawal}
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onSuccess={handleRejectSuccess}
      />
    </div>
  );
}
