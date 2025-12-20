"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getCampaignById } from "@/lib/services/campaign.service";
import { getCampaignVolunteers } from "@/lib/services/creator.service";
import {
  getCreatorCampaignDonations,
  getAllCampaignDonations,
} from "@/lib/services/donation.service";
import { exportDonationsToCSV } from "@/lib/utils/csv-export";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VolunteerList } from "@/components/creator/volunteer-list";
import { DonationsList } from "@/components/campaigns/donations-list";
import { Heading, BodyText } from "@/components/ui/typography";
import {
  formatCampaignAmount,
  calculateCampaignProgress,
  CampaignStatusNames,
  CampaignStatus,
} from "@/types/campaign";
import type { VolunteerRegistration } from "@/types/creator";
import type { Donation } from "@/types";
import {
  Loader2,
  AlertCircle,
  DollarSign,
  Target,
  Users,
  Calendar,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface CampaignDetailClientProps {
  campaignId: string;
}

export function CampaignDetailClient({
  campaignId,
}: CampaignDetailClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadCampaign() {
      // Check if user is authenticated
      if (!user) {
        setError("Please sign in to view campaign details");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Clear old data when refetching
        setCampaign(null);
        setVolunteers([]);
        setDonations([]);
        setTotalDonations(0);

        // Fetch campaign details, volunteers, and donations in parallel (first page only)
        const [campaignData, volunteersData, donationsData] = await Promise.all(
          [
            getCampaignById(campaignId),
            getCampaignVolunteers(campaignId),
            getCreatorCampaignDonations(campaignId, {
              page: 1,
              limit: 10,
            }).catch(() => ({
              data: [],
              pagination: { total: 0, page: 1, limit: 10 },
            })),
          ]
        );

        console.log("Campaign detail API response:", campaignData);
        console.log("Volunteers API response:", volunteersData);
        console.log("Donations API response:", donationsData);
        setCampaign(campaignData);
        setVolunteers(volunteersData.volunteers || []);
        setDonations(donationsData.data || []);
        setTotalDonations(donationsData.pagination?.total || 0);
      } catch (error) {
        console.error("Error loading campaign:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load campaign details"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [campaignId, user]);

  // Loading state
  if (loading) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Loading campaign details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !campaign) {
    return (
      <div className="container py-12">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Campaign
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error || "Campaign not found"}
              </p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/creator/campaigns">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Campaigns
                  </Link>
                </Button>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data from campaign with flexible structure handling
  const id = campaign.campaignId || campaign.fundId;
  const title = campaign.title || campaign.fundName;
  const description = campaign.description || "";
  const targetAmount = campaign.targetAmount || 0;
  const currentAmount = campaign.currentAmount || 0;
  const startDate = campaign.startDate;
  const endDate = campaign.endDate;

  // Get status
  let statusId = CampaignStatus.ACTIVE;
  if (campaign.status?.campaignStatusId) {
    statusId = campaign.status.campaignStatusId;
  } else if (typeof campaign.status === "number") {
    statusId = campaign.status;
  }

  // Get milestones (empty array if not provided)
  const milestones: any[] = campaign.milestones || [];

  // Calculate progress
  const progress = calculateCampaignProgress({
    targetAmount,
    currentAmount,
  } as any);

  // Get backers count (0 if not provided)
  const backersCount = campaign.backersCount || 0;

  // Handle CSV export
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const allDonations = await getAllCampaignDonations(campaignId);
      exportDonationsToCSV(allDonations, title);
      toast.success("Export Successful", {
        description: `Exported ${allDonations.length} donations to CSV`,
      });
    } catch (error) {
      console.error("Error exporting donations:", error);
      toast.error("Export Failed", {
        description: "Failed to export donations. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container py-12 md:py-16">
      {/* Breadcrumb */}
      <Link
        href="/creator/campaigns"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Campaigns
      </Link>

      {/* Campaign Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <Heading level={1} gutterBottom>
              {title}
            </Heading>
            <BodyText size="lg" muted>
              {description.substring(0, 200)}
              {description.length > 200 && "..."}
            </BodyText>
          </div>
          <Badge variant="default">{CampaignStatusNames[statusId]}</Badge>
        </div>

        {/* Campaign Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Raised</p>
                  <p className="text-xl font-bold">
                    {formatCampaignAmount(currentAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goal</p>
                  <p className="text-xl font-bold">
                    {formatCampaignAmount(targetAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Backers</p>
                  <p className="text-xl font-bold">
                    {backersCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="text-sm font-semibold">
                    {new Date(endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Campaign Progress</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="space-y-6">
        {/* Donations List */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Heading level={2} gutterBottom>
                  Donations ({totalDonations})
                </Heading>
                <BodyText muted>
                  View all donations received for this campaign
                </BodyText>
              </div>
              {totalDonations > 0 && (
                <Button
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  variant="outline"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </>
                  )}
                </Button>
              )}
            </div>
            <DonationsList
              campaignId={campaignId}
              initialDonations={donations}
              initialPage={1}
              initialTotalPages={Math.ceil(totalDonations / 10)}
            />
          </CardContent>
        </Card>

        {/* Volunteer Management */}
        <VolunteerList volunteers={volunteers} campaignId={id} />
      </div>
    </div>
  );
}
