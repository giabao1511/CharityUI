"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Fund, Donation } from "@/types";
import { Heading, BodyText, List } from "@/components/ui/typography";
import { VolunteersList } from "./volunteers-list";
import { CommentsSection } from "./comments-section";
import { DonationsList } from "./donations-list";
import { formatCurrency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface CampaignTabsProps {
  readonly campaign: Fund;
  readonly initialDonations?: Donation[];
  readonly totalDonations?: number;
}

export function CampaignTabs({
  campaign,
  initialDonations = [],
  totalDonations = 0,
}: CampaignTabsProps) {
  const locale = useLocale() as 'en' | 'vi';

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="description">Description & Updates</TabsTrigger>
        <TabsTrigger value="milestones">Milestones</TabsTrigger>
        <TabsTrigger value="donations">
          Donations ({totalDonations})
        </TabsTrigger>
        <TabsTrigger value="volunteers">
          Volunteers ({campaign.volunteers.length})
        </TabsTrigger>
        <TabsTrigger value="comments">
          Comments
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-6 mt-0">
        <Card>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="prose prose-sm max-w-none">
              <Heading level={2} gutterBottom>About This Campaign</Heading>
              <BodyText muted className="leading-relaxed mb-4">
                {campaign.fullDescription}
              </BodyText>

              <Heading level={3} className="mt-6 mb-3">Campaign Story</Heading>
              <BodyText muted className="leading-relaxed">
                This campaign was created to address a critical need in our community. Your
                support will make a direct impact and help us achieve our goal of making a
                positive difference.
              </BodyText>

              <Heading level={3} className="mt-6 mb-3">How Funds Will Be Used</Heading>
              <List>
                <li>Direct program implementation and execution</li>
                <li>Administrative costs and operational expenses</li>
                <li>Community outreach and engagement activities</li>
                <li>Monitoring and evaluation of impact</li>
              </List>
            </div>
          </CardContent>
        </Card>

        {campaign.updates && campaign.updates.length > 0 && (
          <Card>
            <CardContent className="pt-6 px-6 pb-6">
              <Heading level={2} gutterBottom>Campaign Updates</Heading>
              <div className="space-y-4">{campaign.updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">{update.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="milestones" className="mt-0">
        <Card>
          <CardContent className="pt-6 px-6 pb-6">
            <Heading level={2} className="mb-6">Campaign Milestones</Heading>
            <div className="space-y-6">
              {campaign.milestones.map((milestone, index) => {
                const isCompleted = milestone.status === "achieved";
                const isInProgress = milestone.status === "in-progress";

                // Determine styling based on status
                const circleClasses = isCompleted
                  ? "border-green-500 bg-green-500 text-white"
                  : isInProgress
                  ? "border-primary bg-background text-primary"
                  : "border-muted-foreground bg-background text-muted-foreground";

                const statusColor = isCompleted
                  ? "text-green-600"
                  : isInProgress
                  ? "text-orange-600"
                  : "text-muted-foreground";

                const statusText = isCompleted
                  ? "Completed"
                  : isInProgress
                  ? "In Progress"
                  : "Pending";

                return (
                  <div key={milestone.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${circleClasses}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isInProgress ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      {index < campaign.milestones.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 ${
                            isCompleted ? "bg-green-500" : "bg-muted"
                          }`}
                          style={{ minHeight: "40px" }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold">{milestone.title}</h3>
                        <span className={`shrink-0 text-xs font-medium ${statusColor}`}>
                          {statusText}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {milestone.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Funding Required: {formatCurrency(milestone.fundingRequired)}</span>
                        {milestone.achievedDate && (
                          <span>
                            Completed:{" "}
                            {new Date(milestone.achievedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="donations" className="mt-0">
        <DonationsList
          campaignId={campaign.id}
          initialDonations={initialDonations}
          initialPage={1}
          initialTotalPages={Math.ceil(totalDonations / 10)}
        />
      </TabsContent>

      <TabsContent value="volunteers" className="mt-0">
        <VolunteersList volunteers={campaign.volunteers} />
      </TabsContent>

      <TabsContent value="comments" className="mt-0">
        <CommentsSection campaignId={parseInt(campaign.id)} />
      </TabsContent>
    </Tabs>
  );
}
