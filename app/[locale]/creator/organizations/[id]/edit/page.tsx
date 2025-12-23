import { getTranslations } from "next-intl/server";
import { Heading, BodyText } from "@/components/ui/typography";
import { EditOrganizationForm } from "@/components/creator/edit-organization-form";
import { getOrganizationById } from "@/lib/services/organization.service";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("creator");

  // Fetch organization data
  let organization;
  try {
    organization = await getOrganizationById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href={`/creator/organizations`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organization
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <Heading level={1}>Edit Organization</Heading>
        </div>
        <BodyText size="lg" muted>
          Update your organization&apos;s information and media
        </BodyText>
      </div>

      {/* Edit Form */}
      <EditOrganizationForm organization={organization} />
    </div>
  );
}
