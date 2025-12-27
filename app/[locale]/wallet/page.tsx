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
  Wallet as WalletIcon,
  Loader2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Target,
} from "lucide-react";
import { Heading } from "@/components/ui/typography";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getUserWallets } from "@/lib/services/wallet.service";
import { isTokenExpired } from "@/lib/services/auth.service";
import { Wallet } from "@/types/wallet";

export default function WalletPage() {
  const router = useRouter();
  const t = useTranslations("wallet");
  const tCommon = useTranslations("common");

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                        <Link href={`/wallet/${wallet.walletId}`}>
                          <Button variant="outline" size="sm">
                            {t("viewDetails")}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
