import { getTranslations } from "next-intl/server";
import { Heading, BodyText } from "@/components/ui/typography";
import { CreateCampaignForm } from "@/components/creator/create-campaign-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewCampaignPage() {
  const t = await getTranslations("creator.create");

  return (
    <div className="container max-w-4xl py-12 md:py-16">
      {/* Breadcrumb */}
      <Link
        href="/creator/campaigns"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Campaigns
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <Heading level={1} gutterBottom>
          {t("pageTitle")}
        </Heading>
        <BodyText size="lg" muted>
          {t("pageSubtitle")}
        </BodyText>
      </div>

      {/* Campaign Creation Form */}
      <CreateCampaignForm />
    </div>
  );
}
