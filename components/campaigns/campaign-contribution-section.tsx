"use client";

import { useState, useRef } from "react";
import { RewardTiersList } from "./reward-tiers-list";
import { ContributionSidebar } from "./contribution-sidebar";
import { CampaignItem } from "@/types/fund";

interface FundContributionSectionProps {
  fund: CampaignItem;
  percentageFunded: number;
  daysLeft: number;
}

export function FundContributionSection({ 
  fund, 
  percentageFunded, 
  daysLeft 
}: FundContributionSectionProps) {
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    
    // Scroll to sidebar on mobile/tablet
    if (window.innerWidth < 1024 && sidebarRef.current) {
      setTimeout(() => {
        sidebarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      {/* Reward Tiers Section - Only show if fund has reward tiers */}
      {/* {fund.rewardTiers && fund.rewardTiers.length > 0 && (
        <RewardTiersList 
          rewardTiers={fund.rewardTiers} 
          onSelectTier={handleSelectTier}
        />
      )} */}

      {/* Contribution Sidebar */}
      <div ref={sidebarRef}>
        <ContributionSidebar
          campaignId={fund.campaignId}
          goalAmount={fund.targetAmount}
          currentAmount={fund.currentAmount}
          daysLeft={daysLeft}
          percentageFunded={percentageFunded}
          selectedTierId={selectedTierId}
        />
      </div>
    </>
  );
}
