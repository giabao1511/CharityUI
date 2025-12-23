"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateOrganization,
  updateOrganizationMedia,
  uploadOrganizationAvatar,
} from "@/lib/services/organization.service";
import type {
  Organization,
  UpdateOrganizationRequest,
} from "@/types/organization";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EditOrganizationFormProps {
  organization: Organization;
}

export function EditOrganizationForm({
  organization,
}: EditOrganizationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateOrganizationRequest>({
    orgName: organization.orgName,
    email: organization.email,
    phoneNumber: organization.phoneNumber,
    address: organization.address,
    description: organization.description,
    website: organization.website,
    avatar: organization.avatar,
    media:
      organization.media?.map((m) => ({
        url: m.url,
        mediaType: m.mediaTypeId,
      })) || [],
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    organization.avatar || ""
  );
  const [mediaPreview, setMediaPreview] = useState<string[]>(
    organization.media?.map((m) => m.url) || []
  );

  const handleInputChange = (
    field: keyof UpdateOrganizationRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
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

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setFormData((prev) => ({ ...prev, avatar: "" }));
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = formData.avatar;
      let mediaUrls = formData.media;

      // Upload avatar if changed
      if (avatarFile) {
        setIsUploadingAvatar(true);
        try {
          const uploadResult = await uploadOrganizationAvatar(avatarFile);
          avatarUrl = uploadResult.Location;
          toast.success("Avatar uploaded successfully");
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Failed to upload avatar");
          setIsUploadingAvatar(false);
          setIsSubmitting(false);
          return;
        }
        setIsUploadingAvatar(false);
      }

      // Upload media if changed
      if (mediaFiles.length > 0) {
        setIsUploadingMedia(true);
        try {
          const uploadResult = await updateOrganizationMedia(mediaFiles);
          mediaUrls = uploadResult.map((r, idx) => ({
            url: r.Location,
            mediaType: 1, // Default media type, you can customize this
          }));
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

      // Update organization
      const updateData: UpdateOrganizationRequest = {
        ...formData,
        avatar: avatarUrl,
        media: mediaUrls,
      };

      await updateOrganization(organization.orgId, updateData);

      toast.success("Organization updated successfully");
      router.push(`/creator/organizations`);
      router.refresh();
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update organization"
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
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name *</Label>
            <Input
              id="orgName"
              value={formData.orgName}
              onChange={(e) => handleInputChange("orgName", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={5}
              placeholder="Describe your organization's mission and activities..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Avatar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {avatarPreview && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="avatar">Upload New Avatar</Label>
            <div className="flex items-center gap-3">
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="flex-1"
              />
              {isUploadingAvatar && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Media</CardTitle>
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
              {isUploadingMedia && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload multiple images or videos to showcase your organization
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
            "Update Organization"
          )}
        </Button>
      </div>
    </form>
  );
}
