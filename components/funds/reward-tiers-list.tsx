"use client";

import { useState } from "react";
import { RewardTierCard } from "./reward-tier-card";
import { RewardTier } from "@/types";
import { Heading } from "@/components/ui/typography";

interface RewardTiersListProps {
  rewardTiers: RewardTier[];
  onSelectTier: (tierId: string) => void;
}

export function RewardTiersList({ rewardTiers, onSelectTier }: RewardTiersListProps) {
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    onSelectTier(tierId);
    
    // Scroll to contribution sidebar
    const sidebar = document.querySelector('[data-contribution-sidebar]');
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (rewardTiers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Heading level={2}>Support & Rewards</Heading>
      <div className="grid gap-6 md:grid-cols-2">
        {rewardTiers.map((tier) => (
          <RewardTierCard
            key={tier.id}
            tier={tier}
            selected={selectedTierId === tier.id}
            onSelect={handleSelectTier}
          />
        ))}
      </div>
    </div>
  );
}
