import { getTranslations } from "next-intl/server";
import { Heading, BodyText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { CampaignsListClient } from "@/components/creator/campaigns-list-client";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";

export default async function CreatorCampaignsPage() {
  const t = await getTranslations("creator.campaigns");

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
              {t("title")}
            </Heading>
            <BodyText size="lg" muted>
              {t("subtitle")}
            </BodyText>
          </div>
          <Link href="/creator/campaigns/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("createNew")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaigns Table - Now using real API */}
      <CampaignsListClient />
    </div>
  );
}
