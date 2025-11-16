"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading, BodyText } from "@/components/ui/typography";
import { Users, Briefcase, Image as ImageIcon } from "lucide-react";
import type { Organization } from "@/types/organization";

interface OrganizationTabsProps {
  organization: Organization;
}

export function OrganizationTabs({ organization }: OrganizationTabsProps) {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="campaigns">
          Campaigns ({organization.campaigns?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="team">
          Team ({organization.userRoles?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="media">
          Media ({organization.media?.length || 0})
        </TabsTrigger>
      </TabsList>

      {/* About Tab */}
      <TabsContent value="about" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Heading level={3} gutterBottom>
              {organization.orgName}
            </Heading>
            <div className="prose dark:prose-invert max-w-none">
              <BodyText muted className="whitespace-pre-wrap">
                {organization.description || "No description available"}
              </BodyText>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Campaigns Tab */}
      <TabsContent value="campaigns" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Heading level={3} className="mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Campaigns
            </Heading>
            {organization.campaigns && organization.campaigns.length > 0 ? (
              <div className="space-y-4">
                {organization.campaigns.map((campaign) => (
                  <div
                    key={campaign.campaignId}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Heading level={4} className="mb-0">
                        {campaign.title}
                      </Heading>
                      <Badge
                        variant={
                          campaign.status.campaignStatusId === 1
                            ? "default"
                            : "secondary"
                        }
                      >
                        {campaign.status.statusName}
                      </Badge>
                    </div>
                    <BodyText size="sm" muted className="line-clamp-2 mb-3">
                      {campaign.description}
                    </BodyText>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold">
                          ${campaign.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          raised of{" "}
                        </span>
                        <span className="font-semibold">
                          ${campaign.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {Math.round(
                          (campaign.currentAmount / campaign.targetAmount) * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <BodyText muted>No campaigns yet</BodyText>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Team Tab */}
      <TabsContent value="team" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <Heading level={3} className="mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members
            </Heading>
            {organization.userRoles && organization.userRoles.length > 0 ? (
              <div className="space-y-3">
                {organization.userRoles.map((userRole) => (
                  <div
                    key={userRole.userRoleId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <BodyText weight="medium">
                        {userRole.user?.username || `User ${userRole.userId}`}
                      </BodyText>
                      <BodyText size="sm" muted>
                        {userRole.user?.email}
                      </BodyText>
                    </div>
                    <Badge variant="outline">
                      {userRole.role?.roleName || "Member"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No team members listed</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Media Tab */}
      <TabsContent value="media" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Media Gallery
            </h3>
            {organization.media && organization.media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {organization.media.map((media) => (
                  <div
                    key={media.orgMediaId}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={media.url}
                      alt={`${organization.orgName} media`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <BodyText muted>No media files available</BodyText>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
