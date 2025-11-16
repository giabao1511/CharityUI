"use client";

import { RewardTiersList } from "./reward-tiers-list";
import { RewardTier } from "@/types";

interface CampaignRewardSectionProps {
  readonly rewardTiers: RewardTier[];
}

export function CampaignRewardSection({ rewardTiers }: CampaignRewardSectionProps) {
  const handleSelectTier = (tierId: string) => {
    // In a real app, this would update the sidebar state or trigger a modal
    console.log('Selected tier:', tierId);
  };

  return (
    <RewardTiersList
      rewardTiers={rewardTiers}
      onSelectTier={handleSelectTier}
    />
  );
}
