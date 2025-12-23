"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wallet as WalletIcon,
  Loader2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Building2,
  Target,
} from "lucide-react";
import { Heading } from "@/components/ui/typography";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getUserWallets, getWalletDetail } from "@/lib/services/wallet.service";
import { isTokenExpired } from "@/lib/services/auth.service";
import { Wallet } from "@/types/wallet";

export default function WalletPage() {
  const router = useRouter();
  const t = useTranslations("wallet");
  const tCommon = useTranslations("common");

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      // Check authentication
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error(t("notAuthenticated"));
        router.push("/auth");
        return;
      }

      const expired = isTokenExpired(accessToken);
      if (expired) {
        toast.error(t("sessionExpired"));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/auth");
        return;
      }

      // Get user ID from localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error(t("notAuthenticated"));
        router.push("/auth");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.userId;

      setIsLoading(true);
      const data = await getUserWallets(userId);
      setWallets(data);
    } catch (error) {
      console.error("Error loading wallets:", error);
      toast.error(t("errorLoadingWallets"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (wallet: Wallet) => {
    try {
      setIsLoadingDetail(true);
      setIsDialogOpen(true);
      const details = await getWalletDetail(wallet.walletId);
      setSelectedWallet(details);
    } catch (error) {
      console.error("Error loading wallet details:", error);
      toast.error(t("errorLoadingDetails"));
      setIsDialogOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const totalBalance = wallets.reduce(
    (sum, wallet) => sum + parseFloat(wallet.balance),
    0
  );

  const totalReceived = wallets.reduce(
    (sum, wallet) => sum + parseFloat(wallet.receiveAmount),
    0
  );

  console.log(wallets)

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Heading level={1} gutterBottom>
          {t("title")}
        </Heading>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalBalance")}
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBalance.toString())}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("acrossWallets", { count: wallets.length })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalReceived")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalReceived.toString())}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("allTimeReceived")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalWallets")}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("activeWallets")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallets List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("myWallets")}</CardTitle>
          <CardDescription>{t("manageYourWallets")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : wallets.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">{t("noWallets")}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("walletId")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("balance")}</TableHead>
                    <TableHead>{t("received")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("campaign")}</TableHead>
                    <TableHead className="text-right">
                      {tCommon("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.walletId}>
                      <TableCell className="font-medium">
                        #{wallet.walletId}
                      </TableCell>
                      <TableCell>{wallet.type.walletTypeName}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(wallet.balance)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(wallet.receiveAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(
                            wallet.status.statusName
                          )}
                        >
                          {wallet.status.statusName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {wallet.campaign ? (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {wallet.campaign.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(wallet)}
                        >
                          {t("viewDetails")}
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

      {/* Wallet Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("walletDetails")}</DialogTitle>
            <DialogDescription>{t("viewWalletInfo")}</DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedWallet ? (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div>
                <h3 className="font-semibold mb-3">{t("walletInformation")}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {t("walletId")}:
                    </span>{" "}
                    #{selectedWallet.walletId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t("type")}:</span>{" "}
                    {selectedWallet.type.walletTypeName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t("balance")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {formatCurrency(selectedWallet.balance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t("received")}:
                    </span>{" "}
                    {formatCurrency(selectedWallet.receiveAmount)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t("status")}:
                    </span>{" "}
                    <Badge
                      variant={getStatusBadgeVariant(
                        selectedWallet.status.statusName
                      )}
                    >
                      {selectedWallet.status.statusName}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <h3 className="font-semibold mb-3">{t("ownerInformation")}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t("name")}:</span>{" "}
                    {selectedWallet.owner.firstName}{" "}
                    {selectedWallet.owner.lastName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t("email")}:</span>{" "}
                    {selectedWallet.owner.email}
                  </div>
                </div>
              </div>

              {/* Campaign Info */}
              {selectedWallet.campaign && (
                <div>
                  <h3 className="font-semibold mb-3">
                    {t("campaignInformation")}
                  </h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {selectedWallet.campaign.title}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("campaignId")}: #{selectedWallet.campaign.campaignId}
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Info */}
              {selectedWallet.bankInfo && (
                <div>
                  <h3 className="font-semibold mb-3">{t("bankInformation")}</h3>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {selectedWallet.bankInfo.bankName}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          {t("accountNumber")}:
                        </span>{" "}
                        {selectedWallet.bankInfo.accountNumber}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {t("accountHolder")}:
                        </span>{" "}
                        {selectedWallet.bankInfo.accountHolder}
                      </div>
                      {selectedWallet.bankInfo.branch && (
                        <div>
                          <span className="text-muted-foreground">
                            {t("branch")}:
                          </span>{" "}
                          {selectedWallet.bankInfo.branch}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
