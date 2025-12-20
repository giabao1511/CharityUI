"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Loader2, ImageIcon, X } from "lucide-react";
import { Comment, CommentMedia } from "@/types";
import { Heading, BodyText } from "@/components/ui/typography";
import { toast } from "sonner";
import {
  getCampaignComments,
  createComment,
  uploadCommentMedia,
  getCommentAuthorName,
  formatCommentDate,
} from "@/lib/services/comment.service";
import { isAuthenticated } from "@/lib/services/auth.service";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface CommentsSectionProps {
  campaignId: number;
}

const COMMENTS_PER_PAGE = 10;

export function CommentsSection({ campaignId }: CommentsSectionProps) {
  const router = useRouter();
  const t = useTranslations("campaigns.comments");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Check if user is authenticated
  const userIsAuthenticated = isAuthenticated();

  // Fetch comments
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, currentPage]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const result = await getCampaignComments(campaignId, {
        page: currentPage,
        limit: COMMENTS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });

      if (result.data) {
        setComments(result.data);
        if (result.pagination) {
          setTotalComments(result.pagination.total);
          setTotalPages(Math.ceil(result.pagination.total / COMMENTS_PER_PAGE));
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(t("commentFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Limit to 3 files
      if (selectedFiles.length + fileArray.length > 3) {
        toast.error(t("maxImages"));
        return;
      }
      setSelectedFiles([...selectedFiles, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userIsAuthenticated) {
      toast.error(t("signInToComment"));
      router.push("/auth?tab=signin");
      return;
    }

    if (!newComment.trim()) {
      toast.error(t("enterComment"));
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload media files if any
      let mediaUrls: CommentMedia[] = [];
      if (selectedFiles.length > 0) {
        setIsUploadingMedia(true);
        const uploadedFiles = await uploadCommentMedia(selectedFiles);
        mediaUrls = uploadedFiles.map((file: any) => ({
          mediaTypeId: file.mediaType,
          url: file.url,
        }));
        setIsUploadingMedia(false);
      }

      // Create comment
      await createComment({
        campaignId,
        content: newComment.trim(),
        media: mediaUrls.length > 0 ? mediaUrls : undefined,
      });

      toast.success(t("commentPosted"));
      setNewComment("");
      setSelectedFiles([]);

      // Refresh comments - go to first page to see the new comment
      setCurrentPage(1);
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(t("commentFailed"));
    } finally {
      setIsSubmitting(false);
      setIsUploadingMedia(false);
    }
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.commentId}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {comment.user?.avatar ? (
                <Image
                  src={comment.user.avatar}
                  alt={getCommentAuthorName(comment)}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <User className="h-5 w-5 text-primary" aria-hidden="true" />
              )}
            </div>

            {/* Comment content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <BodyText weight="semibold">
                  {getCommentAuthorName(comment)}
                </BodyText>
                <BodyText size="sm" muted>
                  {formatCommentDate(comment.createdAt)}
                </BodyText>
              </div>

              <BodyText className="mb-3 whitespace-pre-wrap">
                {comment.content}
              </BodyText>

              {/* Media attachments */}
              {comment.media && comment.media.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {comment.media.map((media, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-md overflow-hidden"
                    >
                      <Image
                        src={media.url}
                        alt={`Comment image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* New comment form */}
      <Card>
        <CardContent className="p-6">
          <Heading level={3} gutterBottom>
            {t("postComment")}
          </Heading>
          {userIsAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <Label htmlFor="new-comment">{t("yourComment")}</Label>
                <Textarea
                  id="new-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t("commentPlaceholder")}
                  rows={4}
                  className="mt-2"
                  aria-required="true"
                  disabled={isSubmitting}
                />
              </div>

              {/* File upload section */}
              <div>
                <Label htmlFor="comment-images">
                  {t("images")}
                </Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="comment-images"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isSubmitting || selectedFiles.length >= 3}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("comment-images")?.click()
                    }
                    disabled={isSubmitting || selectedFiles.length >= 3}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {t("addImages")}
                  </Button>
                </div>

                {/* Preview selected files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting || isUploadingMedia}>
                {isUploadingMedia ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("uploadingImages")}
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("posting")}
                  </>
                ) : (
                  t("postButton")
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <BodyText muted className="mb-4">
                {t("signInToComment")}
              </BodyText>
              <Button onClick={() => router.push("/auth?tab=signin")}>
                {t("signIn")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading level={3}>{t("title")}</Heading>
          <BodyText muted>
            {t("commentsCount", { count: totalComments })}
          </BodyText>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <BodyText muted>{t("loadingComments")}</BodyText>
            </CardContent>
          </Card>
        ) : comments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BodyText muted>
                {t("noComments")}
              </BodyText>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {comments.map((comment) => renderComment(comment))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
