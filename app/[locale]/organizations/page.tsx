import { Heading, BodyText } from "@/components/ui/typography";
import { getTranslations } from "next-intl/server";
import { getOrganizations } from "@/lib/services/organization.service";
import { OrganizationList } from "@/components/organizations/organization-list";
import { OrganizationFilters } from "@/components/organizations/organization-filters";
import type { OrganizationListItem } from "@/types/organization";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const t = await getTranslations("organizations");
  const params = await searchParams;

  // Parse query parameters
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "12");
  const search = params.search || "";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "DESC";

  // Fetch organizations from the API
  let organizations: OrganizationListItem[] = [];
  let error = null;
  let totalCount = 0;
  let totalPages = 1;

  try {
    const result = await getOrganizations({
      page,
      limit,
      search,
      sortBy: sortBy as "orgName" | "createdAt",
      sortOrder: sortOrder as "ASC" | "DESC",
      statusId: 1, // Only show active organizations
    });
    if (result.data) {
      // Client-side filtering to ensure only active organizations (status.orgStatusId === 1) are shown
      // Backend returns status as nested object: { status: { orgStatusId: 1, orgStatusName: "Active" } }
      organizations = result.data.filter(org => {
        // Check both statusId (direct) and status.orgStatusId (nested)
        return org.statusId === 1 || org.status?.orgStatusId === 1;
      });

      totalCount = organizations.length;
      totalPages = Math.ceil(totalCount / limit);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load organizations";
    console.error("Error fetching organizations:", err);
    organizations = [];
    totalPages = 1;
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-12">
        <Heading level={1} gutterBottom>
          {t("title")}
        </Heading>
        <BodyText size="lg" muted>
          {t("subtitle")}
        </BodyText>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ {t("errors.connectionError")}</p>
          <p className="text-sm">{t("errors.backendError", { error })}</p>
          <p className="text-sm mt-1">
            {t("errors.ensureBackend")}
          </p>
        </div>
      )}

      {/* Filters and Pagination */}
      <div className="mb-8">
        <OrganizationFilters
          defaultValues={{
            search: search,
            sortBy: sortBy,
            sortOrder: sortOrder,
          }}
          currentPage={page}
          totalPages={totalPages}
        />

        {/* Results Count */}
        <div className="text-sm text-muted-foreground mt-4">
          Showing {organizations.length} of {totalCount} organizations
        </div>
      </div>

      {/* Organizations List */}
      <OrganizationList organizations={organizations} />
    </div>
  );
}
