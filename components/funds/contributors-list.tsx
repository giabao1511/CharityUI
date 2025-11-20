"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Contributor } from "@/types";
import { Heading, BodyText } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface ContributorsListProps {
  contributors: Contributor[];
}

export function ContributorsList({ contributors }: ContributorsListProps) {
  const locale = useLocale() as 'en' | 'vi';
  if (contributors.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BodyText muted>No contributors yet. Be the first to support this campaign!</BodyText>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Heading level={3}>Recent Contributors</Heading>
        <Badge variant="secondary">
          {contributors.length} {contributors.length === 1 ? 'backer' : 'backers'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contributors.map((contributor) => (
          <Card key={contributor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>

                {/* Contributor info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <BodyText weight="semibold" className="truncate">
                      {contributor.isAnonymous ? "Anonymous" : contributor.name}
                    </BodyText>
                    <BodyText weight="bold" className="text-primary flex-shrink-0">
                      {formatCurrency(contributor.amount)}
                    </BodyText>
                  </div>

                  {/* Reward tier badge */}
                  {contributor.rewardTier && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {contributor.rewardTier}
                    </Badge>
                  )}

                  {/* Date */}
                  <BodyText size="sm" muted>
                    {new Date(contributor.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </BodyText>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
