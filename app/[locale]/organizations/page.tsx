import { Heading, BodyText } from "@/components/ui/typography";
import { getTranslations } from "next-intl/server";
import { getOrganizations } from "@/lib/services/organization.service";
import { OrganizationList } from "@/components/organizations/organization-list";
import type { OrganizationListItem } from "@/types/organization";

export default async function OrganizationsPage() {
  const t = await getTranslations("organizations");

  // Fetch organizations from the API
  let organizations: OrganizationListItem[] = [];
  let error = null;

  try {
    const result = await getOrganizations({ page: 1, limit: 100 });
    if (result.data) {
      organizations = result.data;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load organizations";
    console.error("Error fetching organizations:", err);
    organizations = [];
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-12">
        <Heading level={1} gutterBottom>
          Organizations
        </Heading>
        <BodyText size="lg" muted>
          Discover verified charitable organizations making a difference
        </BodyText>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ Connection Error</p>
          <p className="text-sm">Backend API error: {error}</p>
          <p className="text-sm mt-1">
            Please ensure the backend server is running.
          </p>
        </div>
      )}

      {/* Organizations List */}
      <OrganizationList organizations={organizations} />
    </div>
  );
}
