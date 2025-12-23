import { getTranslations } from "next-intl/server";
import { Heading, BodyText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { OrganizationsListClient } from "@/components/creator/organizations-list-client";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";

export default async function CreatorOrganizationsPage() {
  const t = await getTranslations("creator");

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/creator"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <Heading level={1} gutterBottom>
              My Organizations
            </Heading>
            <BodyText size="lg" muted>
              Manage your organizations and their campaigns
            </BodyText>
          </div>
          <Link href="/organizations/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </Link>
        </div>
      </div>

      {/* Organizations List */}
      <OrganizationsListClient />
    </div>
  );
}
