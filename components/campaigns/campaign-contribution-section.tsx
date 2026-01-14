"use client";

import { useRef } from "react";
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
  const sidebarRef = useRef<HTMLDivElement>(null);

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
          campaignStatus={fund.status.campaignStatusId}
        />
      </div>
    </>
  );
}
