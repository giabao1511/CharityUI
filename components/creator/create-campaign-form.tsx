"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCampaign,
  getCampaignCategories,
} from "@/lib/services/campaign.service";
import { getOrganizations } from "@/lib/services/organization.service";
import type { OrganizationListItem } from "@/types/organization";
import type { CampaignCategory } from "@/types/campaign";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  DollarSign,
  FileText,
  Building2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export function CreateCampaignForm() {
  const t = useTranslations("creator.create");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>(
    []
  );
  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    orgId: "",
    categoryId: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    targetAmount: "",
  });

  // Load organizations and categories
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        setAuthError(false); // Reset auth error state

        const [orgsResponse, categoriesResponse] = await Promise.all([
          getOrganizations({ page: 1, limit: 100 }),
          getCampaignCategories(1, 100), // Backend has limit validation, using 100
        ]);

        // Handle organizations data
        // orgsResponse.data is OrganizationListItem[]
        if (orgsResponse.data && Array.isArray(orgsResponse.data)) {
          setOrganizations(orgsResponse.data);
        } else {
          console.warn(
            "Organizations data is not an array:",
            orgsResponse.data
          );
        }

        // Handle categories data
        // categoriesResponse should be { data: CampaignCategory[], pagination: {...} }
        if (categoriesResponse) {
          // Check if data property exists (nested structure)
          if (
            "data" in categoriesResponse &&
            Array.isArray(categoriesResponse.data)
          ) {
            console.log(
              "Set categories from nested data:",
              categoriesResponse.data
            );
            console.log(
              "First category structure:",
              categoriesResponse.data[0]
            );
            setCategories(categoriesResponse.data);
          }
          // Check if it's already an array (direct structure)
          else if (Array.isArray(categoriesResponse)) {
            console.log(
              "Set categories from direct array:",
              categoriesResponse
            );
            console.log("First category structure:", categoriesResponse[0]);
            setCategories(categoriesResponse);
          } else {
            console.warn(
              "Categories data structure unexpected:",
              categoriesResponse
            );
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);

        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes("Unauthorized")) {
          setAuthError(true);
          toast.error("Please sign in to create a campaign");
        } else {
          toast.error("Failed to load organizations and categories");
        }
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orgId) {
      toast.error("Please select an organization");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);

      // Convert dates to ISO format if they're not already
      const startDate = new Date(formData.startDate).toISOString();
      const endDate = new Date(formData.endDate).toISOString();

      const campaignData = {
        categoryId: parseInt(formData.categoryId),
        title: formData.title,
        description: formData.description,
        startDate,
        endDate,
        targetAmount: parseFloat(formData.targetAmount),
        media: [],
      };

      const result = await createCampaign(formData.orgId, campaignData as any);

      console.log("Campaign creation result:", result);

      toast.success("Campaign created successfully!");

      // Handle different possible response structures
      const campaignId = result?.fundId || result?.id || result?.campaignId;

      if (campaignId) {
        router.push(`/creator/campaigns/${campaignId}`);
      } else {
        // If we can't get the ID, redirect to campaigns list
        console.warn("Could not determine campaign ID from result:", result);
        router.push("/creator/campaigns");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Show authentication error
  if (authError) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Authentication Required
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              You need to be signed in to create a campaign. Please sign in and
              try again.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading organizations and categories...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Selection */}
          <div className="space-y-2">
            <Label htmlFor="orgId" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t("organization")} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.orgId}
              onValueChange={(value) => handleChange("orgId", value)}
              required
            >
              <SelectTrigger id="orgId">
                <SelectValue placeholder={t("selectOrganization")} />
              </SelectTrigger>
              <SelectContent>
                {organizations.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No organizations available
                  </div>
                ) : (
                  organizations.map((org) => (
                    <SelectItem key={org.orgId} value={org.orgId.toString()}>
                      {org.orgName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {organizations.length > 0
                ? `${organizations.length} organization(s) available. ${t(
                    "organizationHelp"
                  )}`
                : "Loading organizations..."}
            </p>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              {t("category")} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleChange("categoryId", value)}
              required
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No categories available
                  </div>
                ) : (
                  categories.map((category: any) => (
                    <SelectItem
                      key={
                        category.categoryFundId ||
                        category.id ||
                        category.categoryId
                      }
                      value={
                        (
                          category.categoryFundId ||
                          category.id ||
                          category.categoryId
                        )?.toString() || ""
                      }
                    >
                      {category.categoryName || category.name || "Unknown"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {categories.length > 0
                ? `${categories.length} category(ies) available`
                : "Loading categories..."}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("campaignTitle")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={t("titlePlaceholder")}
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("description")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              required
              rows={6}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length} / 5000
            </p>
          </div>

          {/* Date Range */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("startDate")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t("endDate")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t("targetAmount")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="targetAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => handleChange("targetAmount", e.target.value)}
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("targetAmountHelp")}
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t("creating") : t("createCampaign")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
