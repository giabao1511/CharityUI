"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Loader2 } from "lucide-react";
import { Donation } from "@/types";
import { Heading, BodyText } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";
import {
  getDonorDisplayName,
  parseDonationAmount,
  getCampaignDonations,
} from "@/lib/services/donation.service";
import { Pagination } from "@/components/ui/pagination";
import { useState, useEffect } from "react";

interface DonationsListProps {
  campaignId: string | number;
  initialDonations?: Donation[];
  initialPage?: number;
  initialTotalPages?: number;
}

const DONATIONS_PER_PAGE = 10;

export function DonationsList({
  campaignId,
  initialDonations = [],
  initialPage = 1,
  initialTotalPages = 1,
}: DonationsListProps) {
  const locale = useLocale() as "en" | "vi";
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  // Reset state when campaignId changes (navigation to different campaign)
  useEffect(() => {
    setDonations(initialDonations);
    setCurrentPage(initialPage);
    setTotalPages(initialTotalPages);
  }, [campaignId, initialDonations, initialPage, initialTotalPages]);

  // Fetch donations when page changes
  useEffect(() => {
    async function fetchDonations() {
      // Skip fetch if we're on the initial page and have initial data
      if (currentPage === initialPage && initialDonations.length > 0 && donations === initialDonations) {
        return;
      }

      setLoading(true);
      try {
        const result = await getCampaignDonations(campaignId, {
          page: currentPage,
          limit: DONATIONS_PER_PAGE,
        });

        if (result.data) {
          setDonations(result.data);
        }

        if (result.pagination) {
          const total = Math.ceil(result.pagination.total / DONATIONS_PER_PAGE);
          setTotalPages(total);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, [currentPage, campaignId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of donations list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && donations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-3 text-primary animate-spin" />
          <BodyText muted>Loading donations...</BodyText>
        </CardContent>
      </Card>
    );
  }

  if (!loading && donations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <BodyText muted>
            No donations yet. Be the first to support this campaign!
          </BodyText>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Heading level={3}>Recent Donations</Heading>
        <Badge variant="secondary">
          {donations.length} {donations.length === 1 ? "donation" : "donations"}
        </Badge>
      </div>

      <div
        className={`grid gap-4 md:grid-cols-2 ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {donations.map((donation) => {
          const donorName = getDonorDisplayName(donation);
          const amount = parseDonationAmount(donation.amount);
          const isAnonymous = donation.isAnonymous;

          return (
            <Card
              key={donation.donationId}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className={`h-10 w-10 rounded-full ${
                      isAnonymous ? "bg-muted" : "bg-primary/10"
                    } flex items-center justify-center flex-shrink-0`}
                  >
                    {isAnonymous ? (
                      <Heart
                        className="h-5 w-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    ) : (
                      <User
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Donation info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <BodyText weight="semibold" className="truncate">
                        {donorName}
                      </BodyText>
                      <BodyText
                        weight="bold"
                        className="text-primary flex-shrink-0"
                      >
                        {formatCurrency(amount)}
                      </BodyText>
                    </div>

                    {/* Status badge */}
                    {donation.status && (
                      <Badge
                        variant={
                          donation.status.donationStatusId === 2
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs mb-2"
                      >
                        {donation.status.statusName}
                      </Badge>
                    )}

                    {/* Message */}
                    {donation.message && (
                      <BodyText
                        size="sm"
                        muted
                        className="italic mb-2 line-clamp-2"
                      >
                        "{donation.message}"
                      </BodyText>
                    )}

                    {/* Date */}
                    <BodyText size="xs" muted>
                      {new Date(donation.donateDate).toLocaleDateString(
                        locale === "vi" ? "vi-VN" : "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </BodyText>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Loading Overlay */}
      {loading && donations.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
