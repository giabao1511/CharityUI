import { notFound } from "next/navigation";
import { Heading, BodyText } from "@/components/ui/typography";
import { getOrganizationById } from "@/lib/services/organization.service";
import { OrganizationHeader } from "@/components/organizations/organization-header";
import { OrganizationTabs } from "@/components/organizations/organization-tabs";
import { OrganizationSidebar } from "@/components/organizations/organization-sidebar";
import { getTranslations } from "next-intl/server";

export default async function OrganizationDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("organizations");

  let organization = null;
  let error = null;

  try {
    organization = await getOrganizationById(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load organization";
    console.error("Error fetching organization:", err);
    notFound();
  }

  if (!organization) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="font-semibold">⚠️ {t("errors.connectionError")}</p>
          <p className="text-sm">{t("errors.backendError", { error })}</p>
        </div>
      )}

      {/* Organization Header */}
      <OrganizationHeader organization={organization} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Organization Tabs - Client Component */}
          <OrganizationTabs organization={organization} />
        </div>

        {/* Sidebar - Client Component */}
        <OrganizationSidebar organization={organization} />
      </div>
    </div>
  );
}
