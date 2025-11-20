"use client";

import { useState, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Loader2, Save } from "lucide-react";
import { Heading, BodyText } from "@/components/ui/typography";
import { ContributionHistory } from "@/types";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
  type UpdateProfileData,
} from "@/lib/services/user.service";
import { isTokenExpired } from "@/lib/services/auth.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Mock contribution history (will be replaced with real API data later)
const mockContributions: ContributionHistory[] = [
  {
    id: "c1",
    campaignId: "1",
    campaignName: "Clean Water for Rural Africa",
    amount: 1000,
    rewardReceived: "Village Champion",
    date: "2024-11-03",
    status: "completed",
  },
  {
    id: "c2",
    campaignId: "2",
    campaignName: "Education for All: School Supplies Drive",
    amount: 250,
    rewardReceived: "Gold Supporter",
    date: "2024-10-15",
    status: "completed",
  },
  {
    id: "c3",
    campaignId: "3",
    campaignName: "Community Health Clinic Construction",
    amount: 110,
    rewardReceived: "Silver Supporter",
    date: "2024-09-28",
    status: "pending",
  },
];

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState("contributions");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit mode: when enabled, we'll use a draft object to track changes
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState<UpdateProfileData>({});

  // Track if we've initiated profile load (prevent multiple calls)
  const hasInitiatedLoad = useRef(false);

  // Load profile data
  const loadProfile = async () => {
    // Check localStorage directly for token (more reliable than authUser during navigation)
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error(t("settings.notAuthenticated"), {
        description: t("settings.notAuthenticatedDesc"),
      });
      router.push("/auth");
      return;
    }

    const expired = isTokenExpired(accessToken);

    if (expired) {
      toast.error(t("settings.sessionExpired"), {
        description: t("settings.sessionExpiredDesc"),
      });
      logout();
      router.push("/auth");
      return;
    }

    setIsLoadingProfile(true);
    const result = await getMyProfile();
    console.log("my profilee", result);
    if (result.error) {
      toast.error(t("settings.updateFailed"), {
        description: result.error.message,
      });
    } else if (result.data) {
      setProfile(result.data);
      // Initialize edit draft with current profile data
      setEditDraft({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phoneNumber: result.data.phoneNumber || undefined,
      });
    }

    setIsLoadingProfile(false);
  };

  // Load profile on first render only (modern pattern without useEffect)
  // Check localStorage directly instead of waiting for authUser to prevent logout during locale switch
  if (!hasInitiatedLoad.current) {
    const hasToken =
      globalThis.window !== undefined && localStorage.getItem("accessToken");
    if (hasToken) {
      hasInitiatedLoad.current = true;
      loadProfile();
    }
  }

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!profile) return;

    setIsUpdating(true);

    const result = await updateMyProfile(editDraft);

    if (result.error) {
      toast.error(t("settings.updateFailed"), {
        description: result.error.message,
      });
    } else if (result.data) {
      setProfile(result.data);
      setEditMode(false);
      toast.success(t("settings.updateSuccess"));
    }

    setIsUpdating(false);
  };

  // Calculate member since date
  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return "N/A";
    return new Date(profile.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }, [profile]);

  // Redirect if not logged in - check localStorage directly to avoid false redirects during locale switching
  const hasAccessToken =
    globalThis.window !== undefined && localStorage.getItem("accessToken");
  if (!hasAccessToken && !isLoadingProfile) {
    return (
      <div className="container py-12 md:py-16 text-center">
        <Heading level={2}>{t("pleaseSignIn")}</Heading>
        <Button className="mt-4" asChild>
          <Link href="/auth">{t("signInAgain")}</Link>
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="container py-12 md:py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <BodyText muted>{t("loadingProfile")}</BodyText>
        </div>
      </div>
    );
  }

  // No profile loaded
  if (!profile) {
    return (
      <div className="container py-12 md:py-16 text-center space-y-4">
        <Heading level={2}>{t("failedToLoad")}</Heading>
        <BodyText muted>{t("checkBackend")}</BodyText>
        <BodyText muted size="sm">
          {t("checkConsole")}
        </BodyText>
        <div className="flex gap-4 justify-center">
          <Button onClick={loadProfile}>{t("tryAgain")}</Button>
          <Button variant="outline" onClick={logout} asChild>
            <Link href="/auth">{t("signInAgain")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-primary" aria-hidden="true" />
            )}
          </div>
          <div>
            <Heading level={1} className="mb-1">
              {profile.firstName} {profile.lastName}
            </Heading>
            <BodyText muted>{profile.email}</BodyText>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t("stats.totalContributions")}</CardDescription>
              <CardTitle className="text-3xl">
                {mockContributions.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t("stats.totalAmount")}</CardDescription>
              <CardTitle className="text-3xl">
                $
                {mockContributions
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>{t("stats.memberSince")}</CardDescription>
              <CardTitle className="text-3xl">{memberSince}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="contributions">
            {t("tabs.backedCampaigns")}
          </TabsTrigger>
          <TabsTrigger value="settings">{t("tabs.settings")}</TabsTrigger>
        </TabsList>

        <TabsContent value="contributions">
          <Card>
            <CardHeader>
              <CardTitle>{t("contributions.title")}</CardTitle>
              <CardDescription>
                {t("contributions.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("contributions.campaign")}</TableHead>
                      <TableHead>{t("contributions.amount")}</TableHead>
                      <TableHead>{t("contributions.reward")}</TableHead>
                      <TableHead>{t("contributions.date")}</TableHead>
                      <TableHead>{t("contributions.status")}</TableHead>
                      <TableHead className="text-right">
                        {t("contributions.action")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockContributions.map((contribution) => (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-medium">
                          {contribution.campaignName}
                        </TableCell>
                        <TableCell>
                          ${contribution.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {contribution.rewardReceived ? (
                            <Badge variant="secondary">
                              {contribution.rewardReceived}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {t("contributions.noReward")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(contribution.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            if (contribution.status === "completed") {
                              return (
                                <Badge>{t("contributions.completed")}</Badge>
                              );
                            }
                            if (contribution.status === "shipped") {
                              return (
                                <Badge variant="secondary">
                                  {t("contributions.shipped")}
                                </Badge>
                              );
                            }
                            return (
                              <Badge variant="secondary">
                                {t("contributions.pending")}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/campaigns/${contribution.campaignId}`}
                            >
                              {t("contributions.view")}
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {mockContributions.length === 0 && (
                <div className="py-12 text-center">
                  <BodyText muted>{t("contributions.emptyState")}</BodyText>
                  <Button className="mt-4" asChild>
                    <Link href="/campaigns">
                      {t("contributions.browseCampaigns")}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("settings.title")}</CardTitle>
                  <CardDescription>{t("settings.description")}</CardDescription>
                </div>
                {!editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t("settings.editProfile")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("settings.firstName")}</Label>
                <Input
                  id="firstName"
                  value={
                    editMode
                      ? editDraft.firstName || ""
                      : profile.firstName || ""
                  }
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, firstName: e.target.value })
                  }
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t("settings.lastName")}</Label>
                <Input
                  id="lastName"
                  value={
                    editMode ? editDraft.lastName || "" : profile.lastName || ""
                  }
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, lastName: e.target.value })
                  }
                  disabled={!editMode}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("settings.email")}</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <BodyText size="sm" muted>
                  {t("settings.emailCannotChange")}
                </BodyText>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t("settings.phoneNumber")}</Label>
                <Input
                  id="phoneNumber"
                  value={
                    editMode
                      ? editDraft.phoneNumber || ""
                      : profile.phoneNumber || ""
                  }
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      phoneNumber: e.target.value || undefined,
                    })
                  }
                  placeholder="+1234567890"
                  disabled={!editMode}
                />
              </div>

              {editMode && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("settings.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("settings.saveChanges")}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      // Reset draft to current profile values
                      setEditDraft({
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phoneNumber: profile.phoneNumber || undefined,
                      });
                    }}
                    disabled={isUpdating}
                  >
                    {t("settings.cancel")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("account.title")}</CardTitle>
              <CardDescription>{t("account.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <BodyText weight="semibold">{t("account.userId")}</BodyText>
                  <BodyText size="sm" muted>
                    {profile.userId}
                  </BodyText>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <BodyText weight="semibold">{t("account.status")}</BodyText>
                  <BodyText size="sm" muted>
                    {profile.isActive
                      ? t("account.active")
                      : t("account.inactive")}
                  </BodyText>
                </div>
                <Badge variant={profile.isActive ? "default" : "secondary"}>
                  {profile.isActive
                    ? t("account.active")
                    : t("account.inactive")}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <BodyText weight="semibold">{t("account.joined")}</BodyText>
                  <BodyText size="sm" muted>
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </BodyText>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
