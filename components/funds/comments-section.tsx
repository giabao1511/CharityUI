"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, User } from "lucide-react";
import { Comment } from "@/types";
import { Heading, BodyText } from "@/components/ui/typography";
import { toast } from "sonner";

interface CommentsSectionProps {
  comments: Comment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Mock submission
    toast.success("Comment posted successfully!");
    setNewComment("");
  };

  const handleSubmitReply = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    // Mock submission
    toast.success("Reply posted successfully!");
    setReplyText("");
    setReplyingTo(null);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={isReply ? "ml-12 mt-4" : ""}>
      <Card className={isReply ? "bg-muted/30" : ""}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            {/* Comment content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <BodyText weight="semibold">{comment.author}</BodyText>
                <BodyText size="sm" muted>
                  {new Date(comment.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </BodyText>
              </div>

              <BodyText className="mb-3 whitespace-pre-wrap">{comment.content}</BodyText>

              {/* Reply button */}
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-primary"
                >
                  <MessageCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                  Reply
                </Button>
              )}

              {/* Reply form */}
              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="mb-2"
                    aria-label="Reply to comment"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Post Reply
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 mt-4">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* New comment form */}
      <Card>
        <CardContent className="p-6">
          <Heading level={3} gutterBottom>Post a Comment</Heading>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <Label htmlFor="new-comment">Your comment</Label>
              <Textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or share your thoughts..."
                rows={4}
                className="mt-2"
                aria-required="true"
              />
            </div>
            <Button type="submit">Post Comment</Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading level={3}>
            Comments & Questions
          </Heading>
          <BodyText muted>
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </BodyText>
        </div>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BodyText muted>
                No comments yet. Be the first to ask a question or share your thoughts!
              </BodyText>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  );
}
