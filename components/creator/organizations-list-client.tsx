"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/lib/auth-context";
import { getOrganizationsByUserId } from "@/lib/services/creator.service";
import { OrganizationListItem } from "@/types/organization";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrganizationsTable } from "./organizations-table";

const ITEMS_PER_PAGE = 10;

export function OrganizationsListClient() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    async function loadOrganizations() {
      // Check if user is authenticated
      if (!user) {
        setError("Please sign in to view your organizations");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch organizations with pagination
        const result = await getOrganizationsByUserId(user.userId, {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        console.log("Organizations API Response:", result);

        setOrganizations(result.organizations);

        // Set pagination info
        if (result.pagination) {
          setTotalItems(result.pagination.total || 0);
          setTotalPages(
            Math.ceil((result.pagination.total || 0) / ITEMS_PER_PAGE)
          );
        }
      } catch (error) {
        console.error("Error loading organizations:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load organizations"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrganizations();
  }, [user, currentPage]);

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading your organizations...
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
              Error Loading Organizations
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-3">
              {!user && (
                <Button asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state - render the table with pagination
  return (
    <div className="space-y-4">
      <OrganizationsTable organizations={organizations} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {totalItems > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {organizations.length} of {totalItems} organizations
        </p>
      )}
    </div>
  );
}
