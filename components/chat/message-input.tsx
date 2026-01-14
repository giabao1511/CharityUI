"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { emitTyping } from "@/lib/socket";
import {
  sendApiMessage,
  uploadApiMessageFiles,
  ApiMessage,
  ApiMessageMediaInput,
} from "@/lib/services/chat.service";

interface MessageInputProps {
  conversationId: number;
  onMessageSent: (message: ApiMessage) => void;
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle typing events
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Emit typing start
    if (newContent.length > 0 && !isTyping) {
      setIsTyping(true);
      emitTyping(conversationId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitTyping(conversationId, false);
    }, 2000);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Stop typing when component unmounts
      if (isTyping) {
        emitTyping(conversationId, false);
      }
    };
  }, [conversationId, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && files.length === 0) return;

    console.log("Sending message to conversation:", conversationId);
    setSending(true);

    try {
      let media: ApiMessageMediaInput[] = [];

      // Upload files if any
      if (files.length > 0) {
        setUploading(true);
        const uploadedFiles = await uploadApiMessageFiles(files);
        setUploading(false);

        if (uploadedFiles) {
          media = uploadedFiles;
        } else {
          toast.error("Failed to upload files");
          return;
        }
      }

      // Send message
      const messageContent = content.trim() || (files.length > 0 ? "Sent attachments" : "");
      console.log("Sending:", { conversationId, content: messageContent, media });

      const message = await sendApiMessage({
        conversationId,
        content: messageContent,
        media: media.length > 0 ? media : undefined,
      });

      console.log("Response:", message);

      if (message) {
        onMessageSent(message);
        setContent("");
        setFiles([]);

        // Stop typing indicator
        if (isTyping) {
          setIsTyping(false);
          emitTyping(conversationId, false);
        }
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  return (
    <div className="border-t p-3">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative bg-muted rounded-md p-2 flex items-center gap-2"
            >
              <span className="text-xs truncate max-w-[100px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Input
          value={content}
          onChange={handleContentChange}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1"
        />

        <Button
          type="submit"
          size="icon"
          className="shrink-0"
          disabled={sending || (!content.trim() && files.length === 0)}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {uploading && (
        <p className="text-xs text-muted-foreground mt-1">Uploading files...</p>
      )}
    </div>
  );
}
