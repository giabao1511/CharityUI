"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Users, Calendar } from "lucide-react";
import type { Organization } from "@/types/organization";

interface OrganizationSidebarProps {
  readonly organization: Organization;
}

export function OrganizationSidebar({
  organization,
}: OrganizationSidebarProps) {
  const wallet = organization.wallets?.[0];
  const campaignsCount = organization.campaigns?.length || 0;

  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      {wallet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Balance
              </p>
              <p className="text-2xl font-bold">
                ${wallet.balance.toLocaleString()}
              </p>
            </div>
            <div className="pt-4 border-t">
              <Badge variant={wallet.statusId === 1 ? "default" : "secondary"}>
                {wallet.status?.statusName || "Unknown"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Accounts */}
      {organization.banks && organization.banks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {organization.banks.map((bank) => (
              <div
                key={bank.bankAccountId}
                className="border-l-2 border-primary pl-3"
              >
                <p className="font-medium text-sm">{bank.bankName}</p>
                <p className="text-xs text-muted-foreground">
                  {bank.accountHolder}
                </p>
                {bank.branch && (
                  <p className="text-xs text-muted-foreground">{bank.branch}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Organization Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{new Date(organization.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span>{new Date(organization.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
