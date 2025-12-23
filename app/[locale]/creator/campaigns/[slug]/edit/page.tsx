import { getTranslations } from "next-intl/server";
import { Heading, BodyText } from "@/components/ui/typography";
import { EditCampaignForm } from "@/components/creator/edit-campaign-form";
import { getCampaignById } from "@/lib/services/campaign.service";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("creator");

  // Fetch campaign data
  let campaign;
  try {
    campaign = await getCampaignById(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href={`/creator/campaigns`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Target className="h-8 w-8 text-primary" />
          <Heading level={1}>Edit Campaign</Heading>
        </div>
        <BodyText size="lg" muted>
          Update your campaign information and media
        </BodyText>
      </div>

      {/* Edit Form */}
      <EditCampaignForm campaign={campaign} />
    </div>
  );
}
