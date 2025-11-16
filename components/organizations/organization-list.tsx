"use client";

import { OrganizationCard } from "./organization-card";
import { BodyText } from "@/components/ui/typography";
import type { OrganizationListItem } from "@/types/organization";

interface OrganizationListProps {
  readonly organizations: OrganizationListItem[];
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  if (!organizations || organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <BodyText size="lg" muted>
          No organizations found.
        </BodyText>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations.map((organization) => (
        <OrganizationCard key={organization.orgId} organization={organization} />
      ))}
    </div>
  );
}
