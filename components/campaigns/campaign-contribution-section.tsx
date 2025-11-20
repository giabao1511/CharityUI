"use client";

import { useState, useRef } from "react";
import { RewardTiersList } from "./reward-tiers-list";
import { ContributionSidebar } from "./contribution-sidebar";
import { Fund } from "@/types";

interface FundContributionSectionProps {
  fund: Fund;
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
      {fund.rewardTiers && fund.rewardTiers.length > 0 && (
        <RewardTiersList 
          rewardTiers={fund.rewardTiers} 
          onSelectTier={handleSelectTier}
        />
      )}

      {/* Contribution Sidebar */}
      <div ref={sidebarRef}>
        <ContributionSidebar
          campaignId={fund.id}
          goalAmount={fund.goalAmount}
          currentAmount={fund.currentAmount}
          backers={fund.backers}
          daysLeft={daysLeft}
          percentageFunded={percentageFunded}
          rewardTiers={fund.rewardTiers}
          selectedTierId={selectedTierId}
        />
      </div>
    </>
  );
}
