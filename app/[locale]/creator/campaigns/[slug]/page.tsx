import { CampaignDetailClient } from "@/components/creator/campaign-detail-client";

export default async function CreatorCampaignDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;

  return <CampaignDetailClient campaignId={slug} />;
}
