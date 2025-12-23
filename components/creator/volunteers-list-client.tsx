"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { getCampaignVolunteers } from "@/lib/services/creator.service";
import { Volunteer } from "@/types/fund";
import { AlertCircle, Loader2 } from "lucide-react";
import { VolunteerList } from "./volunteer-list";

const ITEMS_PER_PAGE = 10;

interface VolunteersListClientProps {
  readonly campaignId: number;
}

export function VolunteersListClient({
  campaignId,
}: VolunteersListClientProps) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCampaignVolunteers(campaignId, {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setVolunteers(result.volunteers);

      // Set pagination info
      if (result.pagination) {
        setTotalItems(result.pagination.total || 0);
        setTotalPages(
          Math.ceil((result.pagination.total || 0) / ITEMS_PER_PAGE)
        );
      }
    } catch (error) {
      console.error("Error loading volunteers:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load volunteers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, currentPage]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading volunteers...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Volunteers
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state - render the volunteer list with pagination
  return (
    <div className="space-y-4">
      <VolunteerList
        volunteers={volunteers}
        campaignId={campaignId}
        onUpdate={loadVolunteers}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {totalItems > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {volunteers.length} of {totalItems} volunteers
        </p>
      )}
    </div>
  );
}
