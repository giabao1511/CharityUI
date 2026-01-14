"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Globe } from "lucide-react";
import { Heading, BodyText } from "@/components/ui/typography";
import type { OrganizationListItem } from "@/types/organization";
import { useTranslations } from "next-intl";

interface OrganizationCardProps {
  readonly organization: OrganizationListItem;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const t = useTranslations("organizations");

  // Map status ID to translation key
  const getStatusTranslationKey = (statusId: number): string => {
    switch (statusId) {
      case 1:
        return "status.active";
      case 2:
        return "status.rejected";
      case 3:
        return "status.pending";
      case 4:
        return "status.suspended";
      default:
        return "status.pending";
    }
  };

  const statusName = t(getStatusTranslationKey(organization.statusId ?? 3));
  const isActive = organization.statusId === 1; // Active status

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] relative bg-gradient-to-br from-primary/10 to-primary/5">
        {organization.avatar ? (
          <img
            src={organization.avatar}
            alt={organization.orgName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant={isActive ? "default" : "secondary"}>
            {organization.status?.orgStatusName}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <Heading level={3} className="mb-2 line-clamp-1">
          {organization.orgName}
        </Heading>

        <BodyText size="sm" muted className="mb-4 line-clamp-2">
          {organization.description || t("noDescription")}
        </BodyText>

        <div className="space-y-2">
          {organization.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground line-clamp-1">
                {organization.address}
              </span>
            </div>
          )}

          {organization.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline line-clamp-1"
              >
                {organization.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/organizations/${organization.orgId}`} className="w-full">
          <Button className="w-full">{t("viewOrganization")}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
