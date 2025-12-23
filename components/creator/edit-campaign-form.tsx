"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  updateCampaign,
  uploadCampaignBanner,
  uploadCampaignMedia,
} from "@/lib/services/campaign.service";
import type { UpdateCampaignRequest } from "@/types/campaign";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EditCampaignFormProps {
  campaign: any; // Using any since campaign structure varies
}

export function EditCampaignForm({ campaign }: EditCampaignFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Extract campaign ID
  const campaignId = campaign.campaignId || campaign.fundId;

  // Form state
  const [formData, setFormData] = useState<UpdateCampaignRequest>({
    title: campaign.title || campaign.fundName || "",
    description: campaign.description || "",
    targetAmount: campaign.targetAmount || 0,
    startDate: campaign.startDate
      ? new Date(campaign.startDate).toISOString().split("T")[0]
      : "",
    endDate: campaign.endDate
      ? new Date(campaign.endDate).toISOString().split("T")[0]
      : "",
    statusId: campaign.status?.campaignStatusId || campaign.statusId || 1,
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string>(
    campaign.banner || campaign.image || ""
  );
  const [mediaPreview, setMediaPreview] = useState<string[]>(
    campaign.media?.map((m: any) => m.url) || campaign.images || []
  );

  const handleInputChange = (
    field: keyof UpdateCampaignRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMediaFiles(files);

      // Generate previews
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setMediaPreview(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload banner if changed
      if (bannerFile) {
        setIsUploadingBanner(true);
        try {
          const uploadResult = await uploadCampaignBanner(bannerFile);
          toast.success("Banner uploaded successfully");
        } catch (error) {
          console.error("Error uploading banner:", error);
          toast.error("Failed to upload banner");
          setIsUploadingBanner(false);
          setIsSubmitting(false);
          return;
        }
        setIsUploadingBanner(false);
      }

      // Upload media if changed
      if (mediaFiles.length > 0) {
        setIsUploadingMedia(true);
        try {
          const uploadResult = await uploadCampaignMedia(mediaFiles);
          toast.success("Media uploaded successfully");
        } catch (error) {
          console.error("Error uploading media:", error);
          toast.error("Failed to upload media");
          setIsUploadingMedia(false);
          setIsSubmitting(false);
          return;
        }
        setIsUploadingMedia(false);
      }

      // Update campaign
      await updateCampaign(campaignId, formData);

      toast.success("Campaign updated successfully");
      router.push(`/creator/campaigns`);
      router.refresh();
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update campaign"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              placeholder="Describe your campaign goals and how funds will be used..."
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount *</Label>
              <Input
                id="targetAmount"
                type="number"
                min="0"
                step="1000"
                value={formData.targetAmount}
                onChange={(e) =>
                  handleInputChange("targetAmount", Number(e.target.value))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusId">Status</Label>
              <select
                id="statusId"
                value={formData.statusId}
                onChange={(e) =>
                  handleInputChange("statusId", Number(e.target.value))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={1}>Active</option>
                <option value={2}>Paused</option>
                <option value={3}>Completed</option>
                <option value={4}>Closed</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bannerPreview && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={bannerPreview}
                alt="Banner preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeBanner}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="banner">Upload New Banner</Label>
            <div className="flex items-center gap-3">
              <Input
                id="banner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="flex-1"
              />
              {isUploadingBanner && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended: 16:9 aspect ratio, at least 1200x675px
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Media Gallery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mediaPreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaPreview.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden border"
                >
                  <Image
                    src={preview}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMediaFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="media">Upload Media Files</Label>
            <div className="flex items-center gap-3">
              <Input
                id="media"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
                className="flex-1"
              />
              {isUploadingMedia && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload multiple images or videos to showcase your campaign
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Campaign"
          )}
        </Button>
      </div>
    </form>
  );
}
