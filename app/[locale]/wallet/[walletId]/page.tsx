"use client";

import { useState, useEffect, use } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Wallet as WalletIcon,
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Building2,
  Target,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Heading, BodyText } from "@/components/ui/typography";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getWalletDetail } from "@/lib/services/wallet.service";
import { getTransactions } from "@/lib/services/transaction.service";
import { isTokenExpired } from "@/lib/services/auth.service";
import { Wallet } from "@/types/wallet";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/currency";
import { WithdrawalRequestDialog } from "@/components/wallet/withdrawal-request-dialog";

interface WalletDetailPageProps {
  params: Promise<{
    walletId: string;
  }>;
}

export default function WalletDetailPage({ params }: WalletDetailPageProps) {
  const router = useRouter();
  const t = useTranslations("wallet");
  const tCommon = useTranslations("common");

  const { walletId: walletIdParam } = use(params);
  const walletId = parseInt(walletIdParam);

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "donation" | "withdrawal"
  >("all");
  const limit = 10;

  useEffect(() => {
    loadWalletDetails();
  }, [walletId]);

  useEffect(() => {
    loadTransactions();
  }, [walletId, currentPage, typeFilter]);

  const loadWalletDetails = async () => {
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

      setIsLoading(true);
      const data = await getWalletDetail(walletId);
      setWallet(data);
    } catch (error) {
      console.error("Error loading wallet details:", error);
      toast.error(t("errorLoadingDetails"));
      router.push("/wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const params: any = {
        walletId,
        page: currentPage,
        limit,
      };

      if (typeFilter !== "all") {
        params.type = typeFilter;
      }

      const data = await getTransactions(params);
      setTransactions(data.data || []);
      setTotalTransactions(data.pagination.total);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error(t("errorLoadingTransactions"));
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleRefresh = () => {
    loadWalletDetails();
    loadTransactions();
  };

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTypeBadgeVariant = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "inflow":
        return "default";
      case "outflow":
        return "destructive";
      default:
        return "outline";
    }
  };

  const totalPages = Math.ceil(totalTransactions / limit);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="container py-8 max-w-7xl">
        <div className="text-center py-12">
          <BodyText muted>{t("walletNotFound")}</BodyText>
          <Link href="/wallet">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToWallets")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log("transactions", transactions);

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/wallet">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToWallets")}
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1} gutterBottom>
              {t("walletDetails")}
            </Heading>
            <BodyText muted>
              {t("walletId")}: #{wallet.walletId}
            </BodyText>
          </div>
          <div className="flex items-center gap-2">
            <WithdrawalRequestDialog
              wallet={wallet}
              onSuccess={handleRefresh}
            />
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refresh")}
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Info Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("currentBalance")}
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(parseFloat(wallet.balance))}
            </div>
            <Badge
              variant={getStatusBadgeVariant(wallet.status.statusName)}
              className="mt-2"
            >
              {wallet.status.statusName}
            </Badge>
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
              {formatCurrency(parseFloat(wallet.receiveAmount))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("allTimeReceived")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("type")}</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {wallet.type.walletTypeName}
            </div>
            {wallet.campaign && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                <span className="truncate">{wallet.campaign.title}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Owner & Bank Info */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("ownerInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("name")}:</span>
              <span className="font-medium">
                {wallet.owner.firstName} {wallet.owner.lastName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("email")}:</span>
              <span className="font-medium">{wallet.owner.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Bank Info */}
        {wallet.bankInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("bankInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("bankName")}:</span>
                <span className="font-medium">{wallet.bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("accountNumber")}:
                </span>
                <span className="font-medium">
                  {wallet.bankInfo.accountNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("accountHolder")}:
                </span>
                <span className="font-medium">
                  {wallet.bankInfo.accountHolder}
                </span>
              </div>
              {wallet.bankInfo.branch && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("branch")}:</span>
                  <span className="font-medium">{wallet.bankInfo.branch}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("transactionHistory")}</CardTitle>
              <CardDescription>
                {t("viewAllTransactions")} ({totalTransactions})
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={typeFilter}
                onValueChange={(value: any) => {
                  setTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allTypes")}</SelectItem>
                  <SelectItem value="donation">{t("donation")}</SelectItem>
                  <SelectItem value="withdrawal">{t("withdrawal")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <BodyText muted>{t("noTransactions")}</BodyText>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("transactionId")}</TableHead>
                      <TableHead>{t("type")}</TableHead>
                      <TableHead>{t("amount")}</TableHead>
                      <TableHead>{t("balanceBefore")}</TableHead>
                      <TableHead>{t("balanceAfter")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const isInflow =
                        transaction.type.typeName.toLowerCase() === "inflow";
                      return (
                        <TableRow key={transaction.transactionId}>
                          <TableCell className="font-medium">
                            #{transaction.transactionId}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getTypeBadgeVariant(
                                transaction.type.typeName
                              )}
                              className="flex items-center gap-1 w-fit"
                            >
                              {isInflow ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {transaction.type.typeName}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`font-semibold ${
                              isInflow ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isInflow ? "+" : "-"}
                            {formatCurrency(parseFloat(transaction.amount))}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCurrency(
                              parseFloat(transaction.balanceBefore)
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(
                              parseFloat(transaction.balanceAfter)
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(
                                transaction.status.statusName
                              )}
                            >
                              {transaction.status.statusName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(
                              transaction.transactionTime
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <BodyText size="sm" muted>
                    {t("showingResults", {
                      from: (currentPage - 1) * limit + 1,
                      to: Math.min(currentPage * limit, totalTransactions),
                      total: totalTransactions,
                    })}
                  </BodyText>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
